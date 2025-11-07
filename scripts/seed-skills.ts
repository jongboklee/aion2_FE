import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

// .env.local 파일 로드
config({ path: resolve(process.cwd(), ".env.local") });

import type { Skill } from "@/types";
import { dummySkills } from "@/lib/dummy-data";

/**
 * 스킬 데이터를 Supabase에 삽입하는 스크립트
 * 
 * 사용법:
 * 1. .env.local에 Supabase 환경 변수 설정
 * 2. npm run seed:skills 실행
 */
async function seedSkills() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase가 설정되지 않았습니다. .env.local 파일에 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정하세요.");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log(`Supabase 연결: ${supabaseUrl}`);

  console.log("스킬 데이터 삽입 시작...");

  // 기존 데이터 확인
  const { data: existingSkills } = await supabase.from("skills").select("id").limit(1);
  
  if (existingSkills && existingSkills.length > 0) {
    console.log("이미 스킬 데이터가 존재합니다. 삭제 후 다시 삽입하시겠습니까?");
    console.log("기존 데이터를 삭제하려면: DELETE FROM skills;");
    return;
  }

  // 더미 데이터를 DB 형식으로 변환
  const skillsToInsert = dummySkills.map((skill) => ({
    name: skill.name,
    class: skill.class,
    level: skill.level,
    type: skill.type,
    element: skill.element || null,
    cooldown: Math.round(skill.cooldown), // 정수로 변환
    mp_cost: Math.round(skill.mpCost), // 정수로 변환
    range: Math.round(skill.range), // 정수로 변환 (소수점 값 처리)
    cast_time: typeof skill.castTime === "string" ? skill.castTime : skill.castTime.toString(),
    description: skill.description,
    groggy_gauge: skill.groggyGauge ? Math.round(skill.groggyGauge) : null, // 정수로 변환
    max_charge: skill.maxCharge ? Math.round(skill.maxCharge) : null, // 정수로 변환
    tags: skill.tags || null,
    target: skill.target || null,
    specialization: skill.specialization || null,
    effects: skill.effects || null,
    icon: skill.icon || null,
  }));

  // 배치로 삽입 (Supabase는 한 번에 최대 1000개까지 삽입 가능)
  const batchSize = 100;
  let inserted = 0;

  for (let i = 0; i < skillsToInsert.length; i += batchSize) {
    const batch = skillsToInsert.slice(i, i + batchSize);
    const { data, error } = await supabase.from("skills").insert(batch).select();

    if (error) {
      console.error(`배치 ${i / batchSize + 1} 삽입 실패:`, error);
      throw error;
    }

    inserted += batch.length;
    console.log(`${inserted}/${skillsToInsert.length} 스킬 삽입 완료`);
  }

  console.log(`총 ${inserted}개의 스킬 데이터 삽입 완료!`);
}

// 스크립트로 실행할 경우
if (require.main === module) {
  seedSkills()
    .then(() => {
      console.log("완료!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("에러:", error);
      process.exit(1);
    });
}

export { seedSkills };

