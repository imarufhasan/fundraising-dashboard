/**
 * Reads the auth token the same way Sidebar's logout clears it — checking
 * localStorage first, then sessionStorage (covers "remember me" vs
 * session-only logins).
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") ?? sessionStorage.getItem("token");
}