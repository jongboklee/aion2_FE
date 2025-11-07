# Vercel 자동 배포 문제 해결 가이드

## 🔍 문제 진단

### 1. GitHub 푸시 확인
```bash
git log --oneline -5
git status
```

최신 커밋이 제대로 푸시되었는지 확인하세요.

### 2. Vercel 설정 확인

**Vercel Dashboard에서 확인:**
1. 프로젝트 페이지 접속
2. **Settings** > **Git** 클릭
3. 다음 사항 확인:
   - **Production Branch**: `main`으로 설정되어 있는지
   - **Auto-deploy**: 활성화되어 있는지
   - **Git Repository**: `jongboklee/aion2_FE`로 연결되어 있는지

### 3. GitHub 웹훅 확인

**GitHub에서 확인:**
1. GitHub 저장소 접속: `https://github.com/jongboklee/aion2_FE`
2. **Settings** > **Webhooks** 클릭
3. Vercel 웹훅이 있는지 확인
4. 최근 배송(Delivery) 기록 확인

## 🔧 해결 방법

### 방법 1: Vercel에서 수동 배포 트리거

1. Vercel Dashboard > 프로젝트 페이지
2. **Deployments** 탭 클릭
3. 상단의 **"Redeploy"** 버튼 클릭
4. 또는 **"..."** 메뉴 > **"Redeploy"** 선택

### 방법 2: GitHub 저장소 재연결

1. Vercel Dashboard > 프로젝트 선택
2. **Settings** > **Git** 클릭
3. **"Disconnect"** 클릭하여 연결 해제
4. **"Connect Git Repository"** 클릭
5. `jongboklee/aion2_FE` 저장소 다시 선택
6. **"Import"** 클릭

### 방법 3: 빈 커밋으로 재트리거

```bash
git commit --allow-empty -m "trigger redeploy"
git push origin main
```

### 방법 4: Vercel CLI로 배포

```bash
# Vercel CLI 설치 (없는 경우)
npm i -g vercel

# 로그인
vercel login

# 프로젝트 연결 (처음인 경우)
vercel link

# 배포
vercel --prod
```

## ⚠️ 주의사항

- Vercel은 `main` 브랜치에 푸시할 때만 자동 배포됩니다
- 다른 브랜치에 푸시하면 Preview 배포만 생성됩니다
- GitHub 웹훅이 제대로 설정되지 않으면 자동 배포가 작동하지 않습니다

## 📝 확인 체크리스트

- [ ] 최신 커밋이 GitHub에 푸시되었는지 확인
- [ ] Vercel Settings > Git에서 자동 배포가 활성화되어 있는지 확인
- [ ] Production Branch가 `main`으로 설정되어 있는지 확인
- [ ] GitHub Webhooks에서 Vercel 웹훅이 있는지 확인
- [ ] Vercel Dashboard에서 최신 커밋이 보이는지 확인

