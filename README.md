# 📌 프로젝트명: EmotionalMusic — 감정 기반 AI 분석 음악 추천 웹앱

> 경험을 통해 AI 실습과 웹 전체 흐름을 체득하는 것을 목표로 하였습니다.

---

## 📆 프로젝트 기간

- 시작일: 2025.07.23
- 종료일: 2025.08.~

---

## 🎯 주요 목표

- **핵심 기능1:** GPT 기반 텍스트/일기 감정 분석 파이프라인 구현
- **핵심 기능2:** 감정 레이블에 따라 iTunes 음악을 추천 및 미리듣기 제공
- **핵심 기능3:** 감정 일기 저장, 조회, 대시보드 시각화로 변화를 추적
- **핵심 기능4:** JWT 인증, 사용자별 개인화 데이터 및 권한 처리

---

## ⚙️ 사용 기술 스택

| 분류       | 기술명                                                                  |
| ---------- | ----------------------------------------------------------------------- |
| 프론트엔드 | React 19, TypeScript, Tailwind CSS, DaisyUI, Framer Motion              |
| 백엔드     | Node.js, Express.js, MongoDB (Mongoose), JWT, OpenAI API, iTunes Search |
| 기타       | Git, GitHub, Postman, Vercel/Render, ESLint/Prettier                    |

---

## 🧱 프로젝트 구조

```bash
emotionalmusic/                                    # 🎵 프로젝트 루트
│
├── 📄 DEPLOYMENT.md                               # 🚀 Vercel 배포 가이드
├── 📦 package.json                                # 📦 프로젝트 설정 & 의존성
├── 📦 package-lock.json                           # 🔒 의존성 잠금 파일
├── 🚀 server.js                                   # 🌐 Express 서버 메인
├── ⚙️ vercel.json                                 # ☁️ Vercel 배포 설정
├── �� tailwind.config.js                          # 🎨 Tailwind CSS 설정
├── ⚙️ postcss.config.js                           # 🔧 PostCSS 설정
├── 📝 tsconfig.json                               # 📝 TypeScript 설정
└── 🗄️ supabase-daily-entries.sql                  # 🗄️ Supabase 스키마
│
├── 📁 public/                                     # 🌐 정적 자산
│   ├── 🏠 index.html                              # HTML 템플릿
│   ├── 🎯 favicon.ico                             # 파비콘
│   ├── 🖼️ logo192.png                             # 앱 로고
│   ├── 📄 manifest.json                           # PWA 매니페스트
│   └── 📄 robots.txt                              # SEO 설정
│
└── 📁 src/                                        # ⚛️ React 소스코드
    │
    ├── 🚀 App.tsx                                 # 🚀 메인 앱 컴포넌트
    ├── 🚀 index.tsx                               # 🚀 앱 진입점
    └── �� react-app-env.d.ts                      # 📝 TypeScript 타입 정의
    │
    ├── 📁 components/                             #  재사용 컴포넌트
    │   ├── 📖 DiarySlider.tsx                     # 📖 일기 슬라이더
    │   └── ⏳ LoadingSpinner.tsx                  # ⏳ 로딩 스피너
    │
    ├── 📁 config/                                 # ⚙️ 앱 설정
    │   └── 🗄️ supabase.ts                         # 🗄️ Supabase 클라이언트
    │
    ├── 📁 data/                                   #  정적 데이터
    │   ├── 🎭 emotionConstants.ts                 # 🎭 감정 상수
    │   └── 🎵 emotionData.ts                      # 🎵 감정별 데이터
    │
    ├── 📁 hooks/                                  # 🎣 커스텀 훅
    │   ├── 🔐 useAuth.ts                          # 🔐 인증 훅
    │   ├── 📖 useDiaryStore.ts                    #  일기 상태 관리
    │   ├── 🤖 useGPTAnalysis.ts                   #  GPT 분석 훅
    │   └── 🎵 useMusicSearch.ts                   # 🎵 음악 검색 훅
    │
    ├── 📁 pages/                                  #  페이지 컴포넌트
    │   ├── 🔐 AuthPage.tsx                        #  로그인/회원가입
    │   ├── 📊 DashboardPage.tsx                   # 📊 대시보드
    │   ├── �� GPTAnalysisPage.tsx                 #  GPT 분석
    │   ├── 🏠 MainPage.tsx                        #  메인 페이지
    │   ├── �� MusicBoardPage.tsx                  # 🎵 음악 커뮤니티
    │   └── 🎯 ResultPage.tsx                      #  음악 추천 결과
    │
    ├── 📁 routes/                                 # ��️ 백엔드 API 라우트
    │   ├── 🔐 auth.js                             #  인증 API
    │   ├── 📅 dailyEntries.js                     # 📅 일일 기록 API
    │   ├── 📊 dashboard.js                        #  대시보드 API
    │   ├── 📖 diary.js                            #  일기 API
    │   └── 🎵 music.js                            #  음악 API
    │
    ├── 📁 services/                               # 🔧 비즈니스 로직
    │   ├── 🔐 authService.ts                      #  인증 서비스
    │   ├── 🎵 itunes.ts                           #  iTunes API
    │   └── 🗄️ supabaseService.ts                  # 🗄️ Supabase 서비스
    │
    ├── 📁 styles/                                 # 🎨 스타일시트
    │   └── 🎨 index.css                           # 🎨 글로벌 CSS
    │
    └── 📁 utils/                                  # 🛠️ 유틸리티
        ├── 🌐 apiUtils.ts                         #  API 유틸리티
        ├── �� emotionAnalyzer.ts                  # 🎭 감정 분석
        └── 🤖 gptService.ts                       #  GPT 서비스
```

