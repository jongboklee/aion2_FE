# Supabase DB 데이터 확인 및 편집 가이드

## 📊 DB 데이터 확인하기

### 1. Supabase Dashboard에서 확인 (가장 쉬움)

1. [Supabase Dashboard](https://app.supabase.com/) 접속
2. **Aion2** 프로젝트 선택
3. 왼쪽 메뉴에서 **Table Editor** 클릭
4. `skills` 테이블 클릭
5. 데이터 확인 가능!

**만약 `skills` 테이블이 안 보이면:**
- SQL Editor에서 테이블 생성 SQL을 먼저 실행해야 합니다 (아래 참고)

### 2. 데이터 편집하기

#### Table Editor에서 편집:
1. Table Editor에서 `skills` 테이블 선택
2. 편집할 행(row) 클릭
3. 셀을 클릭하면 수정 가능
4. 수정 후 **Save** 버튼 클릭

#### 새 데이터 추가:
1. Table Editor에서 **Insert row** 버튼 클릭
2. 각 필드 입력
3. **Save** 버튼 클릭

#### 데이터 삭제:
1. 삭제할 행 선택 (체크박스)
2. **Delete** 버튼 클릭
3. 확인

### 3. SQL Editor에서 데이터 확인

```sql
-- 모든 스킬 조회
SELECT * FROM skills ORDER BY class, level;

-- 특정 클래스 스킬만 조회
SELECT * FROM skills WHERE class = '검성';

-- 스킬 개수 확인
SELECT COUNT(*) as total_skills FROM skills;

-- 클래스별 스킬 개수
SELECT class, COUNT(*) as count 
FROM skills 
GROUP BY class 
ORDER BY count DESC;
```

## 🔧 테이블이 없을 때 (처음 설정)

### 1단계: 테이블 생성

1. Supabase Dashboard > **SQL Editor** 클릭
2. **New query** 클릭
3. 아래 SQL 복사해서 붙여넣기:

```sql
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
  cast_time VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  groggy_gauge INTEGER,
  max_charge INTEGER,
  tags TEXT[],
  target VARCHAR(255),
  specialization TEXT[],
  effects JSONB,
  icon VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skills_class ON skills(class);
CREATE INDEX IF NOT EXISTS idx_skills_type ON skills(type);
CREATE INDEX IF NOT EXISTS idx_skills_level ON skills(level);

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
```

4. **Run** 버튼 클릭 (또는 Cmd/Ctrl + Enter)
5. 성공 메시지 확인 후 Table Editor로 이동하면 `skills` 테이블이 보입니다!

### 2단계: 환경 변수 설정

1. Supabase Dashboard > **Settings** (톱니바퀴 아이콘) 클릭
2. **API** 메뉴 클릭
3. **Project URL**과 **anon public** 키 복사
4. 프로젝트 루트에 `.env.local` 파일 생성/수정:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3단계: 데이터 삽입

환경 변수를 설정한 후 터미널에서:

```bash
npm run seed:skills
```

이 명령어는 `lib/dummy-data.ts`에 있는 모든 스킬 데이터를 DB에 삽입합니다.

## 📝 데이터 편집 팁

### Table Editor 사용법:
- **필터링**: 상단 Filter 버튼으로 조건 설정
- **정렬**: 컬럼 헤더 클릭으로 정렬
- **검색**: 상단 검색창에서 검색
- **대량 편집**: 여러 행 선택 후 일괄 수정 가능

### SQL로 편집:

```sql
-- 특정 스킬 수정
UPDATE skills 
SET description = '새로운 설명' 
WHERE name = '스킬명';

-- 특정 스킬 삭제
DELETE FROM skills WHERE id = 'skill-id';

-- 모든 스킬의 레벨 변경
UPDATE skills SET level = 20 WHERE level < 20;
```

## 🔍 현재 DB 상태 확인

Table Editor에서 확인하거나, SQL Editor에서:

```sql
-- 테이블이 존재하는지 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'skills';

-- 데이터 개수 확인
SELECT COUNT(*) FROM skills;

-- 최근 추가된 데이터 확인
SELECT * FROM skills ORDER BY created_at DESC LIMIT 10;
```

## ⚠️ 문제 해결

### Table Editor에 테이블이 안 보일 때:
1. SQL Editor에서 테이블 생성 SQL 실행했는지 확인
2. 브라우저 새로고침 (F5)
3. 다른 프로젝트 선택했다가 다시 Aion2 선택

### 데이터가 안 보일 때:
1. `npm run seed:skills` 실행했는지 확인
2. SQL Editor에서 `SELECT COUNT(*) FROM skills;` 실행해서 개수 확인
3. 환경 변수가 제대로 설정되었는지 확인

### 편집이 안 될 때:
1. RLS(Row Level Security)가 활성화되어 있는지 확인
2. Settings > Database > Policies에서 읽기/쓰기 권한 확인

