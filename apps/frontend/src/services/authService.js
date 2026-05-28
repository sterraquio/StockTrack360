import { apiRequest } from "./apiClient";
import { API_CONTRACT } from "./apiContract";
import { clearAuthToken, setAuthToken } from "./authStorage";

const { auth } = API_CONTRACT;

export async function login(credentials) {
  const response = await apiRequest(auth.login.path, {
    auth: false,
    body: credentials,
    method: auth.login.method,
  });

  if (response?.token) {
    setAuthToken(response.token);
  }

  return response;
}

export function getCurrentUser() {
  return apiRequest(auth.me.path, {
    method: auth.me.method,
  });
}

export async function logout() {
  try {
    return await apiRequest(auth.logout.path, {
      method: auth.logout.method,
    });
  } finally {
    clearAuthToken();
  }
}
