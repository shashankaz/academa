import Cookies from "js-cookie";

const COOKIE_OPTIONS = {
  expires: 7,
  secure: window.location.protocol === "https:",
  sameSite: "lax" as const,
  path: "/",
};

export const getCookie = (name: string): string | null => {
  try {
    return Cookies.get(name) || null;
  } catch (error) {
    console.error("Error reading cookie:", error);
    return null;
  }
};

export const setCookie = (
  name: string,
  value: string,
  options?: Cookies.CookieAttributes
): void => {
  try {
    Cookies.set(name, value, { ...COOKIE_OPTIONS, ...options });
  } catch (error) {
    console.error("Error setting cookie:", error);
  }
};

export const deleteCookie = (name: string): void => {
  try {
    Cookies.remove(name, { path: "/" });
  } catch (error) {
    console.error("Error deleting cookie:", error);
  }
};

export const isTokenPresent = (): boolean => {
  try {
    const token = getCookie("token");
    return !!token && token.length > 0;
  } catch (error) {
    console.error("Error checking token presence:", error);
    return false;
  }
};

export const getAuthToken = (): string | null => {
  try {
    return getCookie("token");
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
};

export const setAuthToken = (token: string): void => {
  setCookie("token", token);
};

export const removeAuthToken = (): void => {
  deleteCookie("token");
};

export const isValidTokenFormat = (token: string | null): boolean => {
  if (!token) return false;

  const parts = token.split(".");
  return parts.length === 3;
};
