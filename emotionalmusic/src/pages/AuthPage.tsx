import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): { isValid: boolean; message?: string } => {
    if (password.length < 8) {
      return { isValid: false, message: '비밀번호는 최소 8자 이상이어야 합니다.' };
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return { isValid: false, message: '비밀번호에 소문자가 포함되어야 합니다.' };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return { isValid: false, message: '비밀번호에 대문자가 포함되어야 합니다.' };
    }
    if (!/(?=.*\d)/.test(password)) {
      return { isValid: false, message: '비밀번호에 숫자가 포함되어야 합니다.' };
    }
    return { isValid: true };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 이메일 유효성 검사
      if (!validateEmail(email)) {
        throw new Error('올바른 이메일 형식을 입력해주세요. (예: user@example.com)');
      }

      if (isLogin) {
        await login(email, password);
      } else {
        // 회원가입 시 추가 유효성 검사
        if (!name.trim()) {
          throw new Error('이름을 입력해주세요.');
        }
        
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
          throw new Error(passwordValidation.message);
        }
        
        await register(email, password, name);
      }
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 font-sans bg-gray-50">
      <div className="modern-card p-6 sm:p-8 lg:p-12 w-full max-w-md relative">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl mb-3 sm:mb-4">
            🔐
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            {isLogin ? '다시 오신 것을 환영합니다' : '회원가입'}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            {isLogin ? '계정에 로그인하세요' : '감정 음악 커뮤니티에 가입하세요'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                이름
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="이름을 입력하세요"
                  autoComplete="name"
                  required={!isLogin}
                />
                </div>
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="user@example.com"
                autoComplete="email"
                required
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">올바른 이메일 형식으로 입력해주세요</p>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="비밀번호를 입력하세요"
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
              />
            </div>
            {!isLogin && (
              <p className="text-xs text-gray-600 mt-1">
                최소 8자, 대소문자, 숫자 포함 필수
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-100 border border-red-300 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full soft-button py-3 sm:py-4 rounded-lg font-medium text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 sm:w-5 sm:h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {isLogin ? '로그인 중...' : '계정 생성 중...'}
              </div>
            ) : (
              isLogin ? '🔑 로그인' : '🚀 계정 만들기'
            )}
          </button>
        </form>

        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
            {isLogin ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLogin(!isLogin);
              setError('');
            }}
            className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors select-none"
            style={{ touchAction: 'manipulation' }}
          >
            {isLogin ? '새 계정 만들기' : '로그인하기'}
          </button>
        </div>

        <div className="mt-6 sm:mt-8 text-center">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate('/');
            }}
            className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 mx-auto select-none"
            style={{ touchAction: 'manipulation' }}
          >
            <span>←</span>
            <span>홈으로 돌아가기</span>
          </button>
        </div>
      </div>
    </div>
  );
}