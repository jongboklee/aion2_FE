# 내 Supabase 프로젝트에 데이터 넣기 (단계별 가이드)

## 🎯 핵심 이해

- **제가 만든 더미 데이터**: 로컬 코드(`lib/dummy-data.ts`)에만 있음
- **여러분의 Supabase 프로젝트**: 비어있음 (테이블도 없고 데이터도 없음)
- **연결 방법**: 여러분이 직접 환경 변수를 설정하고 스크립트를 실행해야 함

## 📋 단계별 가이드

### 1단계: Supabase에서 테이블 생성

1. [Supabase Dashboard](https://app.supabase.com/) 접속
2. **Aion2** 프로젝트 선택
3. 왼쪽 메뉴에서 **SQL Editor** 클릭
4. **New query** 클릭
5. 아래 SQL을 **복사해서 붙여넣기**:

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

6. **Run** 버튼 클릭 (또는 Cmd/Ctrl + Enter)
7. 성공 메시지 확인 ✅

### 2단계: Supabase에서 프로젝트 정보 가져오기

1. Supabase Dashboard에서 **Settings** (톱니바퀴 아이콘) 클릭
2. **API** 메뉴 클릭
3. 다음 두 가지 정보를 복사:
   - **Project URL** (예: `https://xxxxx.supabase.co`)
   - **anon public** 키 (긴 문자열)

### 3단계: 프로젝트에 환경 변수 설정

1. 프로젝트 루트 폴더에 `.env.local` 파일 생성 (없으면 생성)
2. 다음 내용을 붙여넣기 (여러분의 실제 값으로 교체):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**예시:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4단계: 더미 데이터를 DB에 넣기

터미널에서 다음 명령어 실행:

```bash
npm run seed:skills
```

이 명령어는:
- `lib/dummy-data.ts`에 있는 모든 스킬 데이터를 읽어서
- 여러분의 Supabase 프로젝트에 삽입합니다

### 5단계: 데이터 확인

1. Supabase Dashboard에서 **Table Editor** 클릭
2. `skills` 테이블 클릭
3. 데이터 확인! 🎉

## 🔍 확인 방법

### Table Editor에서 확인:
- Supabase Dashboard > Table Editor > skills 테이블

### SQL Editor에서 확인:
```sql
SELECT COUNT(*) FROM skills;
SELECT * FROM skills LIMIT 10;
```

### 웹사이트에서 확인:
- `http://localhost:3003/skills` 페이지 접속
- 스킬 목록이 보이면 성공!

## ⚠️ 문제 해결

### "Supabase가 설정되지 않았습니다" 에러:
- `.env.local` 파일이 제대로 생성되었는지 확인
- 환경 변수 이름이 정확한지 확인 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- 개발 서버 재시작 (`npm run dev`)

### "relation 'skills' does not exist" 에러:
- 1단계(테이블 생성)를 다시 확인
- SQL Editor에서 `SELECT * FROM skills;` 실행해서 테이블 존재 확인

### 데이터가 안 보일 때:
- `npm run seed:skills` 실행했는지 확인
- Supabase Dashboard > Table Editor에서 직접 확인
- SQL Editor에서 `SELECT COUNT(*) FROM skills;` 실행

## 📝 요약

1. ✅ Supabase SQL Editor에서 테이블 생성 SQL 실행
2. ✅ Supabase Settings에서 Project URL과 API Key 복사
3. ✅ 프로젝트에 `.env.local` 파일 생성하고 환경 변수 설정
4. ✅ `npm run seed:skills` 실행
5. ✅ Table Editor에서 데이터 확인

**이제 여러분의 Supabase 프로젝트에 제가 만든 더미 데이터가 들어갑니다!**

