import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeEmotion } from "../utils/emotionAnalyzer";
import { useDiaryStore } from "../hooks/useDiaryStore";
import { useAuth } from "../contexts/AuthContext";
import { DiaryService, MoodService } from "../services/authService";
import { EMOTION_SCORES } from "../data/emotionConstants";
import MusicLoadingPage from "../components/MusicLoadingPage";
import AnalysisLoadingPage from "../components/AnalysisLoadingPage";

export default function MainPage() {
  const [diaryText, setDiaryText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGPTAnalyzing, setIsGPTAnalyzing] = useState(false);
  const [analyzedEmotion, setAnalyzedEmotion] = useState<string>("");
  const navigate = useNavigate();
  const { setDiaryText: setStoreDiaryText } = useDiaryStore();
  const { user, isLoggedIn, signOut } = useAuth();

  const handleSubmit = async () => {
    if (!diaryText.trim()) return;

    setIsAnalyzing(true);
    setStoreDiaryText(diaryText);
    const emotion = analyzeEmotion(diaryText);
    setAnalyzedEmotion(emotion);

    if (isLoggedIn && user) {
      try {
        await DiaryService.saveDiaryEntry({
          userId: user.id,
          content: diaryText,
          emotion: emotion,
        });

        const emotionScore =
          EMOTION_SCORES[emotion as keyof typeof EMOTION_SCORES] || 5;

        await MoodService.saveMoodData({
          emotion: emotion,
          score: emotionScore,
        });
      } catch (error) {
        console.error("데이터 저장 오류:", error);
      }
    }

    setTimeout(() => {
      setIsAnalyzing(false);
      navigate(`/result/${encodeURIComponent(emotion)}`);
    }, 2000);
  };

  const handleGPTAnalysis = () => {
    if (!diaryText.trim()) return;

    setIsGPTAnalyzing(true);
    setStoreDiaryText(diaryText);
    
    setTimeout(() => {
      setIsGPTAnalyzing(false);
      navigate(`/analysis/${encodeURIComponent(diaryText)}`);
    }, 1500);
  };

  // Show loading pages
  if (isAnalyzing) {
    return <MusicLoadingPage emotion={analyzedEmotion} />;
  }

  if (isGPTAnalyzing) {
    return <AnalysisLoadingPage />;
  }

  return (
    <div className="relative min-h-screen font-sans bg-gray-50">
      {/* Header Section */}
      <div className="relative px-4 sm:px-8 py-8 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 sm:mb-16">
            <div className="flex-1 mb-6 lg:mb-0">
              <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                당신의
                <span className="block text-blue-600">감정 여행</span>
              </h1>
              <p className="max-w-2xl text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
                일상을 이야기하고 AI가 당신의 감정에 맞는 개인화된 음악 경험을 만들어드립니다.
              </p>
              <div className="flex items-center mt-3 sm:mt-4 space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-row lg:flex-col gap-3 lg:space-y-3">
              {isLoggedIn ? (
                <>
                  <span className="text-gray-700 text-xs sm:text-sm px-2 py-1 lg:py-0">안녕하세요, {user?.user_metadata?.name || user?.email?.split('@')[0]}님!</span>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="flex-1 lg:flex-none px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                  >
                    📊 대시보드
                  </button>
                  <button
                    onClick={() => signOut()}
                    className="flex-1 lg:flex-none px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate("/auth")}
                  className="px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  🔐 로그인
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl px-4 sm:px-8 pb-8 sm:pb-16 mx-auto">
        {/* Main Input Card */}
        <div className="mb-8 sm:mb-12 modern-card">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6 sm:mb-8 text-center">
              <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                당신의 이야기를 들려주세요
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                오늘 하루에 대해 들려주세요 - 기쁨, 도전, 기억에 남는 순간들을요.<br className="hidden sm:block" />
                <span className="block sm:inline"> 당신의 감정을 분석하고 완벽한 음악을 추천해드릴게요.</span>
              </p>
            </div>

            <textarea
              placeholder="오늘 하루는 어떠셨나요? 기쁜 순간, 도전, 그리고 생각들을 나눠주세요... (3-4줄 권장)"
              value={diaryText}
              onChange={(e) => setDiaryText(e.target.value)}
              className="w-full h-32 sm:h-36 px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base text-gray-900 placeholder-gray-500 bg-white border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={500}
            />

            <div className="flex items-center justify-between mt-3 sm:mt-4 mb-4 sm:mb-6">
              <span className="text-xs sm:text-sm text-gray-500">{diaryText.length}/500 글자</span>
              {diaryText.length > 0 && (
                <span className="text-xs sm:text-sm text-blue-600">✨ AI 준비 완료</span>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={handleSubmit}
                disabled={!diaryText.trim() || isAnalyzing || isGPTAnalyzing}
                className="w-full py-3 sm:py-4 text-sm sm:text-base font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                🎵 음악 추천 받기
              </button>

              <button
                onClick={handleGPTAnalysis}
                disabled={!diaryText.trim() || isAnalyzing || isGPTAnalyzing}
                className="w-full py-3 sm:py-4 text-sm sm:text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                🤖 AI 감정 분석 & 조언
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="p-4 sm:p-6 text-xs sm:text-sm text-gray-500 bg-white rounded-lg">
            <div className="font-semibold text-gray-700 text-sm sm:text-base">POWERED BY: EMOTIONAL MUSIC</div>
            <div className="mt-1">DEVELOPED BY: hyemin</div>
            <div className="mt-2 text-xs">© 2025 EMOTIONAL MUSIC PROJECT. ALL RIGHTS RESERVED.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
