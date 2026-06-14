import { Router } from "express";
import { pendingService } from "../controllers/pending.controller.js";
import { requireAuth, requireRoles, roles } from "../middleware/auth.middleware.js";

export const internalRoutes = Router();

const productsModule = pendingService("products");
const categoriesModule = pendingService("categories");
const movementsModule = pendingService("movements");
const adminOnly = requireRoles([roles.admin]);
const authenticatedRoles = requireRoles([roles.admin, roles.user]);

internalRoutes.get("/products", requireAuth, authenticatedRoles, productsModule);
internalRoutes.get("/products/:id", requireAuth, authenticatedRoles, productsModule);
internalRoutes.post("/products", requireAuth, adminOnly, productsModule);
internalRoutes.patch("/products/:id", requireAuth, adminOnly, productsModule);
internalRoutes.delete("/products/:id", requireAuth, adminOnly, productsModule);
internalRoutes.get("/categories", requireAuth, authenticatedRoles, categoriesModule);
internalRoutes.post("/categories", requireAuth, adminOnly, categoriesModule);
internalRoutes.get("/movements", requireAuth, authenticatedRoles, movementsModule);
internalRoutes.post("/movements/entries", requireAuth, authenticatedRoles, movementsModule);
internalRoutes.post("/movements/exits", requireAuth, authenticatedRoles, movementsModule);
