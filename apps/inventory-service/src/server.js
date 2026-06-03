import { createServer } from "node:http";
import { createServiceError, getBearerToken, HTTP_STATUS, readJsonBody, sendError, sendJson } from "./http.js";
import {
  createCategory,
  createProduct,
  deleteProduct,
  getProductById,
  listCategories,
  listMovements,
  listProducts,
  registerEntry,
  registerExit,
  updateProduct,
} from "./store.js";
import { verifyToken } from "./security.js";

const PORT = Number(process.env.PORT ?? 4002);
const JWT_SECRET = process.env.JWT_SECRET ?? "stocktrack360-dev-secret";
const ALLOWED_ROLES = new Set(["ADMINISTRADOR", "USUARIO"]);

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host ?? "localhost"}`);
    const method = request.method;

    if (url.pathname === "/internal/products" && method === "GET") {
      requireAuthenticatedUser(request);

      return sendJson(response, HTTP_STATUS.ok, listProducts(url.searchParams));
    }

    if (url.pathname === "/internal/products" && method === "POST") {
      requireRole(request, "ADMINISTRADOR");

      return sendJson(response, HTTP_STATUS.created, createProduct(await readJsonBody(request)));
    }

    const productMatch = url.pathname.match(/^\/internal\/products\/([^/]+)$/);

    if (productMatch && method === "GET") {
      requireAuthenticatedUser(request);

      return sendJson(response, HTTP_STATUS.ok, getProductById(productMatch[1]));
    }

    if (productMatch && method === "PATCH") {
      requireRole(request, "ADMINISTRADOR");

      return sendJson(response, HTTP_STATUS.ok, updateProduct(productMatch[1], await readJsonBody(request)));
    }

    if (productMatch && method === "DELETE") {
      requireRole(request, "ADMINISTRADOR");

      return sendJson(response, HTTP_STATUS.ok, deleteProduct(productMatch[1]));
    }

    if (url.pathname === "/internal/categories" && method === "GET") {
      requireAuthenticatedUser(request);

      return sendJson(response, HTTP_STATUS.ok, listCategories());
    }

    if (url.pathname === "/internal/categories" && method === "POST") {
      requireRole(request, "ADMINISTRADOR");

      return sendJson(response, HTTP_STATUS.created, createCategory(await readJsonBody(request)));
    }

    if (url.pathname === "/internal/movements/entries" && method === "POST") {
      const user = requireAuthenticatedUser(request);

      return sendJson(response, HTTP_STATUS.created, registerEntry(await readJsonBody(request), user));
    }

    if (url.pathname === "/internal/movements/exits" && method === "POST") {
      const user = requireAuthenticatedUser(request);

      return sendJson(response, HTTP_STATUS.created, registerExit(await readJsonBody(request), user));
    }

    if (url.pathname === "/internal/movements" && method === "GET") {
      requireAuthenticatedUser(request);

      return sendJson(response, HTTP_STATUS.ok, listMovements(url.searchParams));
    }

    return sendError(response, HTTP_STATUS.notFound, "NOT_FOUND", "Ruta no encontrada.");
  } catch (error) {
    return handleError(response, error);
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`inventory-service escuchando en http://localhost:${PORT}`);
});

function requireRole(request, role) {
  const user = requireAuthenticatedUser(request);

  if (user.role !== role) {
    throw createServiceError(HTTP_STATUS.forbidden, "FORBIDDEN", "No tienes permisos para esta accion.");
  }

  return user;
}

function requireAuthenticatedUser(request) {
  const token = getBearerToken(request);
  const payload = token ? verifyToken(token, JWT_SECRET) : null;
  const role = payload?.role;
  const userId = payload?.userId ?? payload?.sub;

  if (!payload || !userId || !ALLOWED_ROLES.has(role)) {
    throw createServiceError(HTTP_STATUS.unauthorized, "UNAUTHORIZED", "Autenticacion requerida.");
  }

  return {
    userId,
    name: payload.name,
    role,
  };
}

function handleError(response, error) {
  if (error?.isServiceError) {
    return sendError(response, error.status, error.code, error.message, error.details);
  }

  if (error instanceof SyntaxError) {
    return sendError(response, HTTP_STATUS.badRequest, "VALIDATION_ERROR", "JSON invalido.");
  }

  console.error(error);

  return sendError(response, HTTP_STATUS.internalError, "INTERNAL_ERROR", "Error interno del servicio.");
}
