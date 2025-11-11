/**
 * 임시 사용자 저장소 (개발용)
 * TODO: 실제 DB로 교체 필요
 */

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  resetToken?: string | null;
  resetTokenExpires?: Date | null;
}

// 임시 메모리 저장소
export const users: User[] = [];

