"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import { LoadingSpinner, ErrorMessage, EmptyState } from "@/components/ui/Loading";
import Card from "@/components/ui/Card";
import Link from "next/link";
import type { ApiResponse, PaginatedResponse } from "@/lib/api";

interface SearchResult {
  id: string;
  type: "character" | "item" | "skill" | "guide";
  title: string;
  description: string;
  data: any;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set("q", query);
        params.set("type", "all");

        const response = await fetch(`/api/search?${params.toString()}`);
        const data: ApiResponse<PaginatedResponse<SearchResult>> = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "검색에 실패했습니다");
        }

        if (data.data) {
          setResults(data.data.items);
        } else {
          setResults([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "검색 중 오류가 발생했습니다");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [query]);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "character":
        return "캐릭터";
      case "item":
        return "아이템";
      case "skill":
        return "스킬";
      case "guide":
        return "가이드";
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "character":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
      case "item":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300";
      case "skill":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300";
      case "guide":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
    }
  };

  const getResultLink = (result: SearchResult) => {
    switch (result.type) {
      case "character":
        return "/characters";
      case "item":
        return "/items";
      case "skill":
        return "/skills";
      case "guide":
        return `/guides/${result.data.id}`;
      default:
        return "#";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">검색</h1>

        <div className="mb-8">
          <SearchBar placeholder="캐릭터명, 아이템명 등을 검색하세요..." />
        </div>

        {/* 검색 결과 */}
        {query && (
          <div className="mt-8">
            {isLoading ? (
              <LoadingSpinner size="lg" className="min-h-[400px]" />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : results.length === 0 ? (
              <EmptyState
                title="검색 결과가 없습니다"
                message={`"${query}"에 대한 검색 결과를 찾을 수 없습니다.`}
              />
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">{results.length}</span>개의 결과를 찾았습니다
                </div>

                <div className="space-y-4">
                  {results.map((result) => (
                    <Link key={result.id} href={getResultLink(result)}>
                      <Card hover>
                        <div className="flex items-start gap-4">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded ${getTypeColor(
                              result.type
                            )}`}
                          >
                            {getTypeLabel(result.type)}
                          </span>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                              {result.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {result.description}
                            </p>

                            {/* 캐릭터 정보 추가 표시 */}
                            {result.type === "character" && result.data.stats && (
                              <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <span>HP: {result.data.stats.hp.toLocaleString()}</span>
                                <span>공격력: {result.data.stats.attack.toLocaleString()}</span>
                                <span>방어력: {result.data.stats.defense.toLocaleString()}</span>
                              </div>
                            )}

                            {/* 아이템 정보 추가 표시 */}
                            {result.type === "item" && result.data.grade && (
                              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                <span className="capitalize">{result.data.type}</span>
                                {" · "}
                                <span>{result.data.grade}</span>
                              </div>
                            )}

                            {/* 스킬 정보 추가 표시 */}
                            {result.type === "skill" && result.data.cooldown !== undefined && (
                              <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <span>쿨타임: {result.data.cooldown}초</span>
                                <span>MP: {result.data.mpCost}</span>
                                <span>사거리: {result.data.range}m</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 검색어가 없을 때 */}
        {!query && (
          <div className="mt-8">
            <EmptyState
              title="검색어를 입력하세요"
              message="위 검색창에 검색어를 입력하면 결과가 표시됩니다."
              icon={
                <svg
                  className="w-16 h-16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" className="min-h-screen" />}>
      <SearchContent />
    </Suspense>
  );
}
