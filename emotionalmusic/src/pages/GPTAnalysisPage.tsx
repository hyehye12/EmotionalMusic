import React from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDiaryAnalysis } from "../hooks/useGPTAnalysis";
import { safeJsonParse } from "../utils/apiUtils";

export default function GPTAnalysisPage() {
  const { diaryText } = useParams<{ diaryText: string }>();
  const navigate = useNavigate();
  const decodedDiaryText = diaryText ? decodeURIComponent(diaryText) : "";
  const { analysis, loading, error, retry } =
    useDiaryAnalysis(decodedDiaryText);

  const handleBack = () => {
    navigate("/");
  };

  const handleRetry = () => {
    retry();
  };

  const handleMusicRecommendation = async () => {
    if (analysis?.emotion) {
      // 오늘 기존 엔트리 확인
      try {
        const response = await fetch('/api/daily-entries/today/entry', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await safeJsonParse(response);
          if (data.entry) {
            const confirmMessage = `오늘 이미 일기와 음악을 선택하셨습니다.

기존 감정: ${data.entry.detected_emotion}
새로운 감정: ${analysis.emotion}

새로운 일기로 업데이트하시겠습니까?`;
            
            if (!window.confirm(confirmMessage)) {
              return;
            }
          }
        }
      } catch (error) {
        console.log('오늘의 엔트리 확인 중 오류:', error);
      }
      
      // AI 분석 결과를 세션 스토리지에 저장 (음악 페이지에서 사용)
      const analysisData = {
        diaryContent: decodedDiaryText,
        emotion: analysis.emotion,
        analysis: analysis.analysis,
        advice: analysis.advice,
        encouragement: analysis.encouragement,
        fromGPTAnalysis: true // GPT 분석에서 온 것임을 표시
      };
      sessionStorage.setItem('recentAnalysis', JSON.stringify(analysisData));
      
      navigate(`/result/${encodeURIComponent(analysis.emotion)}`);
    }
  };

  if (!diaryText) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="relative flex items-center justify-center min-h-screen p-4 sm:p-8 font-sans">
        {/* Clean Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100"></div>

        <div className="w-full max-w-lg p-8 sm:p-12 text-center modern-card">
          <motion.div
            className="mb-8"
            animate={{
              y: [-5, 5, -5],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="flex items-center justify-center w-20 h-20 mx-auto text-3xl text-white rounded-full bg-blue-500">
              🤖
            </div>
          </motion.div>

          <h2 className="mb-4 text-2xl sm:text-3xl font-bold text-gray-900">
            AI 분석 진행 중
          </h2>
          <p className="mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed text-gray-600">
            AI가 당신의 이야기를 분석 중입니다...
          </p>

          {/* Spinning Animation */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex space-x-3">
              <motion.div
                className="w-3 h-3 bg-blue-400 rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="w-3 h-3 bg-blue-500 rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2,
                }}
              />
              <motion.div
                className="w-3 h-3 bg-blue-400 rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.4,
                }}
              />
            </div>
          </div>

          {/* Info */}
          <div className="p-4 border border-gray-200 bg-gray-100 rounded-lg">
            <div className="text-sm font-medium text-gray-600">분석 중...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex items-center justify-center min-h-screen p-4 sm:p-8 font-sans">
        {/* Clean Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100"></div>

        <div className="w-full max-w-lg p-8 sm:p-12 text-center modern-card">
          <div className="mb-6 sm:mb-8 text-4xl sm:text-6xl">❌</div>
          <h2 className="mb-4 text-xl sm:text-2xl font-bold text-gray-900">오류 발생</h2>
          <p className="mb-6 sm:mb-8 text-sm sm:text-base text-gray-600">{error}</p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button
              onClick={handleRetry}
              className="px-8 py-3 font-medium soft-button rounded-lg"
            >
              🔄 다시 시도
            </button>
            <button
              onClick={handleBack}
              className="px-8 py-3 font-medium text-gray-700 transition-all bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative min-h-screen font-sans bg-gray-50">
      {/* Header */}
      <div className="relative px-4 sm:px-8 py-8 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 sm:mb-12">
            <button
              onClick={handleBack}
              className="self-start mb-4 lg:mb-0 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium text-gray-700 transition-all bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ← 돌아가기
            </button>

            <div className="text-center flex-1 lg:flex-none">
              <h1 className="mb-3 sm:mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                AI 감정 분석
              </h1>
              <div className="flex items-center justify-center space-x-2 sm:space-x-4 text-sm sm:text-base text-gray-600">
                <span className="font-medium">원본 이야기</span>
                <div className="w-6 sm:w-8 h-0.5 bg-blue-400"></div>
                <span className="font-medium text-blue-600">AI 분석</span>
              </div>
            </div>

            <div className="hidden lg:block w-24"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl px-4 sm:px-8 pb-8 sm:pb-16 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="p-12 mb-12 modern-card"
        >
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">분석 결과</h2>
            <div className="flex items-center justify-center space-x-6 text-gray-600">
              <span>원본 이야기</span>
              <span>•</span>
              <span className="text-blue-600">AI 분석</span>
            </div>
          </div>

          {/* Original Diary */}
          <div className="p-8 mb-12 border border-blue-100 bg-blue-50/30 rounded-lg">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-10 h-10 mr-4 font-bold text-white bg-blue-500 rounded-full">
                A
              </div>
              <h3 className="text-xl font-bold text-gray-900">원본 이야기</h3>
            </div>

            <div className="p-6 border border-blue-100 bg-white rounded-lg">
              <p className="text-lg leading-relaxed text-gray-800">
                {decodeURIComponent(diaryText)}
              </p>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="space-y-8">
            <h3 className="flex items-center justify-center mb-8 text-xl font-bold text-center text-gray-900">
              <div className="flex items-center justify-center w-10 h-10 mr-4 font-bold text-white bg-purple-500 rounded-full">
                B
              </div>
              AI 분석 결과
            </h3>

            {/* Detected Emotion */}
            <div className="p-8 border border-blue-100 bg-blue-50/50 rounded-lg">
              <div className="flex items-center mb-4">
                <span className="mr-4 text-3xl">💭</span>
                <h4 className="text-lg font-bold text-gray-900">감지된 감정</h4>
              </div>
              <div className="p-6 border border-blue-100 bg-white rounded-lg">
                <div className="text-center">
                  <div className="inline-block px-6 py-3 text-xl font-bold text-white bg-blue-500 rounded-lg">
                    {analysis.emotion}
                  </div>
                </div>
              </div>
            </div>

            {/* Emotional Analysis */}
            <div className="p-8 border border-purple-100 bg-purple-50/50 rounded-lg">
              <div className="flex items-center mb-4">
                <span className="mr-4 text-3xl">💭</span>
                <h4 className="text-lg font-bold text-gray-900">감정 분석</h4>
              </div>
              <div className="p-6 border border-purple-100 bg-white rounded-lg">
                <p className="text-lg leading-relaxed text-gray-800">
                  {analysis.analysis}
                </p>
              </div>
            </div>

            {/* Advice */}
            <div className="p-8 border border-yellow-100 bg-yellow-50/50 rounded-lg">
              <div className="flex items-center mb-4">
                <span className="mr-4 text-3xl">💡</span>
                <h4 className="text-lg font-bold text-gray-900">개인 조언</h4>
              </div>
              <div className="p-6 border border-yellow-100 bg-white rounded-lg">
                <p className="text-lg leading-relaxed text-gray-800">
                  {analysis.advice}
                </p>
              </div>
            </div>

            {/* Encouragement */}
            <div className="p-8 border border-red-100 bg-red-50/50 rounded-lg">
              <div className="flex items-center mb-4">
                <span className="mr-4 text-3xl">💝</span>
                <h4 className="text-lg font-bold text-gray-900">따뜻한 격려</h4>
              </div>
              <div className="p-6 border border-red-100 bg-white rounded-lg">
                <p className="text-lg leading-relaxed text-gray-800">
                  {analysis.encouragement}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-8 mt-12 text-center border-t border-gray-200">
            <div className="inline-block p-6 modern-card">
              <div className="text-sm text-gray-500">
                <div className="mb-2">제공: GPT 3.5 turbo</div>
                <div className="text-xs">© 2025 감정 음악 프로젝트</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="space-y-4 text-center">
          {/* Primary Action - Music Recommendation */}
          <div className="mb-6">
            <button
              onClick={handleMusicRecommendation}
              className="px-12 py-5 text-xl font-bold text-white transition-all transform bg-blue-600 rounded-lg hover:bg-blue-700 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              🎵 음악 추천 받기
            </button>
            <p className="mt-3 text-sm text-gray-600">
              분석된 감정 '<span className="font-semibold text-blue-600">{analysis?.emotion}</span>'에 어울리는 음악을 추천해드릴게요!
              <span className="block mt-1 text-xs text-blue-600">
                * 같은 날 새 일기를 작성한 경우 기존 엔트리가 업데이트됩니다.
              </span>
            </p>
          </div>
          
          {/* Secondary Actions */}
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button
              onClick={handleRetry}
              className="px-8 py-4 text-lg font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔄 재분석
            </button>
            <button
              onClick={handleBack}
              className="px-8 py-4 font-medium text-gray-700 transition-all bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              📝 새로운 이야기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
