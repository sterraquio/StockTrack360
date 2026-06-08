import { apiRequest } from "./apiClient";
import { API_CONTRACT } from "./apiContract";
import {
  isDataMockEnabled,
  mockCreateEntry,
  mockCreateExit,
  mockListMovements,
} from "./dataMock";

const { movements } = API_CONTRACT;

export function listMovements(query) {
  if (isDataMockEnabled()) {
    return mockListMovements(query);
  }

  return apiRequest(movements.list.path, {
    method: movements.list.method,
    query,
  });
}

export function createEntry(payload) {
  if (isDataMockEnabled()) {
    return mockCreateEntry(payload);
  }

  return apiRequest(movements.createEntry.path, {
    body: payload,
    method: movements.createEntry.method,
  });
}

export function createExit(payload) {
  if (isDataMockEnabled()) {
    return mockCreateExit(payload);
  }

  return apiRequest(movements.createExit.path, {
    body: payload,
    method: movements.createExit.method,
  });
}
