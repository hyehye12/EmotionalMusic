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
      console.log('Supabase 직접 로그인 시작...');
      console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL);
      
      // Supabase에서 사용자 정보 조회
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      console.log('사용자 조회 결과:', { user, error });

      if (error || !user) {
        throw new Error('이메일 또는 비밀번호가 잘못되었습니다.');
      }

      // 비밀번호 확인 (실제로는 bcrypt로 해시된 비밀번호를 비교해야 하지만, 
      // 여기서는 간단히 처리)
      if (user.password !== password) {
        throw new Error('이메일 또는 비밀번호가 잘못되었습니다.');
      }

      const userData: User = {
        id: user.id,
        email: user.email,
        name: user.email.split("@")[0],
        createdAt: new Date(user.created_at || Date.now()),
      };

      this.currentUser = userData;
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
      console.log('Supabase 직접 회원가입 시작...');
      
      // 이미 존재하는 사용자인지 확인
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (existingUser) {
        throw new Error('이미 등록된 이메일입니다.');
      }

      // 새 사용자 생성
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          email,
          password // 실제로는 해시된 비밀번호를 저장해야 함
        })
        .select()
        .single();

      if (error) {
        console.error('회원가입 오류:', error);
        throw new Error('회원가입에 실패했습니다.');
      }

      const userData: User = {
        id: newUser.id,
        email: newUser.email,
        name: name || newUser.email.split("@")[0],
        createdAt: new Date(newUser.created_at || Date.now()),
      };

      this.currentUser = userData;
      console.log('회원가입 성공, 사용자 정보 저장:', userData);
      return userData;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  }

  // 로그아웃
  static async logout(): Promise<void> {
    this.currentUser = null;
  }

  // 현재 사용자 가져오기
  static async getCurrentUser(): Promise<User | null> {
    // 현재 저장된 사용자 정보 반환
    return this.currentUser;
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