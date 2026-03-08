import "dotenv/config";

import express from "express";
import cors from "cors";

import { supabase } from "./lib/supabase";
import authRoutes from "./routes/auth";
import diaryRoutes from "./routes/diary";
import musicRoutes from "./routes/music";
import dashboardRoutes from "./routes/dashboard";
import dailyEntriesRoutes from "./routes/dailyEntries";

const app = express();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.get("/", (_req, res) => {
  res.send("Welcome to the Emotional Music API Server!");
});

const allowedOrigins = [
  "http://localhost:3000",
  "https://emotional-music.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
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
  }),
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/diary", diaryRoutes);
app.use("/api/music", musicRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/daily-entries", dailyEntriesRoutes);

// GPT API 프록시 - 일기 분석 (Gemini)
app.post("/api/gpt/analyze-diary", async (req, res) => {
  try {
    const { diaryText, userId } = req.body as {
      diaryText: string;
      userId?: string;
    };

    if (!GEMINI_API_KEY) {
      res.json({
        emotion: "평온함",
        analysis: "API 키가 설정되지 않았습니다.",
        advice: "마음을 편안하게 하고, 자신에게 친절하게 대하세요.",
        encouragement: "당신은 충분히 잘하고 있어요. 힘내세요! 💪",
      });
      return;
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: `당신은 따뜻하고 공감적인 감정 상담사입니다. 사용자의 일기를 분석하여 감정을 파악하고,
공감과 위로, 그리고 실용적인 조언을 제공해주세요.
반드시 다음 JSON 형식으로만 응답하고, JSON 외의 텍스트는 포함하지 마세요:
{
  "emotion": "사용자가 입력한 일기의 대표 감정 (1~3단어)",
  "analysis": "일기에 대한 깊이 있는 분석 (2-3문장)",
  "advice": "실용적인 조언이나 해결책 (2-3문장)",
  "encouragement": "따뜻한 격려나 응원의 말 (1-2문장)"
}`,
              },
            ],
          },
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `다음은 사용자가 작성한 일기입니다. 위의 JSON 형식에 맞춰 분석해주세요:\n\n${diaryText}`,
                },
              ],
            },
          ],
          generationConfig: { temperature: 0.7, maxOutputTokens: 600 },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Gemini API 호출 실패: ${response.status}`);
    }

    const data = (await response.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) throw new Error("Gemini 응답에 content가 없습니다.");

    let result: {
      emotion: string;
      analysis: string;
      advice: string;
      encouragement: string;
    };
    try {
      const cleaned = content
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/\s*```$/, "");
      result = JSON.parse(cleaned);
    } catch {
      throw new Error("Gemini 응답을 JSON으로 파싱할 수 없습니다.");
    }

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

    res.json(result);
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

// 헬스 체크
app.get("/api/health", (_req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    apis: {
      gemini: !!GEMINI_API_KEY,
      supabase:
        !!process.env.REACT_APP_SUPABASE_URL &&
        !!process.env.REACT_APP_SUPABASE_SERVICE_KEY,
      itunes: true,
    },
  });
});

export default app;
