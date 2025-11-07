import { NextRequest, NextResponse } from "next/server";
import { createApiResponse, createApiError } from "@/lib/api";
import type { Skill } from "@/types";
import { supabase } from "@/lib/supabase";
import { dummySkills } from "@/lib/dummy-data";

export const dynamic = "force-dynamic";

/**
 * DB에서 스킬 데이터를 Skill 타입으로 변환
 */
function mapDbSkillToSkill(dbSkill: any): Skill {
  return {
    id: dbSkill.id,
    name: dbSkill.name,
    class: dbSkill.class,
    level: dbSkill.level,
    type: dbSkill.type,
    element: dbSkill.element || undefined,
    cooldown: dbSkill.cooldown,
    mpCost: dbSkill.mp_cost,
    range: dbSkill.range,
    castTime: dbSkill.cast_time,
    description: dbSkill.description,
    groggyGauge: dbSkill.groggy_gauge || undefined,
    maxCharge: dbSkill.max_charge || undefined,
    tags: dbSkill.tags || undefined,
    target: dbSkill.target || undefined,
    specialization: dbSkill.specialization || undefined,
    effects: dbSkill.effects || undefined,
    icon: dbSkill.icon || undefined,
  };
}

/**
 * GET /api/skills
 * 스킬 목록 조회 API
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const classType = searchParams.get("class");
    const skillType = searchParams.get("type");

    // Supabase가 설정되어 있는지 확인
    if (supabase) {
      // DB에서 데이터 가져오기
      let query = supabase.from("skills").select("*", { count: "exact" });

      // 필터 적용
      if (classType) {
        query = query.eq("class", classType);
      }
      if (skillType) {
        query = query.eq("type", skillType);
      }

      // 페이지네이션
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      // 정렬 (레벨 내림차순, 이름 오름차순)
      query = query.order("level", { ascending: false }).order("name", { ascending: true });

      const { data, error, count } = await query;

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      const skills = (data || []).map(mapDbSkillToSkill);
      const total = count || 0;
      const totalPages = Math.ceil(total / pageSize);

      return NextResponse.json(
        createApiResponse({
          items: skills,
          total,
          page,
          pageSize,
          totalPages,
        })
      );
    } else {
      // 더미 데이터 사용 (DB가 설정되지 않은 경우)
      let filteredSkills = [...dummySkills];

      // 클래스 필터 적용
      if (classType) {
        filteredSkills = filteredSkills.filter(
          (skill) => skill.class === classType
        );
      }

      // 스킬 타입 필터 적용
      if (skillType) {
        filteredSkills = filteredSkills.filter(
          (skill) => skill.type === skillType
        );
      }

      // 페이지네이션
      const total = filteredSkills.length;
      const totalPages = Math.ceil(total / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedSkills = filteredSkills.slice(startIndex, endIndex);

      return NextResponse.json(
        createApiResponse({
          items: paginatedSkills,
          total,
          page,
          pageSize,
          totalPages,
        })
      );
    }
  } catch (error) {
    console.error("Skills API error:", error);
    return NextResponse.json(
      createApiError("스킬 정보를 불러오는 중 오류가 발생했습니다", 500),
      { status: 500 }
    );
  }
}

/**
 * POST /api/skills
 * 스킬 데이터 삽입 API (관리자용)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const skill = body;

    // Supabase가 설정되어 있는지 확인
    if (!supabase) {
      return NextResponse.json(
        createApiError("데이터베이스가 설정되지 않았습니다", 500),
        { status: 500 }
      );
    }

    // DB 형식으로 변환
    const dbSkill = {
      name: skill.name,
      class: skill.class,
      level: skill.level,
      type: skill.type,
      element: skill.element || null,
      cooldown: skill.cooldown,
      mp_cost: skill.mpCost,
      range: skill.range,
      cast_time: typeof skill.castTime === "string" ? skill.castTime : skill.castTime.toString(),
      description: skill.description,
      groggy_gauge: skill.groggyGauge || null,
      max_charge: skill.maxCharge || null,
      tags: skill.tags || null,
      target: skill.target || null,
      specialization: skill.specialization || null,
      effects: skill.effects || null,
      icon: skill.icon || null,
    };

    const { data, error } = await supabase.from("skills").insert(dbSkill).select().single();

    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }

    return NextResponse.json(
      createApiResponse(mapDbSkillToSkill(data)),
      { status: 201 }
    );
  } catch (error) {
    console.error("Skills POST API error:", error);
    return NextResponse.json(
      createApiError("스킬 정보를 저장하는 중 오류가 발생했습니다", 500),
      { status: 500 }
    );
  }
}
