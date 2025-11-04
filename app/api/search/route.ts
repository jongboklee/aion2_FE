import { NextRequest, NextResponse } from "next/server";
import { createApiResponse, createApiError } from "@/lib/api";
import { dummyCharacters, dummyItems, dummyGuides } from "@/lib/dummy-data";

export const dynamic = "force-dynamic";

interface SearchResult {
  id: string;
  type: "character" | "item" | "guide";
  title: string;
  description: string;
  data: any;
}

/**
 * GET /api/search
 * 통합 검색 API
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "all"; // all, character, item, guide
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");

    if (!query.trim()) {
      return NextResponse.json(
        createApiError("검색어를 입력해주세요", 400),
        { status: 400 }
      );
    }

    const searchLower = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    // 캐릭터 검색
    if (type === "all" || type === "character") {
      const matchedCharacters = dummyCharacters.filter(
        (char) =>
          char.name.toLowerCase().includes(searchLower) ||
          char.class.toLowerCase().includes(searchLower)
      );

      matchedCharacters.forEach((char) => {
        results.push({
          id: `character-${char.id}`,
          type: "character",
          title: char.name,
          description: `${char.class} · Lv.${char.level}`,
          data: char,
        });
      });
    }

    // 아이템 검색
    if (type === "all" || type === "item") {
      const matchedItems = dummyItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.type.toLowerCase().includes(searchLower) ||
          item.grade.toLowerCase().includes(searchLower)
      );

      matchedItems.forEach((item) => {
        results.push({
          id: `item-${item.id}`,
          type: "item",
          title: item.name,
          description: item.description,
          data: item,
        });
      });
    }

    // 가이드 검색
    if (type === "all" || type === "guide") {
      const matchedGuides = dummyGuides.filter(
        (guide) =>
          guide.title.toLowerCase().includes(searchLower) ||
          guide.content.toLowerCase().includes(searchLower) ||
          guide.category.toLowerCase().includes(searchLower)
      );

      matchedGuides.forEach((guide) => {
        results.push({
          id: `guide-${guide.id}`,
          type: "guide",
          title: guide.title,
          description: guide.content,
          data: guide,
        });
      });
    }

    // 페이지네이션
    const total = results.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedResults = results.slice(startIndex, endIndex);

    return NextResponse.json(
      createApiResponse({
        items: paginatedResults,
        total,
        page,
        pageSize,
        totalPages,
      })
    );
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      createApiError("검색 중 오류가 발생했습니다", 500),
      { status: 500 }
    );
  }
}

