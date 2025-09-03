import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeEmotion } from "../utils/emotionAnalyzer";
import { useDiaryStore } from "../hooks/useDiaryStore";
import { useAuth } from "../hooks/useAuth";
import { DiaryService, MoodService } from "../services/authService";
import { EMOTION_SCORES } from "../data/emotionConstants";

export default function MainPage() {
  const [diaryText, setDiaryText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();
  const { setDiaryText: setStoreDiaryText } = useDiaryStore();
  const { user, isLoggedIn, logout } = useAuth();

  const handleSubmit = async () => {
    if (!diaryText.trim()) return;

    setIsAnalyzing(true);

    setStoreDiaryText(diaryText);
    const emotion = analyzeEmotion(diaryText);

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
    }, 1500);
  };

  const handleGPTAnalysis = () => {
    if (!diaryText.trim()) return;

    setStoreDiaryText(diaryText);
    navigate(`/analysis/${encodeURIComponent(diaryText)}`);
  };

  return (
    <div className="relative min-h-screen font-sans bg-gray-50">
      {/* Header Section */}
      <div className="relative px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-16">
            <div className="flex-1">
              <h1 className="mb-6 text-6xl font-bold text-gray-900">
                당신의
                <span className="block text-blue-600">감정 여행</span>
              </h1>
              <p className="max-w-2xl text-xl text-gray-600">
                일상을 이야기하고 AI가 당신의 감정에 맞는 개인화된 음악 경험을 만들어드립니다.
              </p>
              <div className="flex items-center mt-4 space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col space-y-3">
              {isLoggedIn ? (
                <>
                  <span className="text-gray-700 text-sm">안녕하세요, {user?.name}님!</span>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="px-6 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    📊 대시보드
                  </button>
                  <button
                    onClick={logout}
                    className="px-6 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate("/auth")}
                  className="px-6 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  🔐 로그인
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl px-8 pb-16 mx-auto">
        {/* Main Input Card */}
        <div className="mb-12 modern-card">
          <div className="p-8">
            <div className="mb-8 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                당신의 이야기를 들려주세요
              </h2>
              <p className="text-lg text-gray-600">
                오늘 하루에 대해 들려주세요 - 기쁨, 도전, 기억에 남는 순간들을요.<br />
                당신의 감정을 분석하고 완벽한 음악을 추천해드릴게요.
              </p>
            </div>

            <textarea
              placeholder="오늘 하루는 어떠셨나요? 기쁜 순간, 도전, 그리고 생각들을 나눠주세요... (3-4줄 권장)"
              value={diaryText}
              onChange={(e) => setDiaryText(e.target.value)}
              className="w-full h-32 px-4 py-4 text-base text-gray-900 placeholder-gray-500 bg-white border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={500}
            />

            <div className="flex items-center justify-between mt-4 mb-6">
              <span className="text-sm text-gray-500">{diaryText.length}/500 글자</span>
              {diaryText.length > 0 && (
                <span className="text-sm text-blue-600">✨ AI 준비 완료</span>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={handleSubmit}
                disabled={!diaryText.trim() || isAnalyzing}
                className="w-full py-3 text-base font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isAnalyzing ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                    감정 분석 중...
                  </div>
                ) : (
                  <>🎵 음악 추천 받기</>
                )}
              </button>

              <button
                onClick={handleGPTAnalysis}
                disabled={!diaryText.trim()}
                className="w-full py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                🤖 AI 감정 분석 & 조언
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="p-6 text-sm text-gray-500 bg-white rounded-lg">
            <div className="font-semibold text-gray-700">POWERED BY: EMOTIONAL MUSIC</div>
            <div className="mt-1">DEVELOPED BY: hyemin</div>
            <div className="mt-2 text-xs">© 2025 EMOTIONAL MUSIC PROJECT. ALL RIGHTS RESERVED.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
