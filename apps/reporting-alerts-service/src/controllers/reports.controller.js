import {
  getDashboardService,
  listExpiringProductsReportService,
  listLowStockReportService,
  listMovementsByPeriodReportService,
  listTopExitsReportService,
} from "../services/reports.service.js";

export const getDashboardController = async (req, res) => {
  const response = await getDashboardService(req.query);
  return res.status(200).json(response);
};

export const listLowStockReportController = async (req, res) => {
  const response = await listLowStockReportService(req.query);
  return res.status(200).json(response);
};

export const listExpiringProductsReportController = async (req, res) => {
  const response = await listExpiringProductsReportService(req.query);
  return res.status(200).json(response);
};

export const listTopExitsReportController = async (req, res) => {
  const response = await listTopExitsReportService(req.query);
  return res.status(200).json(response);
};

export const listMovementsByPeriodReportController = async (req, res) => {
  const response = await listMovementsByPeriodReportService(req.query);
  return res.status(200).json(response);
};
