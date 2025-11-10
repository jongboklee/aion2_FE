import { NextRequest, NextResponse } from "next/server";
import { createApiError, createApiResponse } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { dummySkills } from "@/lib/dummy-data";
import { mapDbSkillToSkill, mapSkillPayloadToDb, validateSkillPayload } from "../route";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(createApiError("스킬 ID가 필요합니다.", 400), { status: 400 });
    }

    if (!supabase) {
      const skill = dummySkills.find((item) => item.id === id);
      if (!skill) {
        return NextResponse.json(createApiError("스킬을 찾을 수 없습니다.", 404), { status: 404 });
      }
      return NextResponse.json(createApiResponse(skill));
    }

    const { data, error } = await supabase.from("skills").select("*").eq("id", id).maybeSingle();

    if (error) {
      console.error("Supabase select error:", error);
      throw error;
    }

    if (!data) {
      return NextResponse.json(createApiError("스킬을 찾을 수 없습니다.", 404), { status: 404 });
    }

    return NextResponse.json(createApiResponse(mapDbSkillToSkill(data)));
  } catch (error) {
    console.error("Skills detail GET error:", error);
    return NextResponse.json(
      createApiError("스킬 정보를 불러오는 중 오류가 발생했습니다", 500),
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(createApiError("스킬 ID가 필요합니다.", 400), { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json(createApiError("데이터베이스가 설정되지 않았습니다", 500), { status: 500 });
    }

    const body = await request.json();
    let skillPayload;

    try {
      skillPayload = validateSkillPayload(body);
    } catch (validationError) {
      return NextResponse.json(
        createApiError(validationError instanceof Error ? validationError.message : "잘못된 요청입니다", 400),
        { status: 400 }
      );
    }

    const dbSkill = mapSkillPayloadToDb(skillPayload);

    const { data, error } = await supabase.from("skills").update(dbSkill).eq("id", id).select().maybeSingle();

    if (error) {
      console.error("Supabase update error:", error);
      throw error;
    }

    if (!data) {
      return NextResponse.json(createApiError("스킬을 찾을 수 없습니다.", 404), { status: 404 });
    }

    return NextResponse.json(createApiResponse(mapDbSkillToSkill(data)));
  } catch (error) {
    console.error("Skills detail PUT error:", error);
    return NextResponse.json(
      createApiError("스킬 정보를 수정하는 중 오류가 발생했습니다", 500),
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(createApiError("스킬 ID가 필요합니다.", 400), { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json(createApiError("데이터베이스가 설정되지 않았습니다", 500), { status: 500 });
    }

    const { data, error } = await supabase.from("skills").delete().eq("id", id).select().maybeSingle();

    if (error) {
      console.error("Supabase delete error:", error);
      throw error;
    }

    if (!data) {
      return NextResponse.json(createApiError("스킬을 찾을 수 없습니다.", 404), { status: 404 });
    }

    return NextResponse.json(
      createApiResponse(mapDbSkillToSkill(data), "스킬이 삭제되었습니다.")
    );
  } catch (error) {
    console.error("Skills detail DELETE error:", error);
    return NextResponse.json(
      createApiError("스킬을 삭제하는 중 오류가 발생했습니다", 500),
      { status: 500 }
    );
  }
}


