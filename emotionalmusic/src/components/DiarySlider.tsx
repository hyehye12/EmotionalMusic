import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DailyEntry {
  id: string;
  date: string;
  diary_content: string;
  detected_emotion: string;
  selected_track_name: string;
  selected_artist_name: string;
  selected_album_name: string;
  selected_artwork_url: string;
  selected_preview_url: string;
  selected_track_view_url: string;
  ai_analysis: string;
  ai_advice: string;
  ai_encouragement: string;
  created_at: string;
}

interface DiarySliderProps {
  entries: DailyEntry[];
  formatDate: (dateString: string) => string;
  playPreview: (entry: DailyEntry) => void;
  openInItunes: (entry: DailyEntry) => void;
  playingEntryId: string | null;
}

export const DiarySlider: React.FC<DiarySliderProps> = ({
  entries,
  formatDate,
  playPreview,
  openInItunes,
  playingEntryId
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextEntry = () => {
    setCurrentIndex((prev) => (prev + 1) % entries.length);
  };

  const prevEntry = () => {
    setCurrentIndex((prev) => (prev - 1 + entries.length) % entries.length);
  };

  const goToEntry = (index: number) => {
    setCurrentIndex(index);
  };

  if (entries.length === 0) return null;

  const currentEntry = entries[currentIndex];

  return (
    <div className="diary-book-container">
      {/* 일기장 헤더 */}
      <div className="relative mb-8">
        <div className="p-6 text-center diary-book-header">
          <h2 className="mb-4 text-3xl font-bold text-gray-800">📖 나의 감정 일기</h2>
          <div className="flex items-center justify-center space-x-4">
            <span className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
              {currentIndex + 1} / {entries.length}
            </span>
            <span className="text-gray-600">
              총 {entries.length}개의 기록
            </span>
          </div>
        </div>
      </div>

      {/* 일기장 본문 */}
      <div className="relative diary-book-wrapper">
        {/* 좌측 네비게이션 버튼 */}
        <button
          onClick={prevEntry}
          disabled={entries.length <= 1}
          className="absolute left-0 z-10 p-3 text-white transform -translate-y-1/2 bg-blue-500 rounded-full shadow-lg top-1/2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ left: '-60px' }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* 우측 네비게이션 버튼 */}
        <button
          onClick={nextEntry}
          disabled={entries.length <= 1}
          className="absolute right-0 z-10 p-3 text-white transform -translate-y-1/2 bg-blue-500 rounded-full shadow-lg top-1/2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ right: '-60px' }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* 일기 페이지 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentEntry.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="diary-page modern-card"
          >
            {/* 날짜 헤더 - 일기장 스타일 */}
            <div className="relative z-10 p-8 pt-12" style={{ marginLeft: '80px' }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 handwriting-style">
                    {formatDate(currentEntry.date)}
                  </h3>
                  <div className="flex items-center mt-3 space-x-3">
                    <span className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                      감정: {currentEntry.detected_emotion}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="mb-2 text-3xl">🎵</div>
                  <div className="text-sm text-gray-600 font-medium">오늘의 곡</div>
                </div>
              </div>
            </div>

            <div className="relative z-10 px-8 pb-8" style={{ marginLeft: '80px' }}>
              <div className="grid gap-8 md:grid-cols-2">
                {/* 일기 내용 */}
                <div className="space-y-6">
                  <div>
                    <h4 className="flex items-center mb-4 text-lg font-semibold text-gray-800">
                      <span className="mr-3">📝</span> 오늘의 이야기
                    </h4>
                    <div className="diary-content-area">
                      <p className="leading-loose text-gray-800 text-base handwriting-content">
                        {currentEntry.diary_content}
                      </p>
                    </div>
                  </div>

                  {/* AI 분석 */}
                  <div className="space-y-5">
                    <div className="diary-analysis-box">
                      <h5 className="flex items-center mb-3 font-semibold text-blue-800">
                        <span className="mr-2">🤖</span> AI가 본 내 마음
                      </h5>
                      <p className="text-sm leading-relaxed text-blue-700 handwriting-content">
                        {currentEntry.ai_analysis}
                      </p>
                    </div>

                    <div className="diary-advice-box">
                      <h5 className="flex items-center mb-3 font-semibold text-green-800">
                        <span className="mr-2">💡</span> 작은 조언
                      </h5>
                      <p className="text-sm leading-relaxed text-green-700 handwriting-content">
                        {currentEntry.ai_advice}
                      </p>
                    </div>

                    <div className="diary-encouragement-box">
                      <h5 className="flex items-center mb-3 font-semibold text-orange-800">
                        <span className="mr-2">💕</span> 따뜻한 응원
                      </h5>
                      <p className="text-sm leading-relaxed text-orange-700 handwriting-content">
                        {currentEntry.ai_encouragement}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 선택한 음악 */}
                <div>
                  <h4 className="flex items-center mb-4 text-lg font-semibold text-gray-800">
                    <span className="mr-3">🎶</span> 마음을 담은 음악
                  </h4>
                  <div className="diary-music-box">
                    <div className="flex items-start space-x-4">
                      <div className="music-album-cover">
                        <img
                          src={currentEntry.selected_artwork_url || "/default-album.jpg"}
                          alt={currentEntry.selected_track_name}
                          className="object-cover w-full h-full rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/default-album.jpg";
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h5 className="mb-2 text-lg font-bold text-gray-800 handwriting-style">
                          {currentEntry.selected_track_name}
                        </h5>
                        <p className="mb-2 text-gray-700 font-medium">
                          {currentEntry.selected_artist_name}
                        </p>
                        <p className="mb-4 text-sm text-gray-600 italic">
                          {currentEntry.selected_album_name}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {currentEntry.selected_preview_url && (
                            <button
                              onClick={() => playPreview(currentEntry)}
                              className="diary-music-button diary-music-button-primary"
                            >
                              {playingEntryId === currentEntry.id ? "⏸️ 정지" : "▶️ 미리듣기"}
                            </button>
                          )}
                          <button
                            onClick={() => openInItunes(currentEntry)}
                            className="diary-music-button diary-music-button-secondary"
                          >
                            🎵 iTunes에서 듣기
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 페이지 인디케이터 */}
      <div className="flex justify-center mt-6 space-x-2">
        {entries.map((_, index) => (
          <button
            key={index}
            onClick={() => goToEntry(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex 
                ? 'bg-blue-500' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};