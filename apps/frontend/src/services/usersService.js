import { apiRequest } from "./apiClient";
import { API_CONTRACT } from "./apiContract";
import { replacePathParams } from "./apiUtils";
import {
  isDataMockEnabled,
  mockCreateUser,
  mockListUsers,
  mockUpdateUser,
} from "./dataMock";

const { users } = API_CONTRACT;

export function listUsers(query) {
  if (isDataMockEnabled()) {
    return mockListUsers(query);
  }

  return apiRequest(users.list.path, {
    method: users.list.method,
    query,
  });
}

export function createUser(payload) {
  if (isDataMockEnabled()) {
    return mockCreateUser(payload);
  }

  return apiRequest(users.create.path, {
    body: payload,
    method: users.create.method,
  });
}

export function updateUser(id, payload) {
  if (isDataMockEnabled()) {
    return mockUpdateUser(id, payload);
  }

  return apiRequest(replacePathParams(users.update.path, { id }), {
    body: payload,
    method: users.update.method,
  });
}
