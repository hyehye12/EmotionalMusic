import React from 'react';

interface MusicLoadingPageProps {
  emotion?: string;
}

export default function MusicLoadingPage({ emotion }: MusicLoadingPageProps) {
  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 font-sans sm:p-8 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-lg p-8 text-center sm:p-12 bg-white rounded-2xl shadow-xl">
        <div className="mb-8">
          <div className="flex items-center justify-center w-20 h-20 mx-auto text-3xl text-white bg-blue-500 rounded-full animate-bounce">
            🎵
          </div>
        </div>

        <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">
          음악 추천 중
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-gray-600 sm:mb-8 sm:text-base">
          당신의 감정에 맞는 완벽한 음악을 찾고 있어요...
        </p>

        {/* Loading Animation */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex space-x-3">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>

        {emotion && (
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="text-sm font-medium text-blue-800">
              감지된 감정: "{emotion}"
            </div>
          </div>
        )}
      </div>
    </div>
  );
}