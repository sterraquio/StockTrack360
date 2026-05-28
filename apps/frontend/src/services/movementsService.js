import { apiRequest } from "./apiClient";
import { API_CONTRACT } from "./apiContract";

const { movements } = API_CONTRACT;

export function listMovements(query) {
  return apiRequest(movements.list.path, {
    method: movements.list.method,
    query,
  });
}

export function createEntry(payload) {
  return apiRequest(movements.createEntry.path, {
    body: payload,
    method: movements.createEntry.method,
  });
}

export function createExit(payload) {
  return apiRequest(movements.createExit.path, {
    body: payload,
    method: movements.createExit.method,
  });
}
