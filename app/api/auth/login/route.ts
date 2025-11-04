import { NextRequest, NextResponse } from "next/server";
import { createApiResponse, createApiError } from "@/lib/api";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { users } from "@/lib/users";

export const dynamic = "force-dynamic";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

/**
 * POST /api/auth/login
 * 로그인 API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, rememberMe } = body;

    // 유효성 검사
    if (!email || !password) {
      return NextResponse.json(
        createApiError("이메일과 비밀번호를 입력해주세요", 400),
        { status: 400 }
      );
    }

    // 사용자 찾기
    const user = users.find((u) => u.email === email);
    if (!user) {
      return NextResponse.json(
        createApiError("이메일 또는 비밀번호가 올바르지 않습니다", 401),
        { status: 401 }
      );
    }

    // 비밀번호 확인
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        createApiError("이메일 또는 비밀번호가 올바르지 않습니다", 401),
        { status: 401 }
      );
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: rememberMe ? "30d" : JWT_EXPIRES_IN }
    );

    // 쿠키 설정
    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60, // 30일 또는 7일
      path: "/",
    });

    return NextResponse.json(
      createApiResponse(
        {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        "로그인 성공"
      )
    );
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      createApiError("로그인 중 오류가 발생했습니다", 500),
      { status: 500 }
    );
  }
}

