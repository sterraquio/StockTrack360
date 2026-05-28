const AUTH_TOKEN_KEY = "stocktrack360.authToken";

export function getAuthToken() {
  if (!canUseLocalStorage()) {
    return null;
  }

  try {
    return window.localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token) {
  if (!canUseLocalStorage()) {
    return;
  }

  if (!token) {
    clearAuthToken();
    return;
  }

  try {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch {
    clearAuthToken();
  }
}

export function clearAuthToken() {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    // Storage can be unavailable in restricted browser contexts.
  }
}

function canUseLocalStorage() {
  return typeof window !== "undefined" && "localStorage" in window;
}
