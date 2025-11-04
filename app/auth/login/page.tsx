import { createMetadata } from "@/lib/metadata";
import LoginForm from "./LoginForm";

export const metadata = createMetadata({
  title: "로그인",
  description: "아이온2 정보 사이트에 로그인하세요",
  path: "/auth/login",
});

export default function LoginPage({
  searchParams,
}: {
  searchParams: { signup?: string; redirect_url?: string };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#282A36' }}>
      <div className="w-full max-w-md px-4">
        {searchParams.signup === "success" && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 z-50 max-w-md">
            <p className="text-sm text-green-600 dark:text-green-400">
              회원가입이 완료되었습니다. 로그인해주세요.
            </p>
          </div>
        )}
        <LoginForm />
      </div>
    </div>
  );
}
