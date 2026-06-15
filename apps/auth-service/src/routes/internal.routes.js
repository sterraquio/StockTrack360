import { Router } from "express";
import {
  loginController,
  logoutController,
  meController,
} from "../controllers/auth.controller.js";
import {
  createUserController,
  listUsersController,
  updateUserController,
} from "../controllers/users.controller.js";
import {
  requireActiveUser,
  requireAuth,
  requireRoles,
  roles,
} from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const internalRoutes = Router();

const adminOnly = requireRoles([roles.admin]);
const authenticatedRoles = requireRoles([roles.admin, roles.user]);
const protectedRoute = [requireAuth, requireActiveUser, authenticatedRoles];
const adminRoute = [requireAuth, requireActiveUser, adminOnly];

internalRoutes.post("/auth/login", asyncHandler(loginController));
internalRoutes.get("/auth/me", ...protectedRoute, asyncHandler(meController));
internalRoutes.post("/auth/logout", ...protectedRoute, asyncHandler(logoutController));
internalRoutes.get("/users", ...adminRoute, asyncHandler(listUsersController));
internalRoutes.post("/users", ...adminRoute, asyncHandler(createUserController));
internalRoutes.patch("/users/:id", ...adminRoute, asyncHandler(updateUserController));
