import {
  listExpiredAlertsService,
  listExpiringSoonAlertsService,
  listLowStockAlertsService,
} from "../services/alerts.service.js";

export const listLowStockAlertsController = async (req, res) => {
  const response = await listLowStockAlertsService(req.query);
  return res.status(200).json(response);
};

export const listExpiredAlertsController = async (req, res) => {
  const response = await listExpiredAlertsService(req.query);
  return res.status(200).json(response);
};

export const listExpiringSoonAlertsController = async (req, res) => {
  const response = await listExpiringSoonAlertsService(req.query);
  return res.status(200).json(response);
};
