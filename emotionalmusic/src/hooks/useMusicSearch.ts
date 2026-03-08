import { useState, useEffect, useCallback } from 'react';
import { searchItunesTracks, ItunesTrack } from '../services/itunes';

// 캐시 저장소
const trackCache = new Map<string, { data: ItunesTrack[], timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5분

export const useMusicSearch = (emotion: string) => {
  const [tracks, setTracks] = useState<ItunesTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchTracks = useCallback(async (forceRefresh = false) => {
    if (!emotion) return;
    
    try {
      setLoading(true);
      setError(null);

      // 캐시 확인 (강제 새로고침이 아닌 경우에만)
      if (!forceRefresh) {
        const cached = trackCache.get(emotion);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          setTracks(cached.data);
          setLoading(false);
          return;
        }
      }

      // iTunes API 호출
      const itunesTracks = await searchItunesTracks(emotion, 9);
      if (itunesTracks.length > 0) {
        setTracks(itunesTracks);
        // 캐시에 저장
        trackCache.set(emotion, { data: itunesTracks, timestamp: Date.now() });
      } else {
        setError("추천할 음악을 찾지 못했습니다. 다시 시도해주세요.");
      }
      
      setLoading(false);
    } catch (err) {
      console.error("음악 검색 오류:", err);
      setError("음악을 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      setLoading(false);
    }
  }, [emotion]);

  useEffect(() => {
    searchTracks();
  }, [searchTracks]);

  return { tracks, loading, error, searchTracks };
}; 