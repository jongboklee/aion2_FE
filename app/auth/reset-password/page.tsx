import { createMetadata } from "@/lib/metadata";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata = createMetadata({
  title: "비밀번호 변경",
  description: "발급받은 토큰으로 비밀번호를 변경하세요",
  path: "/auth/reset-password",
});

interface ResetPasswordPageProps {
  searchParams: {
    token?: string;
  };
}

export default function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const token = searchParams?.token;

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#282A36" }}
    >
      <div className="w-full max-w-md px-4 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">새 비밀번호 설정</h1>
          <p className="text-gray-400 text-sm">
            비밀번호 재설정 토큰은 발급 후 15분 동안만 유효합니다.
          </p>
        </div>
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}


