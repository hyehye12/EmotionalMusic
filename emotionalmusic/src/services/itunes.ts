// iTunes API 서비스
import { safeJsonParse } from '../utils/apiUtils';

export interface ItunesTrack {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName: string;
  artworkUrl100: string;
  previewUrl?: string;
  trackViewUrl: string;
  primaryGenreName: string;
  trackTimeMillis?: number;
  kind?: string; // kind 속성 추가
}

export interface ItunesResponse {
  resultCount: number;
  results: ItunesTrack[];
}

// 감정별 iTunes 검색 키워드 (한국어 + 영어 혼합)
const emotionToItunesQueries: { [key: string]: string[] } = {
  "😀": ["happy upbeat music", "신나는 노래", "feel good songs", "기분 좋은 음악", "energetic pop"],
  "😢": ["sad emotional music", "슬픈 노래", "heartbreak ballads", "감성 발라드", "emotional indie"], 
  "😡": ["angry rock music", "록 음악", "heavy metal", "하드록", "punk rock"],
  "😍": ["romantic love songs", "사랑 노래", "love ballads", "로맨틱 팝", "연인 음악"],
  "😌": ["calm peaceful music", "잔잔한 음악", "acoustic folk", "힐링 음악", "soft indie"],
  "😴": ["relaxing sleep music", "잠잘때 듣는 음악", "piano lullabies", "수면 음악", "calm instrumental"],
  "행복함": ["happy k-pop", "신나는 가요", "feel good songs", "기분 좋은 팝", "uplifting music"],
  "지침": ["tired relaxing music", "피로회복 음악", "chill out music", "힐링 발라드", "lofi hip hop"],
  "스트레스": ["stress relief music", "스트레스 해소 음악", "calming meditation", "명상 음악", "yoga music"],
  "설렘": ["romantic k-pop", "설레는 노래", "butterflies music", "달콤한 팝", "indie love"],
  "우울함": ["sad k-ballad", "우울한 노래", "melancholy indie", "감성 발라드", "emotional ballads"],
  "평온함": ["peaceful korean music", "평온한 음악", "zen meditation", "뉴에이지", "mindfulness music"],
};

// 검색 쿼리 인덱스를 저장하는 객체 (각 감정마다 별도로)
const queryIndexes: { [key: string]: number } = {};

// iTunes에서 음악 검색 (한국 + 해외 음악 혼합)
export const searchItunesTracks = async (emotion: string, limit: number = 9): Promise<ItunesTrack[]> => {
  try {
    // 감정에 맞는 검색 쿼리 배열 가져오기
    const queries = emotionToItunesQueries[emotion] || ["mood music", "popular music", "top songs"];
    
    // 현재 감정의 쿼리 인덱스 가져오기 (또는 0으로 초기화)
    if (!(emotion in queryIndexes)) {
      queryIndexes[emotion] = 0;
    }
    
    // 현재 인덱스의 쿼리 사용하고 다음으로 증가
    const query = queries[queryIndexes[emotion] % queries.length];
    queryIndexes[emotion] = (queryIndexes[emotion] + 1) % queries.length;
    
    console.log(`Searching iTunes with query: "${query}" for emotion: ${emotion}`);
    
    // 한국과 해외 음악을 섞기 위해 두 번의 API 호출
    const koreanLimit = Math.ceil(limit / 2);
    const globalLimit = limit - koreanLimit;
    
    // 1. 한국 음악 검색
    const koreanResponse = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=${koreanLimit + 10}&country=KR&lang=ko_kr`
    );
    
    // 2. 해외 음악 검색
    const globalResponse = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=${globalLimit + 10}&country=US&lang=en_us`
    );

    let allTracks: ItunesTrack[] = [];

    // 한국 음악 처리
    if (koreanResponse.ok) {
      try {
        const koreanData: ItunesResponse = await safeJsonParse(koreanResponse);
        if (koreanData.results) {
          const koreanTracks = koreanData.results
            .filter(item => 
              item.trackName && 
              item.artistName && 
              item.collectionName &&
              (!item.kind || item.kind === 'song')
            )
            .slice(0, koreanLimit);
          allTracks = allTracks.concat(koreanTracks);
        }
      } catch (parseError) {
        console.warn('한국 iTunes API 응답 파싱 실패:', parseError);
      }
    }

    // 해외 음악 처리
    if (globalResponse.ok) {
      try {
        const globalData: ItunesResponse = await safeJsonParse(globalResponse);
        if (globalData.results) {
          const globalTracks = globalData.results
            .filter(item => 
              item.trackName && 
              item.artistName && 
              item.collectionName &&
              (!item.kind || item.kind === 'song')
            )
            .slice(0, globalLimit);
          allTracks = allTracks.concat(globalTracks);
        }
      } catch (parseError) {
        console.warn('해외 iTunes API 응답 파싱 실패:', parseError);
      }
    }
    
    // 결과가 없으면 에러
    if (allTracks.length === 0) {
      throw new Error('검색 결과가 없습니다');
    }

    // 결과를 섞고 limit 개만 반환
    const shuffledTracks = allTracks.sort(() => Math.random() - 0.5);
    return shuffledTracks.slice(0, limit);
    
  } catch (error) {
    console.error('iTunes 검색 오류:', error);
    throw error;
  }
};

