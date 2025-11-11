"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ResetPasswordFormProps {
  token?: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const passwordRequirements = useMemo(
    () => ({
      minLength: password.length >= 8,
      hasLetter: /[a-zA-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }),
    [password]
  );

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("토큰이 유효하지 않습니다. 비밀번호 재설정을 다시 요청해주세요.");
      return;
    }

    if (!isPasswordValid) {
      setError("비밀번호 요구사항을 모두 만족해야 합니다.");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "비밀번호 재설정에 실패했습니다");
      }

      setSuccess("비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.");

      setTimeout(() => {
        router.push("/auth/login?reset=success");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "비밀번호 재설정에 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-center space-y-4">
        <p className="text-red-300 text-sm">
          토큰이 유효하지 않거나 만료되었습니다. 다시 비밀번호 재설정을 요청해주세요.
        </p>
        <Link
          href="/auth/forgot-password"
          className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-[#363946] text-gray-200 hover:bg-[#4A4E5C] transition-colors"
        >
          비밀번호 재설정 다시 요청하기
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {success && (
        <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 text-sm text-green-300">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          새 비밀번호
        </label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="새 비밀번호를 입력하세요"
          required
          disabled={isLoading}
          className="w-full px-4 py-3 bg-[#363946] border border-[#4A4E5C] rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
        />

        {password && (
          <div className="mt-2 space-y-1 text-sm">
            <div
              className={`flex items-center gap-2 ${
                passwordRequirements.minLength ? "text-green-400" : "text-gray-500"
              }`}
            >
              <span>{passwordRequirements.minLength ? "✓" : "○"}</span>
              <span>8자리 이상</span>
            </div>
            <div
              className={`flex items-center gap-2 ${
                passwordRequirements.hasLetter ? "text-green-400" : "text-gray-500"
              }`}
            >
              <span>{passwordRequirements.hasLetter ? "✓" : "○"}</span>
              <span>영문 포함</span>
            </div>
            <div
              className={`flex items-center gap-2 ${
                passwordRequirements.hasNumber ? "text-green-400" : "text-gray-500"
              }`}
            >
              <span>{passwordRequirements.hasNumber ? "✓" : "○"}</span>
              <span>숫자 포함</span>
            </div>
            <div
              className={`flex items-center gap-2 ${
                passwordRequirements.hasSpecial ? "text-green-400" : "text-gray-500"
              }`}
            >
              <span>{passwordRequirements.hasSpecial ? "✓" : "○"}</span>
              <span>특수문자 포함</span>
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
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="새 비밀번호를 다시 입력하세요"
          required
          disabled={isLoading}
          className="w-full px-4 py-3 bg-[#363946] border border-[#4A4E5C] rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !isPasswordValid}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "비밀번호 변경 중..." : "비밀번호 변경"}
      </button>

      <div className="text-center space-y-2">
        <Link
          href="/auth/login"
          className="block text-gray-400 hover:text-gray-300 transition-colors font-medium"
        >
          로그인 화면으로 돌아가기
        </Link>
        <Link
          href="/auth/forgot-password"
          className="block text-gray-500 hover:text-gray-300 transition-colors text-sm"
        >
          토큰을 받지 못하셨나요? 다시 요청하기
        </Link>
      </div>
    </form>
  );
}


