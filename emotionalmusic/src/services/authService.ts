// 사용자 인증 및 데이터 관리 서비스
import { safeJsonParse } from "../utils/apiUtils";

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
  USER: "emotional_music_user",
  DIARY_ENTRIES: "emotional_music_diary_entries",
  MOOD_DATA: "emotional_music_mood_data",
};

// 사용자 인증 서비스
export class AuthService {
  private static currentUser: User | null = null;

  // 로그인
  static async login(email: string, password: string): Promise<User> {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const errorData = await safeJsonParse(response);
        throw new Error(errorData.error || "로그인에 실패했습니다.");
      }

      const data = await safeJsonParse(response);
      const user: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.email.split("@")[0], // 서버에 name이 없으면 이메일에서 추출
        createdAt: new Date(data.user.created_at || Date.now()),
      };

      this.currentUser = user;
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      return user;
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
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const errorData = await safeJsonParse(response);
        throw new Error(errorData.error || "회원가입에 실패했습니다.");
      }

      const data = await safeJsonParse(response);
      const user: User = {
        id: data.user.id,
        email: data.user.email,
        name: name || data.user.email.split("@")[0],
        createdAt: new Date(data.user.created_at || Date.now()),
      };

      this.currentUser = user;
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      return user;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  }

  // 로그아웃
  static async logout(): Promise<void> {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.currentUser = null;
      // 모든 사용자 관련 데이터 삭제
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.DIARY_ENTRIES);
      localStorage.removeItem(STORAGE_KEYS.MOOD_DATA);
    }
  }

  // 현재 사용자 가져오기 (서버 세션 확인)
  static async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/me`,
        {
          credentials: 'include',
        }
      );

      if (response.ok) {
        const userData = await response.json();
        const user: User = {
          id: userData.id,
          email: userData.email,
          name: userData.email.split('@')[0],
          createdAt: new Date(userData.created_at || Date.now()),
        };
        this.currentUser = user;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        return user;
      } else {
        // 세션이 유효하지 않으면 정리
        this.currentUser = null;
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.DIARY_ENTRIES);
        localStorage.removeItem(STORAGE_KEYS.MOOD_DATA);
        return null;
      }
    } catch (error) {
      console.error('Session check error:', error);
      this.currentUser = null;
      return null;
    }
  }

  // 로그인 상태 확인
  static async isLoggedIn(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
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
