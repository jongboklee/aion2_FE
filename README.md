# 아이온2 정보 제공 사이트

아이온2 게임 정보를 제공하는 웹사이트입니다. iloa.gg를 참고하여 검색 중심의 깔끔한 UI로 구성했습니다.

## 기술 스택

- **프레임워크**: Next.js 14+ (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **백엔드**: Next.js API Routes
- **데이터베이스**: Supabase (PostgreSQL) - 추후 설정 예정

## 주요 기능
 
- ✅ 캐릭터 정보 조회
- ✅ 아이템 정보 검색
- ✅ 게임 가이드 제공
- ✅ 통합 검색 기능
- ✅ 반응형 디자인 (모바일 지원)
- ✅ SEO 최적화
- ✅ 다크모드 지원
- ✅ 타입 안정성 (TypeScript)

## 프로젝트 구조

```
aion2_FE/
├── app/                    # Next.js App Router
│   ├── api/                # API Routes
│   │   ├── search/         # 통합 검색 API
│   │   ├── characters/     # 캐릭터 API
│   │   └── items/          # 아이템 API
│   ├── characters/         # 캐릭터 페이지
│   ├── items/              # 아이템 페이지
│   ├── guides/             # 가이드 페이지
│   ├── search/             # 검색 페이지
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 메인 페이지
│   └── globals.css         # 글로벌 스타일
├── components/             # 재사용 컴포넌트
│   ├── ui/                 # UI 컴포넌트
│   │   ├── Button.tsx      # 버튼 컴포넌트
│   │   ├── Card.tsx        # 카드 컴포넌트
│   │   ├── Input.tsx       # 입력 컴포넌트
│   │   └── Loading.tsx     # 로딩/에러/빈 상태 컴포넌트
│   ├── Header.tsx          # 헤더 네비게이션
│   ├── Footer.tsx          # 푸터
│   └── SearchBar.tsx       # 검색 바 컴포넌트
├── lib/                    # 유틸리티 함수
│   ├── api.ts              # API 유틸리티 (응답 래퍼, 에러 처리)
│   ├── client.ts           # 클라이언트 사이드 API 호출 헬퍼
│   ├── metadata.ts         # SEO 메타데이터 생성 유틸리티
│   └── utils.ts            # 일반 유틸리티 함수
├── types/                  # TypeScript 타입 정의
│   └── index.ts            # 공통 타입 정의
└── public/                 # 정적 파일
```

## 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린트 실행
npm run lint
```

개발 서버는 `http://localhost:3000`에서 실행됩니다.

## 주요 컴포넌트

### UI 컴포넌트
- `Button`: 다양한 variant와 size를 지원하는 버튼 컴포넌트
- `Card`: 재사용 가능한 카드 컴포넌트
- `Input`: 라벨과 에러 메시지를 지원하는 입력 컴포넌트
- `Loading`: 로딩 스피너, 에러 메시지, 빈 상태 컴포넌트

### 기능 컴포넌트
- `SearchBar`: 디바운스가 적용된 검색 바 컴포넌트
- `Header`: 반응형 네비게이션 헤더 (활성 경로 표시)
- `Footer`: 사이트 푸터

## API 엔드포인트

### GET /api/search
통합 검색 API
- Query Parameters:
  - `q`: 검색어 (필수)
  - `type`: 검색 타입 (all, character, item)
  - `page`: 페이지 번호
  - `pageSize`: 페이지 크기

### GET /api/characters
캐릭터 목록 조회 API
- Query Parameters:
  - `page`: 페이지 번호
  - `pageSize`: 페이지 크기
  - `class`: 직업 필터

### GET /api/items
아이템 목록 조회 API
- Query Parameters:
  - `page`: 페이지 번호
  - `pageSize`: 페이지 크기
  - `type`: 아이템 타입 필터
  - `grade`: 등급 필터

## 환경 변수

`.env.local` 파일을 생성하여 다음 환경 변수를 설정하세요:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 배포

Vercel을 통한 배포를 권장합니다.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 다음 단계

- [ ] Supabase 설정 및 DB 연결
- [ ] 실제 데이터 연동
- [ ] 검색 기능 구현
- [ ] 페이지네이션 구현
- [ ] 필터링 기능 구현
- [ ] 이미지 최적화
- [ ] 성능 최적화 (React Query, 캐싱 등)

## 참고 사이트

- [iloa.gg](https://iloa.gg/) - 로스트아크 전투 정보 검색 사이트 (참고)
