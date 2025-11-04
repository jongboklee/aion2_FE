import { NextRequest, NextResponse } from "next/server";
import { createApiResponse, createApiError } from "@/lib/api";
import type { Item } from "@/types";
import { dummyItems } from "@/lib/dummy-data";

export const dynamic = "force-dynamic";

/**
 * GET /api/items
 * 아이템 목록 조회 API
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const type = searchParams.get("type");
    const grade = searchParams.get("grade");

    let filteredItems = [...dummyItems];

    // 타입 필터 적용
    if (type) {
      filteredItems = filteredItems.filter((item) => item.type === type);
    }

    // 등급 필터 적용
    if (grade) {
      filteredItems = filteredItems.filter((item) => item.grade === grade);
    }

    // 페이지네이션
    const total = filteredItems.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    return NextResponse.json(
      createApiResponse({
        items: paginatedItems,
        total,
        page,
        pageSize,
        totalPages,
      })
    );
  } catch (error) {
    console.error("Items API error:", error);
    return NextResponse.json(
      createApiError("아이템 정보를 불러오는 중 오류가 발생했습니다", 500),
      { status: 500 }
    );
  }
}

