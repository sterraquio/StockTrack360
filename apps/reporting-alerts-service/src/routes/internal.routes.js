import { Router } from "express";
import {
  listExpiredAlertsController,
  listExpiringSoonAlertsController,
  listLowStockAlertsController,
} from "../controllers/alerts.controller.js";
import {
  getDashboardController,
  listExpiringProductsReportController,
  listLowStockReportController,
  listMovementsByPeriodReportController,
  listTopExitsReportController,
} from "../controllers/reports.controller.js";
import { requireAuth, requireRoles, roles } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const internalRoutes = Router();

const authenticatedRoles = requireRoles([roles.admin, roles.user]);

internalRoutes.get(
  "/alerts/low-stock",
  requireAuth,
  authenticatedRoles,
  asyncHandler(listLowStockAlertsController),
);
internalRoutes.get(
  "/alerts/expired",
  requireAuth,
  authenticatedRoles,
  asyncHandler(listExpiredAlertsController),
);
internalRoutes.get(
  "/alerts/expiring-soon",
  requireAuth,
  authenticatedRoles,
  asyncHandler(listExpiringSoonAlertsController),
);
internalRoutes.get(
  "/reports/dashboard",
  requireAuth,
  authenticatedRoles,
  asyncHandler(getDashboardController),
);
internalRoutes.get(
  "/reports/low-stock",
  requireAuth,
  authenticatedRoles,
  asyncHandler(listLowStockReportController),
);
internalRoutes.get(
  "/reports/expiring-products",
  requireAuth,
  authenticatedRoles,
  asyncHandler(listExpiringProductsReportController),
);
internalRoutes.get(
  "/reports/top-exits",
  requireAuth,
  authenticatedRoles,
  asyncHandler(listTopExitsReportController),
);
internalRoutes.get(
  "/reports/movements-by-period",
  requireAuth,
  authenticatedRoles,
  asyncHandler(listMovementsByPeriodReportController),
);
