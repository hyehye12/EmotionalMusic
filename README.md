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
📁 emotionalmusic/
├── public/                   # 정적 파일 (React 앱)
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/                      # React + TypeScript 프론트엔드
│   ├── App.tsx              # 메인 라우팅 설정
│   ├── components/          # UI 컴포넌트
│   │   ├── Healing.tsx      # 감정 분석 컴포넌트
│   │   ├── LoadingSpinner.tsx # 로딩 UI
│   │   └── TrackCard.tsx    # 음악 트랙 카드
│   ├── pages/               # 페이지 컴포넌트
│   │   ├── MainPage.tsx     # 메인 홈 페이지
│   │   ├── ResultPage.tsx   # 음악 추천 결과 페이지
│   │   ├── GPTAnalysisPage.tsx # GPT 감정 분석 페이지
│   │   ├── AuthPage.tsx     # 로그인/회원가입
│   │   ├── DashboardPage.tsx # 대시보드
│   │   └── MusicBoardPage.tsx # 음악 커뮤니티
│   ├── hooks/               # 커스텀 React Hooks
│   │   ├── useAuth.ts       # 인증 상태 관리
│   │   ├── useDiaryStore.ts # 일기 상태 관리 (Zustand)
│   │   ├── useGPTAnalysis.ts # GPT 분석 Hook
│   │   └── useMusicSearch.ts # 음악 검색 Hook
│   ├── services/            # API 서비스 레이어
│   │   ├── authService.ts   # 인증 관련 API 호출
│   │   └── itunes.ts        # iTunes 음악 검색 API
│   ├── utils/               # 유틸리티 함수
│   │   ├── emotionAnalyzer.ts # 로컬 감정 분석 로직
│   │   └── gptService.ts    # GPT API 통신
│   ├── data/                # 정적 데이터 및 상수
│   │   ├── emotionConstants.ts # 감정 관련 상수
│   │   └── emotionData.ts   # 감정별 음악 데이터
│   ├── styles/              # 스타일링
│   │   └── index.css        # Tailwind CSS 설정
│   └── index.tsx            # React 앱 진입점
├── server.js                # Node.js + Express 백엔드 서버
├── package.json             # 의존성 및 스크립트 설정
├── tailwind.config.js       # Tailwind CSS 설정
├── tsconfig.json           # TypeScript 설정
└── README.md
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
| 홈 화면   | ![home](./assets/home.png)           |
| 감정 분석 | ![analyze](./assets/analyze.gif)     |
| 대시보드  | ![dashboard](./assets/dashboard.png) |

---

## 🧠 회고 요약

- **어려웠던 점:** OpenAI 응답 형식 표준화와 iTunes 검색 품질 편차로 추천 일관성 유지가 쉽지 않았음
- **배운 점:** 감정 라벨 스키마를 좁히고 매핑 테이블을 명시화하면 추천 정확도가 체계적으로 개선됨
- **개선 포인트:** 콜드스타트 대응을 위한 온보딩 설문, 오프라인 캐시, 접근성 대비 명암 최적화

---

## 📦 배포 주소 선택

- **프론트엔드:** https://your-frontend.vercel.app
- **백엔드 API:** https://your-api.render.com

---

## 🙋‍♀️ 개발자

| 이름 | GitHub                                                   |
| ---- | -------------------------------------------------------- |
| 혜민 | [github.com/your-github](https://github.com/your-github) |

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
