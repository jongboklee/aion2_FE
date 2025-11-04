"use client";

import { signIn } from "next-auth/react";

interface OAuthButtonProps {
  provider: "google" | "github" | "naver" | "discord";
  label: string;
  icon?: React.ReactNode;
}

export default function OAuthButton({ provider, label, icon }: OAuthButtonProps) {
  const handleClick = () => {
    signIn(provider, {
      callbackUrl: "/",
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-[#4A4E5C] bg-[#363946] text-gray-300 hover:bg-[#4A4E5C] rounded-lg transition-colors"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
