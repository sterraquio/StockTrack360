import { apiRequest } from "./apiClient";
import { API_CONTRACT } from "./apiContract";
import {
  isDataMockEnabled,
  mockListExpiredAlerts,
  mockListExpiringSoonAlerts,
  mockListLowStockAlerts,
} from "./dataMock";

const { alerts } = API_CONTRACT;

export function listLowStockAlerts(query) {
  if (isDataMockEnabled()) {
    return mockListLowStockAlerts(query);
  }

  return apiRequest(alerts.lowStock.path, {
    method: alerts.lowStock.method,
    query,
  });
}

export function listExpiredAlerts(query) {
  if (isDataMockEnabled()) {
    return mockListExpiredAlerts(query);
  }

  return apiRequest(alerts.expired.path, {
    method: alerts.expired.method,
    query,
  });
}

export function listExpiringSoonAlerts(query) {
  if (isDataMockEnabled()) {
    return mockListExpiringSoonAlerts(query);
  }

  return apiRequest(alerts.expiringSoon.path, {
    method: alerts.expiringSoon.method,
    query,
  });
}
