"use client";

import { useState } from "react";
import Link from "next/link";

interface ResetInfo {
  resetUrl?: string;
  resetToken?: string;
}

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resetInfo, setResetInfo] = useState<ResetInfo | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setResetInfo(null);

    if (!email.trim()) {
      setError("이메일을 입력해주세요");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "비밀번호 재설정 요청에 실패했습니다");
      }

      setSuccessMessage("비밀번호 재설정 안내를 이메일로 발송했습니다.");

      if (data.data?.resetUrl || data.data?.resetToken) {
        setResetInfo({
          resetUrl: data.data.resetUrl,
          resetToken: data.data.resetToken,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "비밀번호 재설정 요청에 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">비밀번호 재설정</h1>
        <p className="text-gray-400">
          가입한 이메일을 입력하면 비밀번호 재설정 링크를 보내드릴게요.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {successMessage && (
          <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 text-sm text-green-300 space-y-2">
            <p>{successMessage}</p>
            {resetInfo?.resetUrl && (
              <div className="space-y-1">
                <p className="font-medium">개발 환경용 재설정 링크:</p>
                <Link
                  href={resetInfo.resetUrl}
                  className="text-green-200 underline break-all"
                >
                  {resetInfo.resetUrl}
                </Link>
              </div>
            )}
            {resetInfo?.resetToken && (
              <div className="space-y-1">
                <p className="font-medium">재설정 토큰:</p>
                <code className="block w-full overflow-x-auto rounded bg-green-950/40 px-3 py-2 text-xs text-green-200">
                  {resetInfo.resetToken}
                </code>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            이메일
          </label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="가입 시 사용한 이메일을 입력하세요"
            required
            disabled={isLoading}
            className="w-full px-4 py-3 bg-[#363946] border border-[#4A4E5C] rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-[#363946] hover:bg-[#4A4E5C] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "처리 중..." : "재설정 링크 보내기"}
        </button>

        <div className="text-center space-y-2">
          <Link
            href="/auth/login"
            className="block text-gray-400 hover:text-gray-300 transition-colors font-medium"
          >
            로그인 화면으로 돌아가기
          </Link>
          <Link
            href="/auth/signup"
            className="block text-gray-500 hover:text-gray-300 transition-colors text-sm"
          >
            아직 계정이 없으신가요? 회원가입하기
          </Link>
        </div>
      </form>
    </div>
  );
}


