import {
  listExpiredAlerts,
  listExpiringSoonAlerts,
  listLowStockAlerts,
} from "../repositories/alerts.repository.js";
import {
  validateExpiringSoonQuery,
  validatePaginationQuery,
} from "../validators/alerts.validator.js";

export const listLowStockAlertsService = (query) => {
  const filters = validatePaginationQuery(query);
  return listLowStockAlerts(filters);
};

export const listExpiredAlertsService = (query) => {
  const filters = validatePaginationQuery(query);
  return listExpiredAlerts(filters);
};

export const listExpiringSoonAlertsService = (query) => {
  const filters = validateExpiringSoonQuery(query);
  return listExpiringSoonAlerts(filters);
};
