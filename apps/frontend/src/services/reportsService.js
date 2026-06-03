import { apiRequest } from "./apiClient";
import { API_CONTRACT } from "./apiContract";
import {
  isDataMockEnabled,
  mockGetDashboard,
  mockGetExpiringProductsReport,
  mockGetLowStockReport,
  mockGetMovementsByPeriodReport,
  mockGetTopExitsReport,
} from "./dataMock";

const { reports } = API_CONTRACT;

export function getDashboard(query) {
  if (isDataMockEnabled()) {
    return mockGetDashboard(query);
  }

  return apiRequest(reports.dashboard.path, {
    method: reports.dashboard.method,
    query,
  });
}

export function getLowStockReport(query) {
  if (isDataMockEnabled()) {
    return mockGetLowStockReport(query);
  }

  return apiRequest(reports.lowStock.path, {
    method: reports.lowStock.method,
    query,
  });
}

export function getExpiringProductsReport(query) {
  if (isDataMockEnabled()) {
    return mockGetExpiringProductsReport(query);
  }

  return apiRequest(reports.expiringProducts.path, {
    method: reports.expiringProducts.method,
    query,
  });
}

export function getTopExitsReport(query) {
  if (isDataMockEnabled()) {
    return mockGetTopExitsReport(query);
  }

  return apiRequest(reports.topExits.path, {
    method: reports.topExits.method,
    query,
  });
}

export function getMovementsByPeriodReport(query) {
  if (isDataMockEnabled()) {
    return mockGetMovementsByPeriodReport(query);
  }

  return apiRequest(reports.movementsByPeriod.path, {
    method: reports.movementsByPeriod.method,
    query,
  });
}
