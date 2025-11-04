import { NextRequest, NextResponse } from "next/server";
import { createApiResponse, createApiError } from "@/lib/api";
import type { Character } from "@/types";
import { dummyCharacters } from "@/lib/dummy-data";

export const dynamic = "force-dynamic";

/**
 * GET /api/characters
 * 캐릭터 목록 조회 API
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const classType = searchParams.get("class");

    let filteredCharacters = [...dummyCharacters];

    // 직업 필터 적용
    if (classType) {
      filteredCharacters = filteredCharacters.filter(
        (char) => char.class === classType
      );
    }

    // 페이지네이션
    const total = filteredCharacters.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCharacters = filteredCharacters.slice(startIndex, endIndex);

    return NextResponse.json(
      createApiResponse({
        items: paginatedCharacters,
        total,
        page,
        pageSize,
        totalPages,
      })
    );
  } catch (error) {
    console.error("Characters API error:", error);
    return NextResponse.json(
      createApiError("캐릭터 정보를 불러오는 중 오류가 발생했습니다", 500),
      { status: 500 }
    );
  }
}

