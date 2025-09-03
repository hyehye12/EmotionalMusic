const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const redis = require("redis");
require("dotenv").config();

// Supabase 설정
const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 라우트 import
const authRoutes = require("./src/routes/auth");
const diaryRoutes = require("./src/routes/diary");
const musicRoutes = require("./src/routes/music");
const dashboardRoutes = require("./src/routes/dashboard");
const dailyEntriesRoutes = require("./src/routes/dailyEntries");

const app = express();
const PORT = process.env.PORT || 5000;

// MemoryStore 경고 무시 (의도적으로 메모리 저장소 사용)
process.on('warning', (warning) => {
  if (warning.name === 'Warning' && warning.message && 
      warning.message.includes('connect.session() MemoryStore')) {
    // MemoryStore 경고는 무시 (의도적 사용)
    return;
  }
  console.warn(warning.name, warning.message);
});

// CORS 설정
const allowedOrigins = [
  "http://localhost:3000",
  "https://emotional-music.vercel.app", // 실제 Vercel URL로 변경
  "https://*.vercel.app", // Vercel 도메인 패턴
];

app.use(
  cors({
    origin: function (origin, callback) {
      // origin이 없는 경우 (같은 도메인) 허용
      if (!origin) return callback(null, true);

      // 허용된 origin 목록에 있는지 확인
      if (
        allowedOrigins.some((allowedOrigin) => {
          if (allowedOrigin.includes("*")) {
            const pattern = allowedOrigin.replace("*", ".*");
            return new RegExp(pattern).test(origin);
          }
          return origin === allowedOrigin;
        })
      ) {
        callback(null, true);
      } else {
        console.log("Blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// Redis 클라이언트 설정
let redisClient;
let redisStore;

if (process.env.NODE_ENV === 'production' && process.env.REDIS_URL) {
  // 프로덕션: Redis 사용
  redisClient = redis.createClient({
    url: process.env.REDIS_URL,
    legacyMode: true
  });
  
  redisClient.connect().catch(console.error);
  redisStore = new RedisStore({ client: redisClient });
  
  console.log('✅ Redis 세션 저장소 사용');
} else {
  // 메모리 저장소 사용 (Redis 미설정시)
  if (process.env.NODE_ENV === 'production') {
    console.log('⚠️  프로덕션에서 메모리 세션 저장소 사용중 (Redis 권장하지만 현재 설정으로 진행)');
  } else {
    console.log('⚠️  개발환경에서 메모리 세션 저장소 사용');
  }
}

// Session 설정
const sessionConfig = {
  secret: process.env.SESSION_SECRET || "your-default-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production", // 프로덕션에서는 HTTPS 필요
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24시간
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // 크로스 도메인 허용
  },
};

// Redis가 있으면 사용, 없으면 메모리 저장소 (프로덕션에서 경고 무시)
if (redisStore) {
  sessionConfig.store = redisStore;
}

app.use(session(sessionConfig));

// 환경변수 (서버에서 관리)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// 라우트 연결
app.use("/api/auth", authRoutes);
app.use("/api/diary", diaryRoutes);
app.use("/api/music", musicRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/daily-entries", dailyEntriesRoutes);

// GPT API 프록시 - 일기 분석
app.post("/api/gpt/analyze-diary", async (req, res) => {
  try {
    const { diaryText, userId } = req.body;

    if (!OPENAI_API_KEY) {
      return res.json({
        emotion: "평온함",
        analysis: "API 키가 설정되지 않았습니다.",
        advice: "마음을 편안하게 하고, 자신에게 친절하게 대하세요.",
        encouragement: "당신은 충분히 잘하고 있어요. 힘내세요! 💪",
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `당신은 따뜻하고 공감적인 감정 상담사입니다. 사용자의 일기를 분석하여 감정을 파악하고, 
            공감과 위로, 그리고 실용적인 조언을 제공해주세요. 
            응답은 다음 JSON 형식으로 해주세요:
            {
              "emotion": "감정 (행복함/우울함/스트레스/설렘/평온함/지침 중 하나)",
              "analysis": "일기에 대한 깊이 있는 분석 (2-3문장)",
              "advice": "실용적인 조언이나 해결책 (2-3문장)",
              "encouragement": "따뜻한 격려나 응원의 말 (1-2문장)"
            }`,
          },
          {
            role: "user",
            content: `다음은 사용자가 작성한 일기입니다. 위의 형식에 맞춰 분석해주세요:\n\n${diaryText}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error("GPT API 호출 실패");
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // JSON 파싱
    const result = JSON.parse(content);

    // 사용자 ID가 있으면 감정 분석 데이터 저장
    if (userId) {
      try {
        await supabase.from("emotion_analyses").insert({
          user_id: userId,
          input_text: diaryText,
          detected_emotion: result.emotion,
          advice: result.advice,
          analysis_type: "diary",
        });
      } catch (dbError) {
        console.error("일기 분석 데이터 저장 실패:", dbError);
      }
    }

    res.json({
      emotion: result.emotion,
      analysis: result.analysis,
      advice: result.advice,
      encouragement: result.encouragement,
    });
  } catch (error) {
    console.error("GPT 분석 오류:", error);
    res.status(500).json({
      emotion: "평온함",
      analysis:
        "일기를 분석하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      advice: "마음을 편안하게 하고, 자신에게 친절하게 대하세요.",
      encouragement: "당신은 충분히 잘하고 있어요. 힘내세요! 💪",
    });
  }
});

// 3. 헬스 체크
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    apis: {
      openai: !!OPENAI_API_KEY,
      supabase: !!supabaseUrl && !!supabaseServiceKey,
      itunes: true, // iTunes API는 무료이므로 항상 사용 가능
    },
  });
});

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다`);
  console.log(`API 상태:`);
  console.log(`- OpenAI: ${OPENAI_API_KEY ? "설정됨" : "설정되지 않음"}`);
  console.log(
    `- Supabase: ${
      supabaseUrl && supabaseServiceKey ? "설정됨" : "설정되지 않음"
    }`
  );
  console.log(`- iTunes: 항상 사용 가능 (무료 API)`);
});
