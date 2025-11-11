import { createMetadata } from "@/lib/metadata";
import ForgotPasswordForm from "./ForgotPasswordForm";

export const metadata = createMetadata({
  title: "비밀번호 재설정",
  description: "비밀번호 재설정 안내를 받아보세요",
  path: "/auth/forgot-password",
});

export default function ForgotPasswordPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#282A36" }}
    >
      <div className="w-full max-w-md px-4">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}


