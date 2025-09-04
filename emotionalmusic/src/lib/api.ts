// src/lib/api.ts (Axios 인스턴스)
import axios from "axios";
import { supabase } from "./supabase";

const STORAGE_KEY = "emotional_music_token";

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  try {
    // Supabase에서 현재 세션 가져오기
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token || localStorage.getItem(STORAGE_KEY);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // localStorage에도 최신 토큰 저장
      if (session?.access_token) {
        localStorage.setItem(STORAGE_KEY, session.access_token);
      }
    }
  } catch (error) {
    console.error("Token interceptor error:", error);
    // 토큰 가져오기 실패 시 localStorage에서 시도
    const token = localStorage.getItem(STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
