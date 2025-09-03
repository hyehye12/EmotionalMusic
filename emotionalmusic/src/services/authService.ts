// 사용자 인증 및 데이터 관리 서비스
import { safeJsonParse } from '../utils/apiUtils';

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
  USER: 'emotional_music_user',
  DIARY_ENTRIES: 'emotional_music_diary_entries',
  MOOD_DATA: 'emotional_music_mood_data'
};

// 사용자 인증 서비스
export class AuthService {
  private static currentUser: User | null = null;

  // 로그인
  static async login(email: string, password: string): Promise<User> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await safeJsonParse(response);
        throw new Error(errorData.error || '로그인에 실패했습니다.');
      }

      const data = await safeJsonParse(response);
      const user: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.email.split('@')[0], // 서버에 name이 없으면 이메일에서 추출
        createdAt: new Date(data.user.created_at || Date.now())
      };

      this.currentUser = user;
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // 회원가입
  static async register(email: string, password: string, name: string): Promise<User> {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await safeJsonParse(response);
        throw new Error(errorData.error || '회원가입에 실패했습니다.');
      }

      const data = await safeJsonParse(response);
      const user: User = {
        id: data.user.id,
        email: data.user.email,
        name: name || data.user.email.split('@')[0],
        createdAt: new Date(data.user.created_at || Date.now())
      };

      this.currentUser = user;
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  // 로그아웃
  static async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.currentUser = null;
      // 모든 사용자 관련 데이터 삭제
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.DIARY_ENTRIES);
      localStorage.removeItem(STORAGE_KEYS.MOOD_DATA);
    }
  }

  // 현재 사용자 가져오기
  static getCurrentUser(): User | null {
    if (!this.currentUser) {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    }
    return this.currentUser;
  }

  // 로그인 상태 확인
  static isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }
}

// 일기 데이터 서비스
export class DiaryService {
  // 일기 저장
  static async saveDiaryEntry(entry: Omit<DiaryEntry, 'id' | 'createdAt'>): Promise<DiaryEntry> {
    const user = AuthService.getCurrentUser();
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    const diaryEntry: DiaryEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    const entries = this.getDiaryEntries();
    entries.push(diaryEntry);
    localStorage.setItem(STORAGE_KEYS.DIARY_ENTRIES, JSON.stringify(entries));

    return diaryEntry;
  }

  // 일기 목록 가져오기
  static getDiaryEntries(): DiaryEntry[] {
    const user = AuthService.getCurrentUser();
    if (!user) return [];

    const stored = localStorage.getItem(STORAGE_KEYS.DIARY_ENTRIES);
    if (!stored) return [];

    const entries: DiaryEntry[] = JSON.parse(stored);
    return entries.filter(entry => entry.userId === user.id);
  }

  // 최근 일기 가져오기
  static getRecentDiaryEntries(limit: number = 7): DiaryEntry[] {
    const entries = this.getDiaryEntries();
    return entries
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  // 일기 삭제
  static deleteDiaryEntry(entryId: string): void {
    const entries = this.getDiaryEntries();
    const filteredEntries = entries.filter(entry => entry.id !== entryId);
    localStorage.setItem(STORAGE_KEYS.DIARY_ENTRIES, JSON.stringify(filteredEntries));
  }
}

// 기분 데이터 서비스
export class MoodService {
  // 기분 데이터 저장
  static async saveMoodData(moodData: Omit<MoodData, 'date'>): Promise<MoodData> {
    const user = AuthService.getCurrentUser();
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    const data: MoodData = {
      ...moodData,
      date: new Date().toISOString().split('T')[0]
    };

    const moodHistory = this.getMoodHistory();
    const existingIndex = moodHistory.findIndex(item => item.date === data.date);
    
    if (existingIndex >= 0) {
      moodHistory[existingIndex] = data;
    } else {
      moodHistory.push(data);
    }

    localStorage.setItem(STORAGE_KEYS.MOOD_DATA, JSON.stringify(moodHistory));
    return data;
  }

  // 기분 히스토리 가져오기
  static getMoodHistory(): MoodData[] {
    const user = AuthService.getCurrentUser();
    if (!user) return [];

    const stored = localStorage.getItem(STORAGE_KEYS.MOOD_DATA);
    if (!stored) return [];

    return JSON.parse(stored);
  }

  // 주간 기분 데이터 가져오기
  static getWeeklyMoodData(): MoodData[] {
    const history = this.getMoodHistory();
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return history.filter(data => {
      const dataDate = new Date(data.date);
      return dataDate >= weekAgo && dataDate <= today;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // 월간 기분 데이터 가져오기
  static getMonthlyMoodData(): MoodData[] {
    const history = this.getMoodHistory();
    const today = new Date();
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    return history.filter(data => {
      const dataDate = new Date(data.date);
      return dataDate >= monthAgo && dataDate <= today;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
} 