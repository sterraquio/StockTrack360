const AUTH_TOKEN_KEY = "stocktrack360.authToken";
const AUTH_USER_KEY = "stocktrack360.authUser";

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

export function getAuthUser() {
  if (!canUseLocalStorage()) {
    return null;
  }

  try {
    const storedUser = window.localStorage.getItem(AUTH_USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

export function setAuthUser(user) {
  if (!canUseLocalStorage()) {
    return;
  }

  if (!user) {
    clearAuthUser();
    return;
  }

  try {
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } catch {
    clearAuthUser();
  }
}

export function setAuthSession({ token, user }) {
  setAuthToken(token);
  setAuthUser(user);
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

export function clearAuthUser() {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    window.localStorage.removeItem(AUTH_USER_KEY);
  } catch {
    // Storage can be unavailable in restricted browser contexts.
  }
}

export function clearAuthSession() {
  clearAuthToken();
  clearAuthUser();
}

function canUseLocalStorage() {
  return typeof window !== "undefined" && "localStorage" in window;
}
