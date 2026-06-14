import dotenv from "dotenv";

dotenv.config({ quiet: true });

const toPort = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const env = {
  host: process.env.HOST || "127.0.0.1",
  port: toPort(process.env.PORT, 4000),
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  jwtSecret: process.env.JWT_SECRET || "",
  serviceTimeoutMs: toPort(process.env.SERVICE_TIMEOUT_MS, 5000),
  authServiceUrl: process.env.AUTH_SERVICE_URL || "http://localhost:4001",
  inventoryServiceUrl: process.env.INVENTORY_SERVICE_URL || "http://localhost:4002",
  reportingAlertsServiceUrl:
    process.env.REPORTING_ALERTS_SERVICE_URL || "http://localhost:4003",
};
