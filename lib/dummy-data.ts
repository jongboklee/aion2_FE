import type { Character, Item } from "@/types";

/**
 * 캐릭터 더미 데이터
 */
export const dummyCharacters: Character[] = [
  {
    id: "1",
    name: "글라디에이터",
    class: "전사",
    level: 65,
    stats: {
      hp: 15200,
      mp: 3200,
      attack: 1850,
      defense: 1420,
      accuracy: 890,
      evasion: 650,
    },
  },
  {
    id: "2",
    name: "템플러",
    class: "전사",
    level: 65,
    stats: {
      hp: 14800,
      mp: 3800,
      attack: 1720,
      defense: 1580,
      accuracy: 850,
      evasion: 620,
    },
  },
  {
    id: "3",
    name: "어쌔신",
    class: "도적",
    level: 65,
    stats: {
      hp: 11200,
      mp: 2800,
      attack: 1920,
      defense: 980,
      accuracy: 1120,
      evasion: 1420,
    },
  },
  {
    id: "4",
    name: "레인저",
    class: "도적",
    level: 65,
    stats: {
      hp: 10800,
      mp: 3200,
      attack: 1880,
      defense: 920,
      accuracy: 1180,
      evasion: 1380,
    },
  },
  {
    id: "5",
    name: "소서러",
    class: "마법사",
    level: 65,
    stats: {
      hp: 9800,
      mp: 5200,
      attack: 1980,
      defense: 780,
      accuracy: 1120,
      evasion: 580,
    },
  },
  {
    id: "6",
    name: "스피릿마스터",
    class: "마법사",
    level: 65,
    stats: {
      hp: 10200,
      mp: 4800,
      attack: 1750,
      defense: 850,
      accuracy: 1080,
      evasion: 620,
    },
  },
  {
    id: "7",
    name: "클레릭",
    class: "사제",
    level: 65,
    stats: {
      hp: 10800,
      mp: 4800,
      attack: 1420,
      defense: 1020,
      accuracy: 980,
      evasion: 720,
    },
  },
  {
    id: "8",
    name: "챈터",
    class: "사제",
    level: 65,
    stats: {
      hp: 11200,
      mp: 4200,
      attack: 1580,
      defense: 1180,
      accuracy: 920,
      evasion: 780,
    },
  },
];

/**
 * 아이템 더미 데이터
 */
export const dummyItems: Item[] = [
  {
    id: "1",
    name: "천둥의 검",
    type: "weapon",
    grade: "legendary",
    description: "천둥의 힘을 담은 전설의 검. 높은 공격력을 제공합니다.",
    stats: {
      attack: 285,
      accuracy: 120,
    },
  },
  {
    id: "2",
    name: "용의 가죽 갑옷",
    type: "armor",
    grade: "epic",
    description: "용의 가죽으로 만든 강력한 방어구.",
    stats: {
      defense: 195,
      hp: 850,
    },
  },
  {
    id: "3",
    name: "마력의 목걸이",
    type: "accessory",
    grade: "epic",
    description: "마법 공격력을 크게 향상시키는 액세서리.",
    stats: {
      attack: 95,
      mp: 420,
    },
  },
  {
    id: "4",
    name: "회복 물약",
    type: "consumable",
    grade: "common",
    description: "HP를 500 회복시킵니다.",
    stats: {
      hp: 500,
    },
  },
  {
    id: "5",
    name: "정신력 물약",
    type: "consumable",
    grade: "common",
    description: "MP를 300 회복시킵니다.",
    stats: {
      mp: 300,
    },
  },
  {
    id: "6",
    name: "영웅의 투구",
    type: "armor",
    grade: "legendary",
    description: "전설의 영웅이 착용했던 투구. 강력한 방어력을 제공합니다.",
    stats: {
      defense: 145,
      hp: 650,
      accuracy: 85,
    },
  },
  {
    id: "7",
    name: "마법 지팡이",
    type: "weapon",
    grade: "epic",
    description: "마법사용 지팡이. 마법 공격력이 크게 향상됩니다.",
    stats: {
      attack: 265,
      mp: 380,
    },
  },
  {
    id: "8",
    name: "민첩의 반지",
    type: "accessory",
    grade: "rare",
    description: "민첩성을 향상시키는 반지.",
    stats: {
      evasion: 180,
      accuracy: 95,
    },
  },
  {
    id: "9",
    name: "철광석",
    type: "material",
    grade: "common",
    description: "장비 제작에 사용되는 기본 재료.",
  },
  {
    id: "10",
    name: "정화의 물약",
    type: "consumable",
    grade: "uncommon",
    description: "모든 상태이상을 제거합니다.",
  },
];

/**
 * 가이드 더미 데이터
 */
export const dummyGuides = [
  {
    id: "1",
    title: "초보자 가이드",
    category: "시작하기",
    content: "아이온2를 처음 시작하는 분들을 위한 기본 가이드입니다.",
    thumbnail: "/images/guide-beginner.jpg",
  },
  {
    id: "2",
    title: "직업 선택 가이드",
    category: "캐릭터",
    content: "각 직업의 특징과 추천 직업을 안내합니다.",
    thumbnail: "/images/guide-class.jpg",
  },
  {
    id: "3",
    title: "장비 강화 가이드",
    category: "아이템",
    content: "장비 강화 방법과 최적의 타이밍을 설명합니다.",
    thumbnail: "/images/guide-enhance.jpg",
  },
  {
    id: "4",
    title: "던전 공략 가이드",
    category: "던전",
    content: "주요 던전의 공략 방법과 보상 정보를 제공합니다.",
    thumbnail: "/images/guide-dungeon.jpg",
  },
  {
    id: "5",
    title: "PvP 전투 가이드",
    category: "PvP",
    content: "플레이어 간 전투에서 승리하는 전략을 소개합니다.",
    thumbnail: "/images/guide-pvp.jpg",
  },
];

