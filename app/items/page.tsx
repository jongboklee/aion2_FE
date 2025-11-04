"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { LoadingSpinner, ErrorMessage, EmptyState } from "@/components/ui/Loading";
import type { Item } from "@/types";
import type { ApiResponse, PaginatedResponse } from "@/lib/api";

const gradeColors = {
  common: "text-gray-600 dark:text-gray-400",
  uncommon: "text-green-600 dark:text-green-400",
  rare: "text-blue-600 dark:text-blue-400",
  epic: "text-purple-600 dark:text-purple-400",
  legendary: "text-orange-600 dark:text-orange-400",
};

const gradeLabels = {
  common: "일반",
  uncommon: "고급",
  rare: "희귀",
  epic: "영웅",
  legendary: "전설",
};

const typeLabels = {
  weapon: "무기",
  armor: "방어구",
  accessory: "장신구",
  consumable: "소모품",
  material: "재료",
};

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");

  const types = ["all", "weapon", "armor", "accessory", "consumable", "material"];
  const grades = ["all", "common", "uncommon", "rare", "epic", "legendary"];

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (selectedType !== "all") {
          params.set("type", selectedType);
        }
        if (selectedGrade !== "all") {
          params.set("grade", selectedGrade);
        }

        const response = await fetch(`/api/items?${params.toString()}`);
        const data: ApiResponse<PaginatedResponse<Item>> = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "아이템 정보를 불러오는데 실패했습니다");
        }

        if (data.data) {
          setItems(data.data.items);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "오류가 발생했습니다");
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [selectedType, selectedGrade]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">아이템 정보</h1>

      {/* 필터 */}
      <div className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            타입
          </label>
          <div className="flex flex-wrap gap-2">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedType === type
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {type === "all" ? "전체" : typeLabels[type as keyof typeof typeLabels]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            등급
          </label>
          <div className="flex flex-wrap gap-2">
            {grades.map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedGrade === grade
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {grade === "all" ? "전체" : gradeLabels[grade as keyof typeof gradeLabels]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 로딩 상태 */}
      {isLoading && <LoadingSpinner size="lg" className="min-h-[400px]" />}

      {/* 에러 상태 */}
      {error && <ErrorMessage message={error} />}

      {/* 아이템 목록 */}
      {!isLoading && !error && (
        <>
          {items.length === 0 ? (
            <EmptyState title="아이템 정보가 없습니다" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <Card key={item.id} hover>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {item.name}
                        </h2>
                        <span className={`text-sm font-medium ${gradeColors[item.grade]}`}>
                          {gradeLabels[item.grade]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {typeLabels[item.type]}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>

                    {item.stats && (
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          스탯
                        </h3>
                        <div className="space-y-1 text-sm">
                          {Object.entries(item.stats).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400 capitalize">
                                {key}
                              </span>
                              <span className="font-medium">+{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
