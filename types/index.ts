// 공통 타입 정의

export type CharacterClass = "검성" | "수호성" | "살성" | "궁성" | "마도성" | "정령성" | "호법성" | "치유성";

export interface Character {
  id: string;
  name: string;
  class: CharacterClass;
  level: number;
  stats: CharacterStats;
}

export interface CharacterStats {
  hp: number;
  mp: number;
  attack: number;
  defense: number;
  accuracy: number;
  evasion: number;
}

export interface Skill {
  id: string;
  name: string;
  class: CharacterClass;
  level: number;
  type: SkillType;
  element?: SkillElement;
  cooldown: number;
  mpCost: number;
  range: number;
  castTime: number | string; // "즉시 시전" 또는 숫자
  description: string;
  groggyGauge?: number;
  maxCharge?: number;
  tags?: string[]; // "이동 가능", "논타겟", "차지 스킬" 등
  target?: string; // "단일 대상(적대)", "시전자 주변 4인(적대)" 등
  specialization?: string[]; // 특화 설명
  effects?: SkillEffect[];
  icon?: string;
}

export type SkillType = "공격" | "방어" | "버프" | "디버프" | "회복" | "소환" | "이동" | "기타" | "강화";
export type SkillElement = "불" | "물" | "바람" | "땅" | "신성" | "어둠";

export interface SkillEffect {
  type: string;
  value: number;
  duration?: number;
  description: string;
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  grade: ItemGrade;
  description: string;
  stats?: ItemStats;
}

export type ItemType = "weapon" | "armor" | "accessory" | "consumable" | "material";

export type ItemGrade = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface ItemStats {
  attack?: number;
  defense?: number;
  hp?: number;
  mp?: number;
  [key: string]: number | undefined;
}

