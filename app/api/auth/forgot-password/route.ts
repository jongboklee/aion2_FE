import { NextRequest, NextResponse } from "next/server";
import { createApiResponse, createApiError } from "@/lib/api";
import { users } from "@/lib/users";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const RESET_TOKEN_EXPIRY_MINUTES = 15;

/**
 * POST /api/auth/forgot-password
 * 비밀번호 재설정 요청 API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        createApiError("이메일을 입력해주세요", 400),
        { status: 400 }
      );
    }

    const user = users.find((u) => u.email === email);

    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000);

      user.resetToken = resetToken;
      user.resetTokenExpires = expiresAt;

      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL ||
        process.env.NEXTAUTH_URL ||
        "http://localhost:3003";

      const resetUrl = `${baseUrl.replace(/\/$/, "")}/auth/reset-password?token=${resetToken}`;

      return NextResponse.json(
        createApiResponse(
          {
            resetToken: process.env.NODE_ENV === "production" ? undefined : resetToken,
            resetUrl: process.env.NODE_ENV === "production" ? undefined : resetUrl,
            expiresAt: expiresAt.toISOString(),
          },
          "비밀번호 재설정 안내를 이메일로 발송했습니다"
        )
      );
    }

    return NextResponse.json(
      createApiResponse(
        {
          resetToken: undefined,
          resetUrl: undefined,
        },
        "비밀번호 재설정 안내를 이메일로 발송했습니다"
      )
    );
  } catch (error) {
    console.error("Forgot password API error:", error);
    return NextResponse.json(
      createApiError("비밀번호 재설정 요청 중 오류가 발생했습니다", 500),
      { status: 500 }
    );
  }
}


