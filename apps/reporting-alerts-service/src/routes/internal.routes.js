import { Router } from "express";
import { pendingService } from "../controllers/pending.controller.js";
import { requireAuth, requireRoles, roles } from "../middleware/auth.middleware.js";

export const internalRoutes = Router();

const alertsModule = pendingService("alerts");
const reportsModule = pendingService("reports");
const authenticatedRoles = requireRoles([roles.admin, roles.user]);

internalRoutes.get("/alerts/low-stock", requireAuth, authenticatedRoles, alertsModule);
internalRoutes.get("/alerts/expired", requireAuth, authenticatedRoles, alertsModule);
internalRoutes.get("/alerts/expiring-soon", requireAuth, authenticatedRoles, alertsModule);
internalRoutes.get("/reports/dashboard", requireAuth, authenticatedRoles, reportsModule);
internalRoutes.get("/reports/low-stock", requireAuth, authenticatedRoles, reportsModule);
internalRoutes.get("/reports/expiring-products", requireAuth, authenticatedRoles, reportsModule);
internalRoutes.get("/reports/top-exits", requireAuth, authenticatedRoles, reportsModule);
internalRoutes.get("/reports/movements-by-period", requireAuth, authenticatedRoles, reportsModule);
