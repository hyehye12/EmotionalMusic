// 사용자 인증 및 데이터 관리 서비스
import { supabase } from "../config/supabase";

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface DiaryEntry {
  id: string;
  userId: string;
  content: string;
  emotion: string;
  analysis?: string;
  advice?: string;
  encouragement?: string;
  createdAt: Date;
}

export interface MoodData {
  date: string;
  emotion: string;
  score: number; // 감정 점수 (1-10)
}

// 로컬 스토리지 키
const STORAGE_KEYS = {
  TOKEN: "emotional_music_token",
  USER: "emotional_music_user",
  DIARY_ENTRIES: "emotional_music_diary_entries",
  MOOD_DATA: "emotional_music_mood_data",
};

// 사용자 인증 서비스
export class AuthService {
  private static currentUser: User | null = null;

  // API 호출에 사용할 헤더 생성
  private static getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) {
      return { 'Content-Type': 'application/json' };
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  // 로그인
  static async login(email: string, password: string): Promise<User> {
    try {
      console.log('Supabase + JWT 로그인 시작...');
      
      // Supabase Auth를 사용한 로그인
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message || '로그인에 실패했습니다.');
      }

      if (!data.user || !data.session) {
        throw new Error('로그인 데이터가 없습니다.');
      }

      console.log('Supabase 로그인 성공:', data);

      // Supabase JWT 토큰을 localStorage에 저장
      if (data.session.access_token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, data.session.access_token);
      }

      const userData: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.name || data.user.email?.split("@")[0] || '',
        createdAt: new Date(data.user.created_at || Date.now()),
      };

      this.currentUser = userData;
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      console.log('로그인 성공, 사용자 정보 저장:', userData);
      return userData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  // 회원가입
  static async register(
    email: string,
    password: string,
    name: string
  ): Promise<User> {
    try {
      console.log('Supabase + JWT 회원가입 시작...');
      
      // Supabase Auth를 사용한 회원가입
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          }
        }
      });

      if (error) {
        throw new Error(error.message || '회원가입에 실패했습니다.');
      }

      if (!data.user) {
        throw new Error('회원가입 데이터가 없습니다.');
      }

      console.log('Supabase 회원가입 성공:', data);

      // 이메일 확인이 필요한 경우를 위한 처리
      if (!data.session) {
        throw new Error('이메일 확인이 필요합니다. 이메일을 확인해주세요.');
      }

      // Supabase JWT 토큰을 localStorage에 저장
      if (data.session.access_token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, data.session.access_token);
      }

      const userData: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: name || data.user.email?.split("@")[0] || '',
        createdAt: new Date(data.user.created_at || Date.now()),
      };

      this.currentUser = userData;
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      console.log('회원가입 성공, 사용자 정보 저장:', userData);
      return userData;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  }

  // 로그아웃
  static async logout(): Promise<void> {
    try {
      // Supabase Auth 로그아웃
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // 로컬 스토리지에서 토큰과 사용자 정보 제거
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      this.currentUser = null;
    }
  }

  // 현재 사용자 가져오기
  static async getCurrentUser(): Promise<User | null> {
    try {
      // Supabase에서 현재 세션 확인
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session || !session.user) {
        // 세션이 없으면 로컬 스토리지 정리
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        this.currentUser = null;
        return null;
      }

      // JWT 토큰을 localStorage에 저장 (갱신된 토큰이 있을 수 있음)
      if (session.access_token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, session.access_token);
      }

      const userData: User = {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || '',
        createdAt: new Date(session.user.created_at || Date.now()),
      };

      this.currentUser = userData;
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Get current user error:", error);
      // 오류 발생 시 로그아웃 처리
      this.logout();
      return null;
    }
  }

  // 로그인 상태 확인
  static async isLoggedIn(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }

  // 외부에서 사용할 수 있는 인증 헤더 생성 메서드
  static getPublicAuthHeaders(): HeadersInit {
    return this.getAuthHeaders();
  }
}

// 일기 데이터 서비스
export class DiaryService {
  // 일기 저장
  static async saveDiaryEntry(
    entry: Omit<DiaryEntry, "id" | "createdAt">
  ): Promise<DiaryEntry> {
    const user = await AuthService.getCurrentUser();
    if (!user) {
      throw new Error("로그인이 필요합니다.");
    }

    const diaryEntry: DiaryEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    const entries = await this.getDiaryEntries();
    entries.push(diaryEntry);
    localStorage.setItem(STORAGE_KEYS.DIARY_ENTRIES, JSON.stringify(entries));

    return diaryEntry;
  }

  // 일기 목록 가져오기
  static async getDiaryEntries(): Promise<DiaryEntry[]> {
    const user = await AuthService.getCurrentUser();
    if (!user) return [];

    const stored = localStorage.getItem(STORAGE_KEYS.DIARY_ENTRIES);
    if (!stored) return [];

    const entries: DiaryEntry[] = JSON.parse(stored);
    return entries.filter((entry) => entry.userId === user.id);
  }

  // 최근 일기 가져오기
  static async getRecentDiaryEntries(limit: number = 7): Promise<DiaryEntry[]> {
    const entries = await this.getDiaryEntries();
    return entries
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, limit);
  }

  // 일기 삭제
  static async deleteDiaryEntry(entryId: string): Promise<void> {
    const entries = await this.getDiaryEntries();
    const filteredEntries = entries.filter((entry) => entry.id !== entryId);
    localStorage.setItem(
      STORAGE_KEYS.DIARY_ENTRIES,
      JSON.stringify(filteredEntries)
    );
  }
}

// 기분 데이터 서비스
export class MoodService {
  // 기분 데이터 저장
  static async saveMoodData(
    moodData: Omit<MoodData, "date">
  ): Promise<MoodData> {
    const user = await AuthService.getCurrentUser();
    if (!user) {
      throw new Error("로그인이 필요합니다.");
    }

    const data: MoodData = {
      ...moodData,
      date: new Date().toISOString().split("T")[0],
    };

    const moodHistory = await this.getMoodHistory();
    const existingIndex = moodHistory.findIndex(
      (item) => item.date === data.date
    );

    if (existingIndex >= 0) {
      moodHistory[existingIndex] = data;
    } else {
      moodHistory.push(data);
    }

    localStorage.setItem(STORAGE_KEYS.MOOD_DATA, JSON.stringify(moodHistory));
    return data;
  }

  // 기분 히스토리 가져오기
  static async getMoodHistory(): Promise<MoodData[]> {
    const user = await AuthService.getCurrentUser();
    if (!user) return [];

    const stored = localStorage.getItem(STORAGE_KEYS.MOOD_DATA);
    if (!stored) return [];

    return JSON.parse(stored);
  }

  // 주간 기분 데이터 가져오기
  static async getWeeklyMoodData(): Promise<MoodData[]> {
    const history = await this.getMoodHistory();
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    return history
      .filter((data) => {
        const dataDate = new Date(data.date);
        return dataDate >= weekAgo && dataDate <= today;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // 월간 기분 데이터 가져오기
  static async getMonthlyMoodData(): Promise<MoodData[]> {
    const history = await this.getMoodHistory();
    const today = new Date();
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return history
      .filter((data) => {
        const dataDate = new Date(data.date);
        return dataDate >= monthAgo && dataDate <= today;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
}