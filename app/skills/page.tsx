"use client";

import { useEffect, useState } from "react";
import { createMetadata } from "@/lib/metadata";
import Card from "@/components/ui/Card";
import { LoadingSpinner, ErrorMessage, EmptyState } from "@/components/ui/Loading";
import type { Skill, CharacterClass } from "@/types";
import type { ApiResponse, PaginatedResponse } from "@/lib/api";

const skillTypeColors: Record<string, string> = {
  공격: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
  방어: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
  버프: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
  디버프: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300",
  회복: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
  소환: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300",
  이동: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300",
  기타: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300",
  강화: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300",
};

const classes: CharacterClass[] = ["검성", "수호성", "살성", "궁성", "마도성", "정령성", "호법성", "치유성"];
const skillTypes = ["공격", "방어", "버프", "디버프", "회복", "소환", "이동", "기타", "강화"];

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  useEffect(() => {
    const fetchSkills = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (selectedClass !== "all") {
          params.set("class", selectedClass);
        }
        if (selectedType !== "all") {
          params.set("type", selectedType);
        }

        const response = await fetch(`/api/skills?${params.toString()}`);
        const data: ApiResponse<PaginatedResponse<Skill>> = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "스킬 정보를 불러오는데 실패했습니다");
        }

        if (data.data) {
          setSkills(data.data.items);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "오류가 발생했습니다");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkills();
  }, [selectedClass, selectedType]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">스킬 정보</h1>

      {/* 필터 */}
      <div className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            클래스
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedClass("all")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedClass === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              전체
            </button>
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
                {classType}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            스킬 타입
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedType("all")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedType === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              전체
            </button>
            {skillTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedType === type
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 로딩 상태 */}
      {isLoading && <LoadingSpinner size="lg" className="min-h-[400px]" />}

      {/* 에러 상태 */}
      {error && <ErrorMessage message={error} />}

      {/* 스킬 목록 */}
      {!isLoading && !error && (
        <>
          {skills.length === 0 ? (
            <EmptyState title="스킬 정보가 없습니다" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill) => (
                <Card key={skill.id} hover>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {skill.name}
                        </h2>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${skillTypeColors[skill.type]}`}>
                          {skill.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {skill.class} · Lv.{skill.level}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {skill.description}
                      </p>
                    </div>

                    {/* 스킬 상세 정보 */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">쿨타임</span>
                          <span className="ml-2 font-medium">
                            {skill.cooldown === 0 ? "없음" : `${skill.cooldown}초`}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">정신력 소모</span>
                          <span className="ml-2 font-medium">
                            {skill.mpCost === 0 ? "없음" : skill.mpCost}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">사거리</span>
                          <span className="ml-2 font-medium">{skill.range}m</span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">시전 시간</span>
                          <span className="ml-2 font-medium">
                            {typeof skill.castTime === "string" ? skill.castTime : `${skill.castTime}초`}
                          </span>
                        </div>
                        {skill.groggyGauge !== undefined && (
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">그로기 게이지</span>
                            <span className="ml-2 font-medium">{skill.groggyGauge}</span>
                          </div>
                        )}
                        {skill.element && (
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">속성</span>
                            <span className="ml-2 font-medium">{skill.element}</span>
                          </div>
                        )}
                      </div>
                      
                      {skill.target && (
                        <div className="pt-2">
                          <span className="text-gray-600 dark:text-gray-400">대상: </span>
                          <span className="font-medium">{skill.target}</span>
                        </div>
                      )}
                      
                      {skill.tags && skill.tags.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-1">
                          {skill.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* 특화 정보 */}
                      {skill.specialization && skill.specialization.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            특화
                          </h3>
                          <div className="space-y-1">
                            {skill.specialization.map((spec, index) => (
                              <div key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1">
                                <span className="text-green-500 dark:text-green-400 mt-0.5">•</span>
                                <span>{spec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 스킬 효과 */}
                      {skill.effects && skill.effects.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            효과
                          </h3>
                          <div className="space-y-1">
                            {skill.effects.map((effect, index) => (
                              <div key={index} className="text-xs text-gray-600 dark:text-gray-400">
                                <span className="font-medium">{effect.type}:</span> {effect.description}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
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
