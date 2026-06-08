import { apiRequest } from "./apiClient";
import { API_CONTRACT } from "./apiContract";
import {
  isAuthMockEnabled,
  mockGetCurrentUser,
  mockLogin,
  mockLogout,
} from "./authMock";
import {
  clearAuthSession,
  setAuthSession,
  setAuthUser,
} from "./authStorage";

const { auth } = API_CONTRACT;

export async function login(credentials) {
  if (isAuthMockEnabled()) {
    const response = await mockLogin(credentials);
    setAuthSession(response);
    return response;
  }

  const response = await apiRequest(auth.login.path, {
    auth: false,
    body: credentials,
    method: auth.login.method,
  });

  if (response?.token && response?.user) {
    setAuthSession({
      token: response.token,
      user: response.user,
    });
  }

  return response;
}

export async function getCurrentUser() {
  if (isAuthMockEnabled()) {
    const user = await mockGetCurrentUser();
    setAuthUser(user);
    return user;
  }

  const user = await apiRequest(auth.me.path, {
    method: auth.me.method,
  });

  setAuthUser(user);

  return user;
}

export async function logout() {
  if (isAuthMockEnabled()) {
    try {
      return await mockLogout();
    } finally {
      clearAuthSession();
    }
  }

  try {
    return await apiRequest(auth.logout.path, {
      method: auth.logout.method,
    });
  } finally {
    clearAuthSession();
  }
}