---

## 💡 주요 기능 설명

### ✨ 기능 1: 감정 분석

- **입력 형태:** 자유 텍스트, 일기 포스트, 간단 문장
- **핵심 로직:** OpenAI API로 감정 레이블 분류 및 강도 스코어 산출
- **출력 형식:** { emotion: "joy|sadness|anger|fear|neutral|...", score: 0–1, summary }
- **UX 포인트:** 로딩 스켈레톤과 결과 애니메이션(Framer Motion)로 피드백 강화

### 🎵 기능 2: 음악 추천

- **데이터 소스:** iTunes Search API 기반 트랙/아티스트 검색
- **매핑 전략:** 감정 레이블 → 장르/무드/템포 키워드 프롬프트 매핑
- **재생 방식:** 30초 미리듣기, 외부 링크로 전체 곡 이동
- **개인화:** 최근 선호 감정/스킵 기록 반영한 추천 가중치

### 📝 기능 3: 감정 일기

- **기록 요소:** 원문, 감정 레이블/스코어, 추천 목록 스냅샷, 태그
- **CRUD:** 작성, 수정, 삭제, 월별/주별 필터 조회
- **프라이버시:** 사용자별 격리 저장, 공개 전환 옵션 없음(기본 비공개)

### 📊 기능 4: 대시보드

- **시각화:** 감정 분포 도넛, 시간대별 추이 라인차트, 주간 하이라이트
- **인사이트:** 반복 감정 패턴, 음악 청취 상관성 카드 요약
- **상호작용:** 범례 토글, 기간 프리셋(7/30/90일), 내보내기(PNG)

### 👤 기능 5: 사용자 관리

- **인증:** 이메일/비밀번호 회원가입, 로그인, JWT 발급/검증
- **세션:** 액세스 토큰 + 리프레시 토큰, 안전한 저장 전략 적용
- **보안:** 비밀번호 해시, 기본 속도 제한 및 입력 검증

---

## 🖼️ 데모 화면

| 주요 화면 | 캡처 예시                            |
| --------- | ------------------------------------ |
| 홈 화면   | ![home]<img width="2824" height="2190" alt="메인페이지" src="https://github.com/user-attachments/assets/a22738c0-1138-4cc0-9f13-db151c3ff2d8" />           |
| 감정 분석 | ![analyze]<img width="2824" height="4480" alt="ai 분석 결과 페이지" src="https://github.com/user-attachments/assets/7b0a6692-2263-4cb8-8e37-209bd66532e5" />     |
| 대시보드  | ![dashboard]<img width="2824" height="5160" alt="대시보드 페이지" src="https://github.com/user-attachments/assets/5363fbbc-01aa-4776-9c1f-22287268bfa4" /> |
| 음악 추천 | ![music]<img width="1902" height="1176" alt="음악 추천 결과 페이지" src="https://github.com/user-attachments/assets/bf3e874c-a9ca-492b-a1f2-011e53dae89e" /> |

---

## 🧠 회고 요약

- **어려웠던 점:** OpenAI 응답 형식 표준화와 iTunes 검색 품질 편차로 추천 일관성 유지가 쉽지 않았음
- **배운 점:** 감정 라벨 스키마를 좁히고 매핑 테이블을 명시화하면 추천 정확도가 체계적으로 개선됨
- **개선 포인트:** 콜드스타트 대응을 위한 온보딩 설문, 오프라인 캐시, 접근성 대비 명암 최적화

---

## 📦 배포 주소 선택

- 배포 : https://emotional-music.vercel.app

---

## 🙋‍♀️ 개발자

| 이름 | GitHub                                                   |
| ---- | -------------------------------------------------------- |
| 혜민 | [hyehye12](https://github.com/hyehye12.git) |

---

## 🔎 부가 메모

- **환경 변수:** OPENAI_API_KEY, JWT_SECRET, MONGODB_URI, CLIENT_URL
- **요청 제한:** 감정 분석 엔드포인트는 사용자별 분당 호출 제한으로 오남용 방지
- **테스트:** 주요 유스케이스에 대해 요청/응답 스냅샷 테스트와 스키마 검증 진행

## API 엔드포인트

### 인증

- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보

### 일기

- `POST /api/diary` - 일기 작성
- `GET /api/diary` - 일기 목록 조회
- `GET /api/diary/:id` - 특정 일기 조회
- `PUT /api/diary/:id` - 일기 수정
- `DELETE /api/diary/:id` - 일기 삭제

### 음악

- `POST /api/music` - 음악 선택 저장
- `GET /api/music` - 음악 목록 조회
- `GET /api/music/:id` - 특정 음악 조회
- `DELETE /api/music/:id` - 음악 삭제
- `GET /api/music/stats/emotions` - 감정별 음악 통계

### 대시보드

- `GET /api/dashboard` - 대시보드 메인 데이터
- `GET /api/dashboard/emotion-history` - 감정 분석 히스토리
- `GET /api/dashboard/emotion-details/:emotion` - 감정별 상세 통계

### GPT 분석

- `POST /api/gpt/emotion-advice` - 감정 조언
- `POST /api/gpt/analyze-diary` - 일기 분석
