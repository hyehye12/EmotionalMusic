import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  emotion: string;
}

export default function MusicBoardPage() {
  const navigate = useNavigate();
  const [currentTrack, setCurrentTrack] = useState<MusicTrack>({
    id: "1",
    title: "Sad Emotional Music",
    artist: "HitsLab",
    albumArt: "/api/placeholder/200/200",
    emotion: "우울함"
  });

  const [recommendedTracks] = useState<MusicTrack[]>([
    {
      id: "1",
      title: "Sad Emotional Music",
      artist: "HitsLab",
      albumArt: "/api/placeholder/200/200",
      emotion: "우울함"
    },
    {
      id: "2",
      title: "Sad Emotional Music",
      artist: "Hot Potato",
      albumArt: "/api/placeholder/200/200",
      emotion: "우울함"
    },
    {
      id: "3",
      title: "Sad Emotional Music",
      artist: "HumanVocals By CLX",
      albumArt: "/api/placeholder/200/200",
      emotion: "우울함"
    },
    {
      id: "4",
      title: "Sorairo no Mirai (feat. Ryosuke Miyata)",
      artist: "ALL BGM CHANNEL",
      albumArt: "/api/placeholder/200/200",
      emotion: "우울함"
    }
  ]);

  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTrackSelect = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handleSaveTrack = () => {
    // 트랙 저장 로직
    alert("트랙이 저장되었습니다!");
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Current Track */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              {/* Album Art */}
              <div className="text-center mb-6">
                <div className="w-48 h-48 mx-auto bg-gradient-to-br from-blue-200 to-blue-300 rounded-full flex items-center justify-center">
                  <div className="w-40 h-40 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full flex items-center justify-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Track Info */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentTrack.title}
                </h2>
                <p className="text-lg text-gray-600">{currentTrack.artist}</p>
              </div>

              {/* Player Controls */}
              <div className="flex items-center justify-center space-x-4 mb-6">
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z"/>
                  </svg>
                </button>
                <button 
                  onClick={handlePlayPause}
                  className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  {isPlaying ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                    </svg>
                  )}
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z"/>
                  </svg>
                </button>
              </div>

              {/* Save Track */}
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600 mb-3">이 트랙을 저장하시겠어요?</p>
                <button 
                  onClick={handleSaveTrack}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                  저장
                </button>
              </div>

              {/* Emotion Analysis */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-2">감정 분석</h3>
                <div className="bg-blue-100 rounded-lg p-3 mb-3">
                  <span className="text-blue-800 font-medium">"{currentTrack.emotion}"</span>
                </div>
                <p className="text-sm text-gray-700">
                  마음이 무겁고 슬픈 하루였군요. 따뜻한 위로가 담긴 음악으로 마음을 달래보세요.
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel - Recommended Tracks */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">추천 트랙</h2>
              
              <div className="space-y-4">
                {recommendedTracks.map((track, index) => (
                  <div key={track.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                        <span className="text-gray-600 text-xs">🎵</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{track.title}</h3>
                        <p className="text-sm text-gray-600">{track.artist}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleTrackSelect(track)}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <button className="text-blue-600 hover:text-blue-700 text-sm">
                  +5개 더 많은 트랙
                </button>
              </div>

              <div className="mt-6 flex space-x-4">
                <button className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  다른 추천가져오기
                </button>
                <button 
                  onClick={() => navigate("/")}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  새로운 AI 분석
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="노래를 검색하세요..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
