/**
 * API 응답 타입 정의
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * 페이지네이션 응답 타입
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * 검색 파라미터 타입
 */
export interface SearchParams {
  query?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: Record<string, any>;
}

/**
 * API 에러 처리
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * API 응답 래퍼 함수
 */
export function createApiResponse<T>(
  data: T,
  message?: string
): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

/**
 * API 에러 응답 래퍼 함수
 */
export function createApiError(
  error: string,
  statusCode: number = 500
): ApiResponse<never> {
  return {
    success: false,
    error,
  };
}

