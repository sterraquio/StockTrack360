import {
  getDashboardSummary,
  listExpiringProductsReport,
  listLowStockReport,
  listMovementsByPeriodReport,
  listTopExitProductsReport,
} from "../repositories/reports.repository.js";
import {
  validateDashboardQuery,
  validateExpiringProductsReportQuery,
  validateLowStockReportQuery,
  validateMovementsByPeriodReportQuery,
  validateTopExitsReportQuery,
} from "../validators/reports.validator.js";

export const getDashboardService = (query) => {
  const filters = validateDashboardQuery(query);

  return getDashboardSummary(filters);
};

export const listLowStockReportService = (query) => {
  const filters = validateLowStockReportQuery(query);

  return listLowStockReport(filters);
};

export const listExpiringProductsReportService = (query) => {
  const filters = validateExpiringProductsReportQuery(query);

  return listExpiringProductsReport(filters);
};

export const listTopExitsReportService = (query) => {
  const filters = validateTopExitsReportQuery(query);

  return listTopExitProductsReport(filters);
};

export const listMovementsByPeriodReportService = (query) => {
  const filters = validateMovementsByPeriodReportQuery(query);

  return listMovementsByPeriodReport(filters);
};
