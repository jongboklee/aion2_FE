"use client";

import { FormEvent, useEffect, useState } from "react";
import type { CharacterClass, Skill, SkillType } from "@/types";
import Button from "@/components/ui/Button";

type SkillFormValue = Omit<Skill, "id"> & { id?: string };

interface SkillFormProps {
  mode: "create" | "edit";
  initialValue?: Skill;
  onSubmit: (skill: SkillFormValue) => Promise<void> | void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const classes: CharacterClass[] = ["검성", "수호성", "살성", "궁성", "마도성", "정령성", "호법성", "치유성"];
const skillTypes: SkillType[] = ["공격", "방어", "버프", "디버프", "회복", "소환", "이동", "기타", "강화"];
const elements = ["", "불", "물", "바람", "땅", "신성", "어둠"] as const;

interface FormState {
  name: string;
  class: CharacterClass;
  level: string;
  type: SkillType;
  element: string;
  cooldown: string;
  mpCost: string;
  range: string;
  castTime: string;
  description: string;
  groggyGauge: string;
  maxCharge: string;
  tags: string;
  target: string;
  specialization: string;
  effects: string;
  icon: string;
}

function splitToArray(value: string) {
  const items = value
    .split(/[\r\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
  return items.length > 0 ? items : undefined;
}

function parseNumber(value: string, field: string, required = false) {
  if (value === "" || value === null || value === undefined) {
    if (required) {
      throw new Error(`${field} 값은 필수입니다.`);
    }
    return undefined;
  }

  const num = Number(value);
  if (Number.isNaN(num)) {
    throw new Error(`${field} 값이 올바른 숫자가 아닙니다.`);
  }
  return num;
}

function parseCastTime(value: string) {
  if (!value || value.trim().length === 0) {
    throw new Error("시전 시간 값은 필수입니다.");
  }

  const numeric = Number(value);
  if (!Number.isNaN(numeric)) {
    return numeric;
  }
  return value.trim();
}

function parseEffects(value: string) {
  if (!value || value.trim().length === 0) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(value);
    return parsed;
  } catch (error) {
    throw new Error("효과(JSON) 필드의 형식이 올바르지 않습니다.");
  }
}

export default function SkillForm({ mode, initialValue, onSubmit, onCancel, isSubmitting = false }: SkillFormProps) {
  const [form, setForm] = useState<FormState>({
    name: "",
    class: classes[0],
    level: "1",
    type: skillTypes[0],
    element: "",
    cooldown: "0",
    mpCost: "0",
    range: "0",
    castTime: "즉시 시전",
    description: "",
    groggyGauge: "",
    maxCharge: "",
    tags: "",
    target: "",
    specialization: "",
    effects: "",
    icon: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialValue) {
      setForm({
        name: initialValue.name ?? "",
        class: initialValue.class,
        level: initialValue.level?.toString() ?? "1",
        type: initialValue.type,
        element: initialValue.element ?? "",
        cooldown: initialValue.cooldown?.toString() ?? "0",
        mpCost: initialValue.mpCost?.toString() ?? "0",
        range: initialValue.range?.toString() ?? "0",
        castTime: typeof initialValue.castTime === "string" ? initialValue.castTime : initialValue.castTime?.toString() ?? "즉시 시전",
        description: initialValue.description ?? "",
        groggyGauge: initialValue.groggyGauge !== undefined ? initialValue.groggyGauge.toString() : "",
        maxCharge: initialValue.maxCharge !== undefined ? initialValue.maxCharge.toString() : "",
        tags: initialValue.tags ? initialValue.tags.join(", ") : "",
        target: initialValue.target ?? "",
        specialization: initialValue.specialization ? initialValue.specialization.join("\n") : "",
        effects: initialValue.effects ? JSON.stringify(initialValue.effects, null, 2) : "",
        icon: initialValue.icon ?? "",
      });
    } else {
      setForm((prev) => ({
        ...prev,
        name: "",
        level: "1",
        cooldown: "0",
        mpCost: "0",
        range: "0",
        castTime: "즉시 시전",
        description: "",
        groggyGauge: "",
        maxCharge: "",
        tags: "",
        target: "",
        specialization: "",
        effects: "",
        icon: "",
      }));
    }
  }, [initialValue]);

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { value } = event.target;
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      const payload: SkillFormValue = {
        id: initialValue?.id,
        name: form.name.trim(),
        class: form.class,
        level: parseNumber(form.level, "레벨", true) ?? 0,
        type: form.type,
        element: form.element ? (form.element as SkillFormValue["element"]) : undefined,
        cooldown: parseNumber(form.cooldown, "쿨타임", true) ?? 0,
        mpCost: parseNumber(form.mpCost, "정신력 소모", true) ?? 0,
        range: parseNumber(form.range, "사거리", true) ?? 0,
        castTime: parseCastTime(form.castTime),
        description: form.description.trim(),
        groggyGauge: parseNumber(form.groggyGauge, "그로기 게이지") ?? undefined,
        maxCharge: parseNumber(form.maxCharge, "최대 차지") ?? undefined,
        tags: splitToArray(form.tags),
        target: form.target.trim() || undefined,
        specialization: splitToArray(form.specialization),
        effects: parseEffects(form.effects),
        icon: form.icon.trim() || undefined,
      };

      await onSubmit(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "폼 데이터를 처리하는 중 오류가 발생했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">스킬 이름 *</label>
          <input
            type="text"
            value={form.name}
            onChange={handleChange("name")}
            required
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">클래스 *</label>
          <select
            value={form.class}
            onChange={handleChange("class")}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {classes.map((classType) => (
              <option key={classType} value={classType}>
                {classType}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">레벨 *</label>
          <input
            type="number"
            value={form.level}
            onChange={handleChange("level")}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={1}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">스킬 성격 *</label>
          <select
            value={form.type}
            onChange={handleChange("type")}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {skillTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">속성</label>
          <select
            value={form.element}
            onChange={handleChange("element")}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {elements.map((element) => (
              <option key={element} value={element}>
                {element === "" ? "없음" : element}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">쿨타임(초) *</label>
          <input
            type="number"
            value={form.cooldown}
            onChange={handleChange("cooldown")}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={0}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">정신력 소모 *</label>
          <input
            type="number"
            value={form.mpCost}
            onChange={handleChange("mpCost")}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={0}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">사거리(미터) *</label>
          <input
            type="number"
            value={form.range}
            onChange={handleChange("range")}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={0}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">시전 시간 *</label>
          <input
            type="text"
            value={form.castTime}
            onChange={handleChange("castTime")}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="예: 즉시 시전 또는 0.5"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">그로기 게이지</label>
          <input
            type="number"
            value={form.groggyGauge}
            onChange={handleChange("groggyGauge")}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={0}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">최대 차지 단계</label>
          <input
            type="number"
            value={form.maxCharge}
            onChange={handleChange("maxCharge")}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={0}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">대상</label>
          <input
            type="text"
            value={form.target}
            onChange={handleChange("target")}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="예: 단일 대상(적대)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">아이콘 URL</label>
          <input
            type="text"
            value={form.icon}
            onChange={handleChange("icon")}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="예: /images/skills/skill-icon.png"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">설명 *</label>
        <textarea
          value={form.description}
          onChange={handleChange("description")}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          태그 (쉼표 또는 줄바꿈으로 구분)
        </label>
        <textarea
          value={form.tags}
          onChange={handleChange("tags")}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={2}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          특화 정보 (줄바꿈으로 구분)
        </label>
        <textarea
          value={form.specialization}
          onChange={handleChange("specialization")}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          효과(JSON 형식)
        </label>
        <textarea
          value={form.effects}
          onChange={handleChange("effects")}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder='예: [{"type":"지속 피해","value":100,"description":"5초간 100 피해"}]'
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          JSON 배열 형식으로 입력하세요. 비워 두면 저장되지 않습니다.
        </p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {mode === "create" ? "스킬 등록" : "스킬 수정"}
        </Button>
        {mode === "edit" && onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            취소
          </Button>
        )}
      </div>
    </form>
  );
}


