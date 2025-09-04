import { useState, useEffect, useCallback } from 'react';
import { AuthService, User } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 초기 로드 시 현재 사용자 확인
    const checkUser = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        setUser(user);
      } catch (error) {
        console.error('User check error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('로그인 시작...');
      const user = await AuthService.login(email, password);
      console.log('로그인 성공, 사용자 정보:', user);
      
      setUser(user);
      console.log('사용자 상태 업데이트 완료, isLoggedIn:', !!user);
      
      return user;
    } catch (error) {
      console.error('로그인 오류:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      console.log('회원가입 시작...');
      const user = await AuthService.register(email, password, name);
      console.log('회원가입 성공, 사용자 정보:', user);
      setUser(user);
      console.log('사용자 상태 업데이트 완료, isLoggedIn:', !!user);
      return user;
    } catch (error) {
      console.error('회원가입 오류:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await AuthService.logout();
    setUser(null);
  }, []);

  const isLoggedIn = !!user;
  
  console.log('useAuth 반환값:', { user, isLoggedIn, loading });
  
  return {
    user,
    loading,
    login,
    register,
    logout,
    isLoggedIn
  };
}; 