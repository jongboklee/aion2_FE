"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { signIn } from "next-auth/react";

export default function SignupForm() {
  const [step, setStep] = useState<"email" | "verify" | "password">("email");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const router = useRouter();

  // 비밀번호 유효성 검사
  const passwordRequirements = {
    minLength: password.length >= 8,
    hasLetter: /[a-zA-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email.trim()) {
      setError("이메일을 입력해주세요");
      return;
    }

    // 실제로는 이메일 인증 API 호출
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("verify");
    }, 1000);
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!verificationCode.trim()) {
      setError("인증번호를 입력해주세요");
      return;
    }

    // 실제로는 인증번호 확인 API 호출
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("password");
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isPasswordValid) {
      setError("비밀번호 요구사항을 모두 만족해야 합니다");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다");
      return;
    }

    if (!agreeToTerms) {
      setError("이용약관에 동의해주세요");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "회원가입에 실패했습니다");
      }

      const redirectUrl = new URLSearchParams(window.location.search).get("redirect_url");
      const loginUrl = redirectUrl 
        ? `/auth/login?signup=success&redirect_url=${encodeURIComponent(redirectUrl)}`
        : "/auth/login?signup=success";
      router.push(loginUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원가입에 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignup = (provider: string) => {
    signIn(provider, {
      callbackUrl: new URLSearchParams(window.location.search).get("redirect_url") || "/",
    });
  };

  return (
    <div className="w-full">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">
          환영합니다 👋
        </h1>
        <p className="text-gray-400">
          회원가입을 진행해 볼까요?
        </p>
      </div>

      {/* 소셜 로그인 아이콘 */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => handleOAuthSignup("google")}
          className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform"
          aria-label="Google로 계속하기"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => handleOAuthSignup("naver")}
          className="w-12 h-12 rounded-full bg-[#03C75A] flex items-center justify-center hover:scale-110 transition-transform"
          aria-label="Naver로 계속하기"
        >
          <span className="text-white font-bold text-lg">N</span>
        </button>

        <button
          type="button"
          onClick={() => handleOAuthSignup("discord")}
          className="w-12 h-12 rounded-full bg-[#5865F2] flex items-center justify-center hover:scale-110 transition-transform"
          aria-label="Discord로 계속하기"
        >
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
        </button>
      </div>

      {/* 이메일 입력 단계 */}
      {step === "email" && (
        <form onSubmit={handleEmailSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              이메일
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
                required
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-[#363946] border border-[#4A4E5C] rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
              />
              {email && (
                <button
                  type="button"
                  onClick={() => setEmail("")}
                  className="px-4 py-3 bg-[#363946] border border-[#4A4E5C] rounded-lg text-gray-300 hover:text-white transition-colors"
                >
                  수정
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#363946] hover:bg-[#4A4E5C] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "처리 중..." : "확인"}
          </button>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-gray-400 hover:text-gray-300 transition-colors font-medium"
            >
              로그인하기
            </Link>
          </div>
        </form>
      )}

      {/* 인증번호 입력 단계 */}
      {step === "verify" && (
        <form onSubmit={handleVerificationSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              이메일
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                disabled
                className="flex-1 px-4 py-3 bg-[#363946] border border-[#4A4E5C] rounded-lg text-gray-300 opacity-60"
              />
              <button
                type="button"
                onClick={() => setStep("email")}
                className="px-4 py-3 bg-[#363946] border border-[#4A4E5C] rounded-lg text-gray-300 hover:text-white transition-colors"
              >
                수정
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              인증번호
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="인증번호를 입력하세요"
                required
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-[#363946] border border-[#4A4E5C] rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => {
                  // 재전송 로직
                  setVerificationCode("");
                }}
                className="px-4 py-3 bg-[#363946] border border-[#4A4E5C] rounded-lg text-gray-300 hover:text-white transition-colors"
              >
                재전송
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#363946] hover:bg-[#4A4E5C] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "확인 중..." : "확인"}
          </button>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-gray-400 hover:text-gray-300 transition-colors font-medium"
            >
              로그인하기
            </Link>
          </div>
        </form>
      )}

      {/* 비밀번호 입력 단계 */}
      {step === "password" && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              이메일
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                disabled
                className="flex-1 px-4 py-3 bg-[#363946] border border-[#4A4E5C] rounded-lg text-gray-300 opacity-60"
              />
              <button
                type="button"
                onClick={() => setStep("email")}
                className="px-4 py-3 bg-[#363946] border border-[#4A4E5C] rounded-lg text-gray-300 hover:text-white transition-colors"
              >
                수정
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
              disabled={isLoading}
              className="w-full px-4 py-3 bg-[#363946] border border-[#4A4E5C] rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
            />
            
            {/* 비밀번호 규칙 체크리스트 */}
            {password && (
              <div className="mt-2 space-y-1 text-sm">
                <div className={`flex items-center gap-2 ${passwordRequirements.minLength ? 'text-green-400' : 'text-gray-500'}`}>
                  <span>{passwordRequirements.minLength ? '✓' : '○'}</span>
                  <span>8자리 이상</span>
                </div>
                <div className={`flex items-center gap-2 ${passwordRequirements.hasLetter ? 'text-green-400' : 'text-gray-500'}`}>
                  <span>{passwordRequirements.hasLetter ? '✓' : '○'}</span>
                  <span>영문, 숫자, 특수문자를 모두 포함</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              비밀번호 확인
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              required
              disabled={isLoading}
              className="w-full px-4 py-3 bg-[#363946] border border-[#4A4E5C] rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
            />
          </div>

          {/* 이용약관 동의 */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-[#4A4E5C] bg-[#363946] text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
              disabled={isLoading}
            />
            <span className="text-sm text-gray-400">
              이용 약관과 개인정보 수집 및 이용에 동의합니다.
            </span>
          </label>

          <button
            type="submit"
            disabled={isLoading || !isPasswordValid || !agreeToTerms}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "가입 중..." : "확인"}
          </button>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-gray-400 hover:text-gray-300 transition-colors font-medium"
            >
              로그인하기
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
