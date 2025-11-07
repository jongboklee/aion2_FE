# Vercel 배포 가이드

## 🚀 배포 방법

### 방법 1: Vercel CLI 사용 (추천)

1. **Vercel CLI 설치**
```bash
npm i -g vercel
```

2. **Vercel 로그인**
```bash
vercel login
```

3. **프로젝트 배포**
```bash
vercel
```

4. **프로덕션 배포**
```bash
vercel --prod
```

### 방법 2: GitHub 연동 (자동 배포)

1. **GitHub에 코드 푸시**
   - Git 저장소에 코드 커밋 및 푸시

2. **Vercel 웹사이트에서 배포**
   - [Vercel](https://vercel.com) 접속
   - "Add New Project" 클릭
   - GitHub 저장소 선택
   - 프로젝트 설정 후 "Deploy" 클릭

## 🔐 환경 변수 설정

Vercel Dashboard에서 다음 환경 변수를 설정해야 합니다:

### 필수 환경 변수

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://kbydyilmrbqdbbamboos.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtieWR5aWxtcmJxZGJiYW1ib29zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0ODk1NzEsImV4cCI6MjA3ODA2NTU3MX0.9mxBNuZpnWW4x_63-Uamj5pjZtT9AXHW_XT0tEevgwk

# NextAuth 설정
NEXTAUTH_SECRET=your-secret-key-change-in-production
NEXTAUTH_URL=https://your-project.vercel.app
```

### 선택적 환경 변수 (OAuth 사용 시)

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Naver OAuth
NAVER_CLIENT_ID=your-naver-client-id
NAVER_CLIENT_SECRET=your-naver-client-secret

# Discord OAuth
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
```

## 📝 환경 변수 설정 방법

### Vercel Dashboard에서 설정:

1. Vercel Dashboard 접속
2. 프로젝트 선택
3. **Settings** > **Environment Variables** 클릭
4. 각 환경 변수 추가:
   - **Key**: 환경 변수 이름 (예: `NEXT_PUBLIC_SUPABASE_URL`)
   - **Value**: 값 입력
   - **Environment**: Production, Preview, Development 선택
5. **Save** 클릭

### Vercel CLI로 설정:

```bash
# 환경 변수 추가
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production

# 환경 변수 확인
vercel env ls
```

## ⚠️ 중요 사항

### 1. NEXTAUTH_URL 설정
- 프로덕션 URL로 변경 필요
- 예: `https://aion2-fe.vercel.app`
- 배포 후 Vercel에서 제공하는 URL 사용

### 2. OAuth Redirect URI 업데이트
OAuth를 사용하는 경우, 각 OAuth 제공자 설정에서 Redirect URI를 업데이트해야 합니다:

**Google OAuth:**
- `https://your-project.vercel.app/api/auth/callback/google`

**GitHub OAuth:**
- `https://your-project.vercel.app/api/auth/callback/github`

**Naver OAuth:**
- `https://your-project.vercel.app/api/auth/callback/naver`

**Discord OAuth:**
- `https://your-project.vercel.app/api/auth/callback/discord`

### 3. NEXTAUTH_SECRET 생성
프로덕션용 시크릿 키 생성:

```bash
openssl rand -base64 32
```

또는 온라인 도구 사용: https://generate-secret.vercel.app/32

## 🔄 배포 후 확인

1. **빌드 로그 확인**
   - Vercel Dashboard > Deployments > 최신 배포 클릭
   - Build Logs 확인

2. **사이트 접속**
   - 배포 완료 후 제공되는 URL로 접속
   - 예: `https://aion2-fe.vercel.app`

3. **기능 테스트**
   - 스킬 페이지: `/skills`
   - 검색 기능
   - 로그인/회원가입 (OAuth 설정 시)

## 🐛 문제 해결

### 빌드 실패 시
- 환경 변수가 제대로 설정되었는지 확인
- 빌드 로그에서 에러 메시지 확인
- 로컬에서 `npm run build` 실행하여 확인

### 환경 변수 관련 에러
- `NEXT_PUBLIC_` 접두사가 있는 변수는 클라이언트에서 접근 가능
- 서버 전용 변수는 `NEXT_PUBLIC_` 없이 설정

### OAuth 에러
- Redirect URI가 정확히 설정되었는지 확인
- 환경 변수가 올바르게 설정되었는지 확인

## 📚 참고 자료

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [NextAuth.js 배포 가이드](https://next-auth.js.org/configuration/options#nextauth_url)

