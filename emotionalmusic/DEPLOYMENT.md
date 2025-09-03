# 🚀 EmotionalMusic 배포 가이드

이 프로젝트는 React 프론트엔드 + Express 백엔드로 구성되어 있어서 **별도로 배포**해야 합니다.

## 📋 배포 옵션

### 옵션 1: 백엔드와 프론트엔드 별도 배포 (권장)

#### 1️⃣ 백엔드 배포 (Render/Railway/Heroku)

**Render 배포 (무료)**:
1. [Render.com](https://render.com)에 가입
2. "New Web Service" 생성
3. GitHub 저장소 연결
4. 설정:
   - **Build Command**: `npm install`
   - **Start Command**: `npm run server`
   - **Environment**: Node
5. 환경변수 설정:
   ```
   SUPABASE_URL=https://jdkmxblwafnphvohhlde.supabase.co
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   OPENAI_API_KEY=your_openai_api_key_here
   SESSION_SECRET=47a9e5d45c8331ef1a3a9ffefb3507cd5e3b60c168158633dd0c3fd85c08439778ad58c2ad1b90e9b3cf325475af3ab27865357d563e432d3f18c90a9b035fd6
   NODE_ENV=production
   PORT=10000
   ```

#### 2️⃣ 프론트엔드 배포 (Vercel)

1. **server.js에서 실제 백엔드 URL로 CORS 수정**:
   ```javascript
   const allowedOrigins = [
     "http://localhost:3000",
     "https://your-app-name.vercel.app", // 실제 Vercel URL
     "https://*.vercel.app"
   ];
   ```

2. **Vercel 환경변수 설정**:
   ```
   REACT_APP_API_URL=https://your-backend-app.onrender.com/api
   REACT_APP_SUPABASE_URL=https://jdkmxblwafnphvohhlde.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 옵션 2: Vercel Serverless Functions 사용

백엔드 코드를 Vercel의 서버리스 함수로 변환:

1. `api/` 폴더 생성하고 각 라우트를 개별 함수로 변환
2. Express 세션 대신 JWT 토큰 사용
3. 파일 구조:
   ```
   api/
   ├── auth.js
   ├── diary.js
   ├── music.js
   └── daily-entries.js
   ```

## 🔧 현재 문제 해결

### 1. CORS 오류
- server.js에서 Vercel 도메인을 허용하도록 수정됨
- 실제 배포 URL로 `allowedOrigins` 업데이트 필요

### 2. 세션 쿠키 오류  
- HTTPS에서 작동하도록 쿠키 설정 수정됨
- `sameSite: 'none'` 설정으로 크로스 도메인 허용

### 3. API URL 오류
- 프론트엔드에서 `REACT_APP_API_URL` 환경변수로 백엔드 URL 설정

## ⚡ 빠른 해결책

**현재 상황에서 가장 빠른 해결책**:

1. **Render에 백엔드 배포** (5분)
2. **Vercel 환경변수에 백엔드 URL 설정** (1분)
3. **server.js에서 Vercel URL 허용** (1분)

총 소요시간: **약 10분**

## 🌐 환경변수 설정 리스트

### 백엔드 (Render/Railway/Heroku)
```
SUPABASE_URL=https://jdkmxblwafnphvohhlde.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENAI_API_KEY=your_openai_api_key_here
SESSION_SECRET=47a9e5d45c8331ef1a3a9ffefb3507cd5e3b60c168158633dd0c3fd85c08439778ad58c2ad1b90e9b3cf325475af3ab27865357d563e432d3f18c90a9b035fd6
NODE_ENV=production
```

### 프론트엔드 (Vercel)
```
REACT_APP_API_URL=https://your-backend-app.onrender.com/api
REACT_APP_SUPABASE_URL=https://jdkmxblwafnphvohhlde.supabase.co  
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🚨 보안 주의사항

1. **환경변수 보안**: `.env` 파일을 GitHub에 커밋하지 마세요
2. **API 키 관리**: OpenAI API 키 사용량 모니터링
3. **CORS 설정**: 실제 도메인만 허용하도록 설정
4. **HTTPS 강제**: 프로덕션에서는 항상 HTTPS 사용