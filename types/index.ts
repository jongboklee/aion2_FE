// 공통 타입 정의

export interface Character {
  id: string;
  name: string;
  class: string;
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

