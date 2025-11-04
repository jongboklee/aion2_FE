import { NextRequest, NextResponse } from "next/server";
import { createApiResponse, createApiError } from "@/lib/api";
import bcrypt from "bcryptjs";
import { users } from "@/lib/users";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/signup
 * 회원가입 API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // 유효성 검사
    if (!email || !password || !name) {
      return NextResponse.json(
        createApiError("이메일, 비밀번호, 이름을 모두 입력해주세요", 400),
        { status: 400 }
      );
    }

    // 비밀번호 길이 검사
    if (password.length < 8) {
      return NextResponse.json(
        createApiError("비밀번호는 최소 8자 이상이어야 합니다", 400),
        { status: 400 }
      );
    }

    // 이메일 중복 검사
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        createApiError("이미 사용 중인 이메일입니다", 409),
        { status: 409 }
      );
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
    };

    users.push(newUser);

    return NextResponse.json(
      createApiResponse(
        {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
        "회원가입이 완료되었습니다"
      ),
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup API error:", error);
    return NextResponse.json(
      createApiError("회원가입 중 오류가 발생했습니다", 500),
      { status: 500 }
    );
  }
}
