import { apiRequest } from "./apiClient";
import { API_CONTRACT } from "./apiContract";

const { alerts } = API_CONTRACT;

export function listLowStockAlerts(query) {
  return apiRequest(alerts.lowStock.path, {
    method: alerts.lowStock.method,
    query,
  });
}

export function listExpiredAlerts(query) {
  return apiRequest(alerts.expired.path, {
    method: alerts.expired.method,
    query,
  });
}

export function listExpiringSoonAlerts(query) {
  return apiRequest(alerts.expiringSoon.path, {
    method: alerts.expiringSoon.method,
    query,
  });
}
