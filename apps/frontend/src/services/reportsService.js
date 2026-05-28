import { apiRequest } from "./apiClient";
import { API_CONTRACT } from "./apiContract";

const { reports } = API_CONTRACT;

export function getDashboard(query) {
  return apiRequest(reports.dashboard.path, {
    method: reports.dashboard.method,
    query,
  });
}

export function getLowStockReport(query) {
  return apiRequest(reports.lowStock.path, {
    method: reports.lowStock.method,
    query,
  });
}

export function getExpiringProductsReport(query) {
  return apiRequest(reports.expiringProducts.path, {
    method: reports.expiringProducts.method,
    query,
  });
}

export function getTopExitsReport(query) {
  return apiRequest(reports.topExits.path, {
    method: reports.topExits.method,
    query,
  });
}

export function getMovementsByPeriodReport(query) {
  return apiRequest(reports.movementsByPeriod.path, {
    method: reports.movementsByPeriod.method,
    query,
  });
}
