/**
 * 인증 관련 유틸리티 함수
 */
export async function getCurrentUser() {
  try {
    const response = await fetch("/api/auth/me", {
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}

export async function logout() {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("로그아웃에 실패했습니다");
    }

    return true;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

