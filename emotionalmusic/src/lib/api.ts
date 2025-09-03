// src/lib/api.ts (Axios 인스턴스)
import axios from "axios";
import { supabase } from "./supabase";

export const api = axios.create({
  baseURL: process.env.REACT_API_URL, // 예: https://your-backend.onrender.com
});

api.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
