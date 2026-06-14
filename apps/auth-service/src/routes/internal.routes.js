import { Router } from "express";
import { pendingService } from "../controllers/pending.controller.js";
import { requireAuth, requireRoles, roles } from "../middleware/auth.middleware.js";

export const internalRoutes = Router();

const authModule = pendingService("auth");
const usersModule = pendingService("users");
const adminOnly = requireRoles([roles.admin]);
const authenticatedRoles = requireRoles([roles.admin, roles.user]);

internalRoutes.post("/auth/login", authModule);
internalRoutes.get("/auth/me", requireAuth, authenticatedRoles, authModule);
internalRoutes.post("/auth/logout", requireAuth, authenticatedRoles, authModule);
internalRoutes.get("/users", requireAuth, adminOnly, usersModule);
internalRoutes.post("/users", requireAuth, adminOnly, usersModule);
internalRoutes.patch("/users/:id", requireAuth, adminOnly, usersModule);
