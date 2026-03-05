import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (
    password: string,
  ): { isValid: boolean; message?: string } => {
    if (password.length < 8) {
      return {
        isValid: false,
        message: "비밀번호는 최소 8자 이상이어야 합니다.",
      };
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return {
        isValid: false,
        message: "비밀번호에 소문자가 포함되어야 합니다.",
      };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return {
        isValid: false,
        message: "비밀번호에 대문자가 포함되어야 합니다.",
      };
    }
    if (!/(?=.*\d)/.test(password)) {
      return {
        isValid: false,
        message: "비밀번호에 숫자가 포함되어야 합니다.",
      };
    }
    return { isValid: true };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 이메일 유효성 검사
      if (!validateEmail(email)) {
        throw new Error(
          "올바른 이메일 형식을 입력해주세요. (예: user@example.com)",
        );
      }

      if (isLogin) {
        const { error: loginError } = await signIn(email, password);
        if (loginError) {
          throw new Error(loginError.message || "로그인에 실패했습니다.");
        }
        // 로그인 성공 후 메인페이지로 이동
        navigate("/");
      } else {
        // 회원가입 시 추가 유효성 검사
        if (!name.trim()) {
          throw new Error("이름을 입력해주세요.");
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
          throw new Error(passwordValidation.message);
        }

        const { user, error: signUpError } = await signUp(
          email,
          password,
          name,
        );
        if (signUpError) {
          throw new Error(signUpError.message || "회원가입에 실패했습니다.");
        }

        // 이메일 확인이 필요한 경우
        if (!user?.email_confirmed_at) {
          throw new Error("이메일 확인이 필요합니다. 이메일을 확인해주세요.");
        }

        // 회원가입 성공 후 메인페이지로 이동
        navigate("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 font-sans sm:p-8 bg-gray-50">
      <div className="relative w-full max-w-md p-6 modern-card sm:p-8 lg:p-12">
        <div className="mb-6 text-center sm:mb-8">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 text-xl text-white bg-blue-600 rounded-full sm:w-16 sm:h-16 sm:text-2xl sm:mb-4">
            🔐
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-800 sm:text-3xl">
            {isLogin ? "다시 오신 것을 환영합니다" : "회원가입"}
          </h1>
          <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
            {isLogin
              ? "계정에 로그인하세요"
              : "감정 음악 커뮤니티에 가입하세요"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {!isLogin && (
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                이름
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-500 border border-gray-200 rounded-lg sm:px-4 sm:py-3 sm:text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="이름을 입력하세요"
                  autoComplete="name"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              이메일
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-500 border border-gray-200 rounded-lg sm:px-4 sm:py-3 sm:text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="user@example.com"
                autoComplete="email"
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-600">
              올바른 이메일 형식으로 입력해주세요
            </p>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              비밀번호
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-500 border border-gray-200 rounded-lg sm:px-4 sm:py-3 sm:text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="비밀번호를 입력하세요"
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
              />
            </div>
            {!isLogin && (
              <p className="mt-1 text-xs text-gray-600">
                최소 8자, 대소문자, 숫자 포함 필수
              </p>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-base font-medium rounded-lg soft-button sm:py-4 sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 mr-2 border-2 border-white rounded-full sm:w-5 sm:h-5 border-t-transparent animate-spin"></div>
                {isLogin ? "로그인 중..." : "계정 생성 중..."}
              </div>
            ) : isLogin ? (
              "🔑 로그인"
            ) : (
              "🚀 계정 만들기"
            )}
          </button>
        </form>

        <div className="mt-6 text-center sm:mt-8">
          <p className="mb-3 text-sm text-gray-600 sm:mb-4 sm:text-base">
            {isLogin ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLogin(!isLogin);
              setError("");
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg select-none sm:px-6 sm:py-3 sm:text-base hover:bg-gray-200"
            style={{ touchAction: "manipulation" }}
          >
            {isLogin ? "새 계정 만들기" : "로그인하기"}
          </button>
        </div>

        <div className="mt-6 text-center sm:mt-8">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate("/");
            }}
            className="flex items-center justify-center px-4 py-2 mx-auto space-x-2 text-sm text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg select-none sm:px-6 sm:py-3 sm:text-base hover:bg-gray-50"
            style={{ touchAction: "manipulation" }}
          >
            <span>←</span>
            <span>홈으로 돌아가기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
