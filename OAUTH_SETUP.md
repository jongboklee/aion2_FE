# OAuth 설정 가이드

## 환경 변수 설정

`.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
# NextAuth.js Secret (랜덤 문자열 생성)
NEXTAUTH_SECRET=your-random-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth (선택)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## Google OAuth 설정

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 생성 또는 선택
3. APIs & Services > Credentials 이동
4. "Create Credentials" > "OAuth client ID" 선택
5. Application type: "Web application"
6. Authorized redirect URIs 추가:
   - `http://localhost:3000/api/auth/callback/google` (개발)
   - `https://yourdomain.com/api/auth/callback/google` (프로덕션)
7. Client ID와 Client Secret 복사하여 `.env.local`에 설정

## GitHub OAuth 설정

1. [GitHub Developer Settings](https://github.com/settings/developers) 접속
2. "New OAuth App" 클릭
3. Application name, Homepage URL 입력
4. Authorization callback URL 설정:
   - `http://localhost:3000/api/auth/callback/github` (개발)
   - `https://yourdomain.com/api/auth/callback/github` (프로덕션)
5. Client ID와 Client Secret 복사하여 `.env.local`에 설정

## NEXTAUTH_SECRET 생성

터미널에서 다음 명령어로 랜덤 시크릿 생성:

```bash
openssl rand -base64 32
```

또는 온라인 도구 사용: https://generate-secret.vercel.app/32

