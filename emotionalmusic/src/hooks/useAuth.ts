import { useState, useEffect, useCallback } from 'react';
import { AuthService, User } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 초기 로드 시 서버 세션 확인
    const checkSession = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        setUser(user);
      } catch (error) {
        console.error('Session check error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const user = await AuthService.login(email, password);
      setUser(user);
      return user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const user = await AuthService.register(email, password, name);
      setUser(user);
      return user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await AuthService.logout();
    setUser(null);
  }, []);

  return {
    user,
    loading,
    login,
    register,
    logout,
    isLoggedIn: !!user
  };
}; 