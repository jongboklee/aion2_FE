/**
 * 환경 변수 타입 정의
 */
export const env = {
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  NODE_ENV: process.env.NODE_ENV || "development",
} as const;

/**
 * API 엔드포인트 URL 생성
 */
export function getApiUrl(path: string): string {
  return `${env.NEXT_PUBLIC_BASE_URL}/api${path}`;
}

/**
 * 클라이언트 사이드에서 API 호출하는 헬퍼 함수
 */
export async function fetchApi<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = getApiUrl(path);
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

