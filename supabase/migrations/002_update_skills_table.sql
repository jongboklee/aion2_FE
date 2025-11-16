-- 스킬 테이블 컬럼 확장

ALTER TABLE skills
  ADD COLUMN IF NOT EXISTS usage_type VARCHAR(20) CHECK (usage_type IN ('액티브', '조건기', '패시브', '스티그마')) DEFAULT '액티브',
  ADD COLUMN IF NOT EXISTS weapon_requirement VARCHAR(100),
  ADD COLUMN IF NOT EXISTS area VARCHAR(50),
  ADD COLUMN IF NOT EXISTS categories TEXT[];

-- 기존 데이터에 기본 사용 타입 설정
UPDATE skills
SET usage_type = COALESCE(usage_type, '액티브');


