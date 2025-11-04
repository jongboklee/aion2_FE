/**
 * 디바운스 유틸리티 함수
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * 쿼리 스트링 파싱
 */
export function parseSearchParams(searchParams: URLSearchParams): Record<string, string> {
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

/**
 * 쿼리 스트링 생성
 */
export function createQueryString(params: Record<string, string | number | undefined>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
}

/**
 * 숫자 포맷팅 (천 단위 콤마)
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("ko-KR").format(num);
}

/**
 * 문자열 잘라내기 및 말줄임표 추가
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

/**
 * 클래스명 조합 유틸리티 (clsx 스타일)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * 하이퍼링크 생성 유틸리티
 */
export function createHref(path: string, params?: Record<string, string | number>): string {
  if (!params || Object.keys(params).length === 0) return path;
  
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  
  return `${path}?${searchParams.toString()}`;
}

