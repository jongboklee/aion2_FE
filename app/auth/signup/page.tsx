import { createMetadata } from "@/lib/metadata";
import SignupForm from "./SignupForm";

export const metadata = createMetadata({
  title: "회원가입",
  description: "아이온2 정보 사이트에 회원가입하세요",
  path: "/auth/signup",
});

export default function SignupPage({
  searchParams,
}: {
  searchParams: { redirect_url?: string };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center dark-theme" style={{ backgroundColor: '#282A36' }}>
      <div className="w-full max-w-md px-4">
        <SignupForm />
      </div>
    </div>
  );
}
