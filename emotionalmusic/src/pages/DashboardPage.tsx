import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { handleApiResponse, safeJsonParse } from "../utils/apiUtils";
import { DiarySlider } from "../components/DiarySlider";

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

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const [playingEntryId, setPlayingEntryId] = useState<string | null>(null);

  useEffect(() => {
    fetchDailyEntries();
    return () => {
      if (currentAudio) {
        currentAudio.pause();
      }
    };
  }, []);

  const fetchDailyEntries = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/daily-entries", {
        credentials: "include",
      });

      if (response.status === 401) {
        const shouldLogin = window.confirm(
          "로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니까?"
        );
        if (shouldLogin) {
          navigate("/auth");
        }
        // 취소를 누르면 아무것도 하지 않음 (confirm 창이 자동으로 닫힘)
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const entries = await safeJsonParse(response);
      console.log("Fetched entries:", entries); // 디버깅용
      setDailyEntries(entries || []);
    } catch (err) {
      console.error("Daily entries fetch error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "네트워크 오류가 발생했습니다.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    };
    return date.toLocaleDateString("ko-KR", options);
  };

  const playPreview = (entry: DailyEntry) => {
    if (!entry.selected_preview_url) {
      alert("이 곡은 미리듣기를 지원하지 않습니다.");
      return;
    }

    if (currentAudio && playingEntryId === entry.id) {
      currentAudio.pause();
      setCurrentAudio(null);
      setPlayingEntryId(null);
    } else {
      if (currentAudio) {
        currentAudio.pause();
      }

      const newAudio = new Audio(entry.selected_preview_url);
      newAudio.addEventListener("ended", () => {
        setPlayingEntryId(null);
        setCurrentAudio(null);
      });

      newAudio.play().catch(() => {
        alert("오디오를 재생할 수 없습니다.");
      });

      setCurrentAudio(newAudio);
      setPlayingEntryId(entry.id);
    }
  };

  const openInItunes = (entry: DailyEntry) => {
    if (entry.selected_track_view_url) {
      window.open(entry.selected_track_view_url, "_blank");
    }
  };

  const getMostFrequentEmotion = () => {
    if (dailyEntries.length === 0) return "-";

    const emotionCounts = dailyEntries.reduce((acc, entry) => {
      acc[entry.detected_emotion] = (acc[entry.detected_emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(emotionCounts).reduce((a, b) =>
      emotionCounts[a] > emotionCounts[b] ? a : b
    );
  };

  // 월별 감정 통계 계산
  const monthlyEmotionStats = useMemo(() => {
    console.log("Computing emotion stats for entries:", dailyEntries); // 디버깅용

    if (dailyEntries.length === 0) return [];

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // 이번 달 엔트리만 필터링
    const thisMonthEntries = dailyEntries.filter((entry) => {
      const entryDate = new Date(entry.date || entry.created_at);
      return (
        entryDate.getMonth() === currentMonth &&
        entryDate.getFullYear() === currentYear
      );
    });

    console.log("This month entries:", thisMonthEntries); // 디버깅용

    const emotionCounts = thisMonthEntries.reduce((acc, entry) => {
      const emotion = entry.detected_emotion;
      if (emotion) {
        acc[emotion] = (acc[emotion] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    console.log("Emotion counts:", emotionCounts); // 디버깅용

    const statsArray = Object.entries(emotionCounts)
      .map(([emotion, count]) => ({ emotion, count }))
      .sort((a, b) => b.count - a.count);

    console.log("Final stats array:", statsArray); // 디버깅용
    return statsArray;
  }, [dailyEntries]);

  // 이번 달 가장 많은 감정과 메시지
  const getMonthlyEmotionMessage = () => {
    if (monthlyEmotionStats.length === 0) {
      return {
        message: "아직 이번 달 기록이 없어요",
        subMessage: "일기를 작성해서 감정을 기록해보세요!",
      };
    }

    const topEmotion = monthlyEmotionStats[0];
    const messages: Record<string, { message: string; subMessage: string }> = {
      행복함: {
        message: `이번 달은 '행복함'이 ${topEmotion.count}번으로 가장 많았네요! 🌟`,
        subMessage:
          "긍정적인 에너지가 가득한 한 달이었어요. 이 기분을 계속 유지해보세요!",
      },
      우울함: {
        message: `이번 달은 '우울함'이 ${topEmotion.count}번으로 가장 많았네요 💙`,
        subMessage:
          "힘든 시간을 보내셨군요. 천천히 마음을 돌보며 작은 기쁨을 찾아보세요.",
      },
      스트레스: {
        message: `이번 달은 '스트레스'가 ${topEmotion.count}번으로 가장 많았네요 😤`,
        subMessage:
          "많이 바쁘셨나봐요. 충분한 휴식과 자신만의 스트레스 해소법을 찾아보세요!",
      },
      설렘: {
        message: `이번 달은 '설렘'이 ${topEmotion.count}번으로 가장 많았네요! 💕`,
        subMessage:
          "새로운 변화나 기대되는 일들이 많았나봐요. 설레는 마음을 즐겨보세요!",
      },
      평온함: {
        message: `이번 달은 '평온함'이 ${topEmotion.count}번으로 가장 많았네요 🕊️`,
        subMessage:
          "마음의 안정을 잘 유지하고 계시네요. 이런 균형감을 소중히 여기세요.",
      },
      지침: {
        message: `이번 달은 '지침'이 ${topEmotion.count}번으로 가장 많았네요 😴`,
        subMessage:
          "많이 피곤하셨나봐요. 충분한 휴식을 취하고 에너지를 충전하는 시간을 가져보세요.",
      },
    };

    return (
      messages[topEmotion.emotion] || {
        message: `이번 달은 '${topEmotion.emotion}'이 ${topEmotion.count}번으로 가장 많았어요`,
        subMessage:
          "당신의 감정을 소중히 여기며 자신을 돌보는 시간을 가져보세요.",
      }
    );
  };

  return (
    <div className="relative min-h-screen font-sans bg-gray-50">

      {/* Header */}
      <div className="border-b border-gray-200 bg-white/80">
        <div className="max-w-6xl px-8 py-8 mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                📖 나의 감정 일기
              </h1>
              <div className="flex items-center mt-2 space-x-3">
                <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-300"></div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="font-medium text-gray-700">
                안녕하세요, 사용자님
              </span>
              <div className="flex items-center justify-center w-10 h-10 font-bold text-white rounded-full bg-blue-500">
                U
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl px-8 py-16 mx-auto">
        {/* Main Content */}
        {loading ? (
          <div className="p-12 mb-12 text-center modern-card">
            <div className="mb-4 text-4xl">🔄</div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              로딩 중...
            </h2>
            <p className="text-gray-600">일기 엔트리를 불러오고 있습니다.</p>
          </div>
        ) : error ? (
          <div className="p-12 mb-12 text-center modern-card">
            <div className="mb-4 text-4xl">❌</div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">오류 발생</h2>
            <p className="mb-6 text-gray-600">{error}</p>
            <button
              onClick={fetchDailyEntries}
              className="px-6 py-3 font-medium soft-button rounded-lg"
            >
              다시 시도
            </button>
          </div>
        ) : dailyEntries.length === 0 ? (
          <div className="p-12 mb-12 text-center modern-card">
            <div className="mb-4 text-6xl">📅</div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              아직 일기가 없어요
            </h2>
            <p className="mb-6 text-gray-600">
              첫 번째 일기를 작성하고 AI 분석을 받아보세요!
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3 font-medium soft-button rounded-lg"
            >
              ✏️ 일기 작성하기
            </button>
          </div>
        ) : (
          <DiarySlider
            entries={dailyEntries}
            formatDate={formatDate}
            playPreview={playPreview}
            openInItunes={openInItunes}
            playingEntryId={playingEntryId}
          />
        )}
        <br></br>
        <br></br>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-4">
          <div className="p-6 text-center modern-card">
            <div className="mb-3 text-3xl">📅</div>
            <h3 className="mb-2 text-2xl font-bold text-gray-900">
              {dailyEntries.length}
            </h3>
            <p className="text-gray-600">작성한 일기</p>
          </div>
          <div className="p-6 text-center modern-card">
            <div className="mb-3 text-3xl">🎵</div>
            <h3 className="mb-2 text-2xl font-bold text-gray-900">
              {dailyEntries.length}
            </h3>
            <p className="text-gray-600">선택한 음악</p>
          </div>
          <div className="p-6 text-center modern-card">
            <div className="mb-3 text-3xl">🤖</div>
            <h3 className="mb-2 text-2xl font-bold text-gray-900">
              {dailyEntries.length}
            </h3>
            <p className="text-gray-600">AI 분석</p>
          </div>
          <div className="p-6 text-center modern-card">
            <div className="mb-3 text-3xl">😊</div>
            <h3 className="mb-2 text-2xl font-bold text-gray-900">
              {getMostFrequentEmotion()}
            </h3>
            <p className="text-gray-600">가장 많은 감정</p>
          </div>
        </div>

        {/* Monthly Emotion Statistics */}
        {monthlyEmotionStats.length > 0 && (
          <div className="mb-12">
            <div className="p-8 modern-card">
              <div className="mb-8 text-center">
                <div className="mb-4">
                  <h2 className="mb-2 text-3xl font-bold text-gray-900">
                    📊 이번 달 감정 통계
                  </h2>
                  <div className="text-lg text-gray-700">
                    {getMonthlyEmotionMessage().message}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    {getMonthlyEmotionMessage().subMessage}
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={monthlyEmotionStats}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis
                      dataKey="emotion"
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      axisLine={{ stroke: "#d1d5db" }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      axisLine={{ stroke: "#d1d5db" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        fontSize: "14px",
                      }}
                      formatter={(value, name) => [value + "회", "감정 횟수"]}
                    />
                    <Bar
                      dataKey="count"
                      radius={[4, 4, 0, 0]}
                      fill="url(#emotionGradient)"
                    />
                    <defs>
                      <linearGradient
                        id="emotionGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0.7}
                        />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {monthlyEmotionStats.map((stat, index) => {
                  const emotionEmojis: Record<string, string> = {
                    행복함: "😊",
                    우울함: "😢",
                    스트레스: "😤",
                    설렘: "💕",
                    평온함: "😌",
                    지침: "😴",
                  };

                  return (
                    <div
                      key={`${stat.emotion}-${index}`}
                      className="p-4 text-center border border-gray-200 bg-gray-100 rounded-lg"
                    >
                      <div className="mb-2 text-2xl">
                        {emotionEmojis[stat.emotion] || "😐"}
                      </div>
                      <div className="font-semibold text-gray-900">
                        {stat.emotion}
                      </div>
                      <div className="text-sm text-gray-600">
                        {stat.count}회
                      </div>
                      {index === 0 && (
                        <div className="mt-2">
                          <span className="px-2 py-1 text-xs text-blue-800 rounded-full bg-blue-200">
                            최다
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate("/")}
            className="px-8 py-4 mr-4 text-lg font-medium soft-button rounded-lg"
          >
            ✏️ 새 일기 작성
          </button>
          {/* <button
            onClick={() => navigate("/music-board")}
            className="px-8 py-4 mr-4 text-lg font-medium text-purple-600 transition-colors border border-purple-200 bg-purple-50 rounded-lg hover:bg-purple-100"
          >
            🎵 음악 보드
          </button> */}
          <button
            onClick={fetchDailyEntries}
            className="px-6 py-4 text-sm font-medium text-gray-600 transition-colors border border-gray-200 bg-gray-50 rounded-lg hover:bg-gray-100"
          >
            🔄 새로고침
          </button>
        </div>

        {dailyEntries.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              💡 같은 날에 새 일기를 작성하거나 다른 음악을 선택하면 기존
              엔트리가 업데이트됩니다.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-block p-6 modern-card">
            <div className="text-sm text-gray-500">
              <div className="mb-2">제공: 음악 분석 & AI 감정 분석</div>
              <div className="mb-2">개발자: hyemin</div>
              <div className="text-xs">© 2025 감정 음악 프로젝트</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
