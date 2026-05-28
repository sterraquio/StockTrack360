import { apiRequest } from "./apiClient";
import { API_CONTRACT } from "./apiContract";
import { replacePathParams } from "./apiUtils";

const { users } = API_CONTRACT;

export function listUsers(query) {
  return apiRequest(users.list.path, {
    method: users.list.method,
    query,
  });
}

export function createUser(payload) {
  return apiRequest(users.create.path, {
    body: payload,
    method: users.create.method,
  });
}

export function updateUser(id, payload) {
  return apiRequest(replacePathParams(users.update.path, { id }), {
    body: payload,
    method: users.update.method,
  });
}
