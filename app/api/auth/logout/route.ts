import { NextRequest, NextResponse } from "next/server";
import { createApiResponse, createApiError } from "@/lib/api";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/logout
 * 로그아웃 API
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("auth-token");

    return NextResponse.json(createApiResponse(null, "로그아웃되었습니다"));
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json(
      createApiError("로그아웃 중 오류가 발생했습니다", 500),
      { status: 500 }
    );
  }
}

