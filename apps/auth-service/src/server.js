import { createServer } from "node:http";
import { createServiceError, getBearerToken, HTTP_STATUS, readJsonBody, sendError, sendJson } from "./http.js";
import { createUser, findUserByEmail, findUserById, listUsers, toPublicUser, updateUser } from "./store.js";
import { signToken, verifyPassword, verifyToken } from "./security.js";

const PORT = Number(process.env.PORT ?? 4001);
const JWT_SECRET = process.env.JWT_SECRET ?? "stocktrack360-dev-secret";
const GENERIC_LOGIN_MESSAGE = "Correo o contrasena incorrectos.";

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host ?? "localhost"}`);
    const method = request.method;

    if (method === "POST" && url.pathname === "/internal/auth/login") {
      return await handleLogin(request, response);
    }

    if (method === "GET" && url.pathname === "/internal/auth/me") {
      const user = requireAuthenticatedUser(request);

      return sendJson(response, HTTP_STATUS.ok, toPublicUser(user));
    }

    if (method === "POST" && url.pathname === "/internal/auth/logout") {
      requireAuthenticatedUser(request);

      return sendJson(response, HTTP_STATUS.ok, { message: "Sesion cerrada correctamente." });
    }

    if (url.pathname === "/internal/users" && method === "GET") {
      requireRole(request, "ADMINISTRADOR");

      return sendJson(response, HTTP_STATUS.ok, listUsers(url.searchParams));
    }

    if (url.pathname === "/internal/users" && method === "POST") {
      requireRole(request, "ADMINISTRADOR");

      return sendJson(response, HTTP_STATUS.created, createUser(await readJsonBody(request)));
    }

    const userMatch = url.pathname.match(/^\/internal\/users\/([^/]+)$/);

    if (userMatch && method === "PATCH") {
      requireRole(request, "ADMINISTRADOR");

      return sendJson(response, HTTP_STATUS.ok, updateUser(userMatch[1], await readJsonBody(request)));
    }

    return sendError(response, HTTP_STATUS.notFound, "NOT_FOUND", "Ruta no encontrada.");
  } catch (error) {
    return handleError(response, error);
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`auth-service escuchando en http://localhost:${PORT}`);
});

async function handleLogin(request, response) {
  const body = await readJsonBody(request);

  if (!body.email || !body.password) {
    return sendError(response, HTTP_STATUS.badRequest, "VALIDATION_ERROR", "Correo y contrasena son obligatorios.");
  }

  const user = findUserByEmail(body.email);

  if (!user || !verifyPassword(body.password, user.passwordHash)) {
    return sendError(response, HTTP_STATUS.unauthorized, "INVALID_CREDENTIALS", GENERIC_LOGIN_MESSAGE);
  }

  if (user.status !== "ACTIVE") {
    return sendError(response, HTTP_STATUS.forbidden, "USER_INACTIVE", GENERIC_LOGIN_MESSAGE);
  }

  const publicUser = toPublicUser(user);
  const token = signToken(
    {
      sub: user.id,
      userId: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
  );

  return sendJson(response, HTTP_STATUS.ok, {
    token,
    user: publicUser,
  });
}

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
  const user = payload ? findUserById(payload.userId ?? payload.sub) : null;

  if (!user) {
    throw createServiceError(HTTP_STATUS.unauthorized, "UNAUTHORIZED", "Autenticacion requerida.");
  }

  if (user.status !== "ACTIVE") {
    throw createServiceError(HTTP_STATUS.forbidden, "FORBIDDEN", "Usuario inactivo.");
  }

  return user;
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
