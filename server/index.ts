import "dotenv/config"; // 반드시 첫 번째 — 라우트 모듈보다 먼저 .env 로드

import app from "./app";

const PORT = parseInt(process.env.PORT || "5000", 10);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다`);
  console.log(`- OpenAI: ${OPENAI_API_KEY ? "설정됨" : "설정되지 않음"}`);
  console.log(
    `- Supabase: ${process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_SERVICE_KEY ? "설정됨" : "설정되지 않음"}`,
  );
  console.log(`- iTunes: 항상 사용 가능 (무료 API)`);
});
