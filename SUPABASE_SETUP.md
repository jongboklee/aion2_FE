# Supabase 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com/) 접속 및 회원가입
   - Organization: jongboklee's Org
   - Project name: Aion2
   - Database password: dkdldhs2253
2. 새 프로젝트 생성
3. 프로젝트 설정에서 다음 정보 확인:
   - Project URL
   - API Key (anon/public)

## 2. 환경 변수 설정

`.env.local` 파일에 다음 환경 변수를 추가하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**프로젝트 URL과 API Key 확인 방법:**
1. Supabase Dashboard 접속
2. 왼쪽 메뉴에서 **Settings** (톱니바퀴 아이콘) 클릭
3. **API** 메뉴 클릭
4. **Project URL**과 **anon public** 키 복사

## 3. 데이터베이스 테이블 생성 ⭐ 중요!

**Table Editor에 아무것도 안 보이는 이유:** 아직 테이블을 생성하지 않았기 때문입니다.

### 방법 1: SQL Editor 사용 (추천)

1. Supabase Dashboard 왼쪽 메뉴에서 **SQL Editor** 클릭
2. **New query** 클릭
3. 아래 SQL을 복사해서 붙여넣기
4. **Run** 버튼 클릭 (또는 Cmd/Ctrl + Enter)

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

5. 실행 후 **Table Editor**로 돌아가면 `skills` 테이블이 보입니다!

### 방법 2: Table Editor에서 직접 생성

1. **Table Editor** 클릭
2. **New table** 버튼 클릭
3. Table name: `skills` 입력
4. 각 컬럼 추가 (수동으로 하나씩 추가해야 함 - 비추천)

## 4. 환경 변수 설정 (프로젝트 연결)

`.env.local` 파일을 생성하고 (프로젝트 루트에) 다음 내용 추가:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# 기존 환경 변수들...
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3004
```

**프로젝트 URL과 API Key 확인:**
- Settings > API > Project URL
- Settings > API > anon public 키

## 5. 초기 데이터 삽입

환경 변수를 설정한 후 다음 명령어로 더미 데이터를 DB에 삽입:

```bash
npm run seed:skills
```

또는 Supabase Dashboard > Table Editor에서 직접 데이터를 추가할 수 있습니다.

## 6. 데이터베이스 확인 방법

### 방법 1: Supabase Dashboard (웹 UI) - 가장 쉬움

1. [Supabase Dashboard](https://app.supabase.com/) 접속
2. **Aion2** 프로젝트 선택
3. 왼쪽 메뉴에서 **Table Editor** 클릭
4. `skills` 테이블 선택
5. 데이터 확인, 수정, 삭제 가능

### 방법 2: SQL Editor

1. Supabase Dashboard > **SQL Editor** 클릭
2. 다음 쿼리로 데이터 확인:

```sql
-- 모든 스킬 조회
SELECT * FROM skills;

-- 특정 클래스 스킬 조회
SELECT * FROM skills WHERE class = '검성';

-- 스킬 개수 확인
SELECT COUNT(*) FROM skills;

-- 클래스별 스킬 개수
SELECT class, COUNT(*) as count FROM skills GROUP BY class ORDER BY count DESC;
```

### 방법 3: API로 확인

브라우저나 터미널에서 API 호출:

```bash
# 모든 스킬 조회
curl http://localhost:3004/api/skills

# 검성 스킬만 조회
curl http://localhost:3004/api/skills?class=검성

# 공격 타입 스킬만 조회
curl http://localhost:3004/api/skills?type=공격
```

또는 브라우저에서 직접 접속:
- `http://localhost:3004/api/skills`
- `http://localhost:3004/api/skills?class=검성&type=공격`

## 7. API 동작 방식

- **Supabase 환경 변수가 설정되어 있으면**: DB에서 데이터를 가져옵니다
- **Supabase 환경 변수가 없으면**: 더미 데이터를 사용합니다 (개발 중)

## 8. RLS (Row Level Security) 설정 (선택)

공개 데이터이므로 RLS를 활성화하지 않아도 되지만, 필요시 다음 정책을 추가할 수 있습니다:

```sql
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능
CREATE POLICY "Anyone can read skills" ON skills
  FOR SELECT USING (true);
```

## 9. 데이터 관리 팁

### 데이터 수정
- Supabase Dashboard > Table Editor에서 직접 수정 가능
- 또는 SQL Editor에서 UPDATE 쿼리 사용

### 데이터 삭제
```sql
-- 모든 데이터 삭제
DELETE FROM skills;

-- 특정 스킬 삭제
DELETE FROM skills WHERE id = 'skill-id';
```

### 데이터 백업
Supabase Dashboard > Settings > Database > Backups에서 백업 설정 가능

## 10. 문제 해결

### Table Editor에 아무것도 안 보일 때
- SQL Editor에서 테이블 생성 SQL을 실행했는지 확인
- 브라우저 새로고침
- 다른 프로젝트를 선택했다가 다시 Aion2 프로젝트 선택

### API가 더미 데이터를 반환할 때
- `.env.local` 파일에 환경 변수가 제대로 설정되었는지 확인
- 개발 서버 재시작 (`npm run dev`)
- 환경 변수 이름 확인: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
