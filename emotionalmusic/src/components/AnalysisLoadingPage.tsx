import React from 'react';

export default function AnalysisLoadingPage() {
  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 font-sans sm:p-8 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-lg p-8 text-center sm:p-12 bg-white rounded-2xl shadow-xl">
        <div className="mb-8">
          <div className="flex items-center justify-center w-20 h-20 mx-auto text-3xl text-white bg-purple-500 rounded-full animate-pulse">
            🤖
          </div>
        </div>

        <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">
          AI 감정 분석 중
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-gray-600 sm:mb-8 sm:text-base">
          AI가 당신의 이야기를 깊이 있게 분석하고<br />
          맞춤형 조언을 준비하고 있어요...
        </p>

        {/* Loading Animation */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex space-x-3">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg">
          <div className="text-sm font-medium text-purple-800">
            분석 진행 중... 잠시만 기다려주세요
          </div>
        </div>
      </div>
    </div>
  );
}