"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { LoadingSpinner, ErrorMessage, EmptyState } from "@/components/ui/Loading";
import Link from "next/link";
import { dummyGuides } from "@/lib/dummy-data";

interface Guide {
  id: string;
  title: string;
  category: string;
  content: string;
  thumbnail?: string;
}

export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", "시작하기", "캐릭터", "아이템", "던전", "PvP"];

  useEffect(() => {
    // 더미 데이터 사용 (실제로는 API 호출)
    setIsLoading(true);
    setTimeout(() => {
      try {
        let filteredGuides = [...dummyGuides];

        if (selectedCategory !== "all") {
          filteredGuides = filteredGuides.filter(
            (guide) => guide.category === selectedCategory
          );
        }

        setGuides(filteredGuides);
      } catch (err) {
        setError("가이드를 불러오는데 실패했습니다");
      } finally {
        setIsLoading(false);
      }
    }, 300);
  }, [selectedCategory]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">가이드</h1>

      {/* 필터 */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === category
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {category === "all" ? "전체" : category}
          </button>
        ))}
      </div>

      {/* 로딩 상태 */}
      {isLoading && <LoadingSpinner size="lg" className="min-h-[400px]" />}

      {/* 에러 상태 */}
      {error && <ErrorMessage message={error} />}

      {/* 가이드 목록 */}
      {!isLoading && !error && (
        <>
          {guides.length === 0 ? (
            <EmptyState title="가이드가 없습니다" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((guide) => (
                <Link key={guide.id} href={`/guides/${guide.id}`}>
                  <Card hover>
                    <div className="space-y-4">
                      {guide.thumbnail && (
                        <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-sm">이미지</span>
                        </div>
                      )}
                      <div>
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded mb-2">
                          {guide.category}
                        </span>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {guide.title}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {guide.content}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
