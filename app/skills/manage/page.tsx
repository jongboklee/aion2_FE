"use client";

import { useEffect, useMemo, useState } from "react";
import type { Skill, CharacterClass } from "@/types";
import SkillForm from "@/components/skills/SkillForm";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { LoadingSpinner, ErrorMessage, EmptyState } from "@/components/ui/Loading";
import type { ApiResponse, PaginatedResponse } from "@/lib/api";

const classes: CharacterClass[] = ["검성", "수호성", "살성", "궁성", "마도성", "정령성", "호법성", "치유성"];

export default function ManageSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [operationError, setOperationError] = useState<string | null>(null);

  const loadSkills = async () => {
    setIsLoading(true);
    setFetchError(null);

    try {
      const params = new URLSearchParams({ pageSize: "100" });
      if (selectedClassFilter !== "all") {
        params.set("class", selectedClassFilter);
      }
      const response = await fetch(`/api/skills?${params.toString()}`, { cache: "no-store" });
      const data: ApiResponse<PaginatedResponse<Skill>> = await response.json();

      if (!response.ok || !data.success || !data.data) {
        throw new Error(data.error || "스킬 정보를 불러오는데 실패했습니다.");
      }

      setSkills(data.data.items);
    } catch (error) {
      setFetchError(error instanceof Error ? error.message : "스킬 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClassFilter]);

  const handleCreateOrUpdate = async (payload: Omit<Skill, "id"> & { id?: string }) => {
    setIsSubmitting(true);
    setOperationError(null);
    setInfoMessage(null);

    try {
      const isEdit = Boolean(selectedSkill && payload.id);
      const endpoint = isEdit ? `/api/skills/${payload.id}` : "/api/skills";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data: ApiResponse<Skill> = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "스킬 저장에 실패했습니다.");
      }

      await loadSkills();
      setSelectedSkill(null);
      setInfoMessage(isEdit ? "스킬이 성공적으로 수정되었습니다." : "스킬이 성공적으로 등록되었습니다.");
    } catch (error) {
      setOperationError(error instanceof Error ? error.message : "스킬 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (skill: Skill) => {
    const confirmed = typeof window !== "undefined" ? window.confirm(`"${skill.name}" 스킬을 삭제하시겠습니까?`) : false;
    if (!confirmed) {
      return;
    }

    setIsSubmitting(true);
    setOperationError(null);
    setInfoMessage(null);

    try {
      const response = await fetch(`/api/skills/${skill.id}`, {
        method: "DELETE",
      });

      const data: ApiResponse<Skill> = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "스킬 삭제에 실패했습니다.");
      }

      await loadSkills();
      if (selectedSkill?.id === skill.id) {
        setSelectedSkill(null);
      }

      setInfoMessage("스킬이 삭제되었습니다.");
    } catch (error) {
      setOperationError(error instanceof Error ? error.message : "스킬 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedSkill(null);
    setOperationError(null);
    setInfoMessage(null);
  };

  const listTitle = useMemo(() => {
    if (selectedClassFilter === "all") {
      return "전체 스킬 목록";
    }
    return `${selectedClassFilter} 스킬 목록`;
  }, [selectedClassFilter]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">스킬 관리</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Supabase에 저장된 스킬 데이터를 등록하고 수정하거나 삭제할 수 있습니다.
          </p>
        </div>
        <Button variant="outline" onClick={resetForm}>
          새 스킬 등록
        </Button>
      </div>

      {infoMessage && (
        <div className="rounded-lg border border-green-400 bg-green-50 dark:bg-green-900/20 px-4 py-3 text-sm text-green-700 dark:text-green-300">
          {infoMessage}
        </div>
      )}

      {operationError && <ErrorMessage message={operationError} />}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{selectedSkill ? "스킬 수정" : "새 스킬 등록"}</h2>
            <SkillForm
              mode={selectedSkill ? "edit" : "create"}
              initialValue={selectedSkill ?? undefined}
              onSubmit={handleCreateOrUpdate}
              onCancel={resetForm}
              isSubmitting={isSubmitting}
            />
          </div>
        </Card>

        <Card>
          <div className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold">{listTitle}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  목록에서 항목을 선택하면 수정할 수 있습니다.
                </p>
              </div>
              <div>
                <label className="sr-only" htmlFor="class-filter">
                  클래스 필터
                </label>
                <select
                  id="class-filter"
                  value={selectedClassFilter}
                  onChange={(event) => setSelectedClassFilter(event.target.value)}
                  className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">전체</option>
                  {classes.map((classType) => (
                    <option key={classType} value={classType}>
                      {classType}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {fetchError && <ErrorMessage message={fetchError} />}

            {isLoading ? (
              <LoadingSpinner size="md" className="min-h-[200px]" />
            ) : skills.length === 0 ? (
              <EmptyState title="등록된 스킬이 없습니다." description="새 스킬을 등록해 주세요." />
            ) : (
              <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className={`flex flex-col gap-3 rounded-lg border p-4 transition hover:border-blue-500 dark:border-gray-700 ${
                      selectedSkill?.id === skill.id ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{skill.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {skill.class} · {skill.usageType} · {skill.type} · Lv.{skill.level}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedSkill(skill);
                            setInfoMessage(null);
                            setOperationError(null);
                          }}
                        >
                          수정
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(skill)}
                          disabled={isSubmitting}
                        >
                          삭제
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">{skill.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}


