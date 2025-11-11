import { NextRequest, NextResponse } from "next/server";
import { createApiResponse, createApiError } from "@/lib/api";
import { users } from "@/lib/users";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/reset-password
 * 비밀번호 재설정 API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password, confirmPassword } = body;

    if (!token) {
      return NextResponse.json(
        createApiError("토큰이 유효하지 않습니다", 400),
        { status: 400 }
      );
    }

    if (!password || !confirmPassword) {
      return NextResponse.json(
        createApiError("새 비밀번호를 모두 입력해주세요", 400),
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        createApiError("비밀번호가 일치하지 않습니다", 400),
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        createApiError("비밀번호는 최소 8자 이상이어야 합니다", 400),
        { status: 400 }
      );
    }

    const user = users.find(
      (u) =>
        u.resetToken === token &&
        !!u.resetTokenExpires &&
        u.resetTokenExpires.getTime() > Date.now()
    );

    if (!user) {
      return NextResponse.json(
        createApiError("토큰이 만료되었거나 유효하지 않습니다", 400),
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpires = null;

    return NextResponse.json(
      createApiResponse(null, "비밀번호가 성공적으로 변경되었습니다")
    );
  } catch (error) {
    console.error("Reset password API error:", error);
    return NextResponse.json(
      createApiError("비밀번호 재설정 중 오류가 발생했습니다", 500),
      { status: 500 }
    );
  }
}


