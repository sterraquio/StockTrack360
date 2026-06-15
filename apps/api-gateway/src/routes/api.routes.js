import { Router } from "express";
import { proxyToService } from "../controllers/proxy.controller.js";
import { requireAuth, requireRoles, roles } from "../middleware/auth.middleware.js";
import { serviceNames } from "../repositories/serviceRegistry.repository.js";

export const apiRoutes = Router();

const adminOnly = requireRoles([roles.admin]);
const authenticatedRoles = requireRoles([roles.admin, roles.user]);
const byId = (basePath) => (req) => `${basePath}/${encodeURIComponent(req.params.id)}`;
const authService = (internalPath) =>
  proxyToService({ serviceName: serviceNames.auth, internalPath });
const inventoryService = (internalPath) =>
  proxyToService({ serviceName: serviceNames.inventory, internalPath });
const reportingAlertsService = (internalPath) =>
  proxyToService({ serviceName: serviceNames.reportingAlerts, internalPath });

apiRoutes.post("/auth/login", authService("/internal/auth/login"));
apiRoutes.get(
  "/auth/me",
  requireAuth,
  authenticatedRoles,
  authService("/internal/auth/me"),
);
apiRoutes.post(
  "/auth/logout",
  requireAuth,
  authenticatedRoles,
  authService("/internal/auth/logout"),
);
apiRoutes.get("/auth/users", requireAuth, adminOnly, authService("/internal/users"));
apiRoutes.post("/auth/users", requireAuth, adminOnly, authService("/internal/users"));
apiRoutes.patch(
  "/auth/users/:id",
  requireAuth,
  adminOnly,
  authService(byId("/internal/users")),
);

apiRoutes.get(
  "/inventory/products",
  requireAuth,
  authenticatedRoles,
  inventoryService("/internal/products"),
);
apiRoutes.get(
  "/inventory/products/:id",
  requireAuth,
  authenticatedRoles,
  inventoryService(byId("/internal/products")),
);
apiRoutes.post(
  "/inventory/products",
  requireAuth,
  adminOnly,
  inventoryService("/internal/products"),
);
apiRoutes.patch(
  "/inventory/products/:id",
  requireAuth,
  adminOnly,
  inventoryService(byId("/internal/products")),
);
apiRoutes.delete(
  "/inventory/products/:id",
  requireAuth,
  adminOnly,
  inventoryService(byId("/internal/products")),
);
apiRoutes.get(
  "/inventory/categories",
  requireAuth,
  authenticatedRoles,
  inventoryService("/internal/categories"),
);
apiRoutes.post(
  "/inventory/categories",
  requireAuth,
  adminOnly,
  inventoryService("/internal/categories"),
);
apiRoutes.get(
  "/inventory/movements",
  requireAuth,
  authenticatedRoles,
  inventoryService("/internal/movements"),
);
apiRoutes.post(
  "/inventory/movements/entries",
  requireAuth,
  authenticatedRoles,
  inventoryService("/internal/movements/entries"),
);
apiRoutes.post(
  "/inventory/movements/exits",
  requireAuth,
  authenticatedRoles,
  inventoryService("/internal/movements/exits"),
);

apiRoutes.get(
  "/alerts/low-stock",
  requireAuth,
  authenticatedRoles,
  reportingAlertsService("/internal/alerts/low-stock"),
);
apiRoutes.get(
  "/alerts/expired",
  requireAuth,
  authenticatedRoles,
  reportingAlertsService("/internal/alerts/expired"),
);
apiRoutes.get(
  "/alerts/expiring-soon",
  requireAuth,
  authenticatedRoles,
  reportingAlertsService("/internal/alerts/expiring-soon"),
);

apiRoutes.get(
  "/reports/dashboard",
  requireAuth,
  authenticatedRoles,
  reportingAlertsService("/internal/reports/dashboard"),
);
apiRoutes.get(
  "/reports/low-stock",
  requireAuth,
  authenticatedRoles,
  reportingAlertsService("/internal/reports/low-stock"),
);
apiRoutes.get(
  "/reports/expiring-products",
  requireAuth,
  authenticatedRoles,
  reportingAlertsService("/internal/reports/expiring-products"),
);
apiRoutes.get(
  "/reports/top-exits",
  requireAuth,
  authenticatedRoles,
  reportingAlertsService("/internal/reports/top-exits"),
);
apiRoutes.get(
  "/reports/movements-by-period",
  requireAuth,
  authenticatedRoles,
  reportingAlertsService("/internal/reports/movements-by-period"),
);
