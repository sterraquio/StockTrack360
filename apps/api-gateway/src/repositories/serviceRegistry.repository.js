import { env } from "../config/env.js";

export const serviceNames = {
  auth: "authService",
  inventory: "inventoryService",
  reportingAlerts: "reportingAlertsService",
};

export const getServiceTargets = () => ({
  [serviceNames.auth]: env.authServiceUrl,
  [serviceNames.inventory]: env.inventoryServiceUrl,
  [serviceNames.reportingAlerts]: env.reportingAlertsServiceUrl,
});

export const getServiceTarget = (serviceName) => getServiceTargets()[serviceName];
