"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { LoadingSpinner, ErrorMessage, EmptyState } from "@/components/ui/Loading";
import type { Character } from "@/types";
import type { ApiResponse, PaginatedResponse } from "@/lib/api";

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>("all");

  const classes = ["all", "전사", "도적", "마법사", "사제"];

  useEffect(() => {
    const fetchCharacters = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (selectedClass !== "all") {
          params.set("class", selectedClass);
        }

        const response = await fetch(`/api/characters?${params.toString()}`);
        const data: ApiResponse<PaginatedResponse<Character>> = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "캐릭터 정보를 불러오는데 실패했습니다");
        }

        if (data.data) {
          setCharacters(data.data.items);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "오류가 발생했습니다");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacters();
  }, [selectedClass]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">캐릭터 정보</h1>

      {/* 필터 */}
      <div className="mb-6 flex flex-wrap gap-2">
        {classes.map((classType) => (
          <button
            key={classType}
            onClick={() => setSelectedClass(classType)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedClass === classType
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {classType === "all" ? "전체" : classType}
          </button>
        ))}
      </div>

      {/* 로딩 상태 */}
      {isLoading && <LoadingSpinner size="lg" className="min-h-[400px]" />}

      {/* 에러 상태 */}
      {error && <ErrorMessage message={error} />}

      {/* 캐릭터 목록 */}
      {!isLoading && !error && (
        <>
          {characters.length === 0 ? (
            <EmptyState title="캐릭터 정보가 없습니다" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {characters.map((character) => (
                <Card key={character.id} hover>
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {character.name}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {character.class} · Lv.{character.level}
                      </p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">HP</span>
                        <span className="font-medium">{character.stats.hp.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">MP</span>
                        <span className="font-medium">{character.stats.mp.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">공격력</span>
                        <span className="font-medium">{character.stats.attack.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">방어력</span>
                        <span className="font-medium">{character.stats.defense.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">명중률</span>
                        <span className="font-medium">{character.stats.accuracy.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">회피율</span>
                        <span className="font-medium">{character.stats.evasion.toLocaleString()}</span>
                      </div>
                    </div>
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
