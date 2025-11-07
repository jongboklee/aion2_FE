-- 스킬 테이블 생성 SQL (Supabase SQL Editor에서 실행)

CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  class VARCHAR(50) NOT NULL CHECK (class IN ('검성', '수호성', '살성', '궁성', '마도성', '정령성', '호법성', '치유성')),
  level INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('공격', '방어', '버프', '디버프', '회복', '소환', '이동', '기타', '강화')),
  element VARCHAR(50) CHECK (element IN ('불', '물', '바람', '땅', '신성', '어둠')),
  cooldown INTEGER NOT NULL DEFAULT 0,
  mp_cost INTEGER NOT NULL DEFAULT 0,
  range INTEGER NOT NULL DEFAULT 0,
  cast_time VARCHAR(50) NOT NULL, -- "즉시 시전" 또는 숫자 문자열
  description TEXT NOT NULL,
  groggy_gauge INTEGER,
  max_charge INTEGER,
  tags TEXT[], -- 배열로 저장
  target VARCHAR(255),
  specialization TEXT[], -- 배열로 저장
  effects JSONB, -- JSON 배열로 저장
  icon VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_skills_class ON skills(class);
CREATE INDEX IF NOT EXISTS idx_skills_type ON skills(type);
CREATE INDEX IF NOT EXISTS idx_skills_level ON skills(level);

-- updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_skills_updated_at
  BEFORE UPDATE ON skills
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

