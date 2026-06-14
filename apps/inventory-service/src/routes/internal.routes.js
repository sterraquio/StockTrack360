import { Router } from "express";
import {
  createCategoryController,
  listCategoriesController,
} from "../controllers/categories.controller.js";
import { pendingService } from "../controllers/pending.controller.js";
import {
  createProductController,
  deleteProductController,
  getProductByIdController,
  listProductsController,
  updateProductController,
} from "../controllers/products.controller.js";
import { requireAuth, requireRoles, roles } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const internalRoutes = Router();

const movementsModule = pendingService("movements");
const adminOnly = requireRoles([roles.admin]);
const authenticatedRoles = requireRoles([roles.admin, roles.user]);

internalRoutes.get(
  "/products",
  requireAuth,
  authenticatedRoles,
  asyncHandler(listProductsController),
);
internalRoutes.get(
  "/products/:id",
  requireAuth,
  authenticatedRoles,
  asyncHandler(getProductByIdController),
);
internalRoutes.post(
  "/products",
  requireAuth,
  adminOnly,
  asyncHandler(createProductController),
);
internalRoutes.patch(
  "/products/:id",
  requireAuth,
  adminOnly,
  asyncHandler(updateProductController),
);
internalRoutes.delete(
  "/products/:id",
  requireAuth,
  adminOnly,
  asyncHandler(deleteProductController),
);
internalRoutes.get(
  "/categories",
  requireAuth,
  authenticatedRoles,
  asyncHandler(listCategoriesController),
);
internalRoutes.post(
  "/categories",
  requireAuth,
  adminOnly,
  asyncHandler(createCategoryController),
);
internalRoutes.get("/movements", requireAuth, authenticatedRoles, movementsModule);
internalRoutes.post("/movements/entries", requireAuth, authenticatedRoles, movementsModule);
internalRoutes.post("/movements/exits", requireAuth, authenticatedRoles, movementsModule);
