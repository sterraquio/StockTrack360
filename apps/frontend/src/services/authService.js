import { apiRequest } from "./apiClient";
import { API_CONTRACT } from "./apiContract";
import {
  clearAuthSession,
  setAuthSession,
  setAuthUser,
} from "./authStorage";

const { auth } = API_CONTRACT;

export async function login(credentials) {
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
  const user = await apiRequest(auth.me.path, {
    method: auth.me.method,
  });

  setAuthUser(user);

  return user;
}

export async function logout() {
  try {
    return await apiRequest(auth.logout.path, {
      method: auth.logout.method,
    });
  } finally {
    clearAuthSession();
  }
}
