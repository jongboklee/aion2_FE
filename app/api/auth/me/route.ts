import { NextRequest, NextResponse } from "next/server";
import { createApiResponse, createApiError } from "@/lib/api";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

/**
 * GET /api/auth/me
 * 현재 로그인한 사용자 정보 조회 API
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        createApiError("로그인이 필요합니다", 401),
        { status: 401 }
      );
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };

      // TODO: 실제 DB에서 사용자 정보 조회
      // 현재는 토큰에서 정보만 반환
      return NextResponse.json(
        createApiResponse({
          id: decoded.userId,
          email: decoded.email,
        })
      );
    } catch (error) {
      // 토큰이 유효하지 않음
      cookieStore.delete("auth-token");
      return NextResponse.json(
        createApiError("인증 토큰이 유효하지 않습니다", 401),
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Get user API error:", error);
    return NextResponse.json(
      createApiError("사용자 정보를 불러오는 중 오류가 발생했습니다", 500),
      { status: 500 }
    );
  }
}

