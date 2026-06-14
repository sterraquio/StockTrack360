import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError, errorCodes } from "../utils/apiError.js";

export const roles = {
  admin: "ADMINISTRADOR",
  user: "USUARIO",
};

export const requireAuth = (req, _res, next) => {
  const authHeader = req.get("authorization") || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(
      new ApiError(
        401,
        errorCodes.unauthorized,
        "Tu sesion no es valida. Inicia sesion nuevamente.",
      ),
    );
  }

  if (!env.jwtSecret) {
    return next(
      new ApiError(503, errorCodes.serviceUnavailable, "Validacion JWT no configurada."),
    );
  }

  try {
    req.user = jwt.verify(token, env.jwtSecret);
    return next();
  } catch (_error) {
    return next(
      new ApiError(
        401,
        errorCodes.unauthorized,
        "Tu sesion no es valida. Inicia sesion nuevamente.",
      ),
    );
  }
};

export const requireRoles = (allowedRoles) => (req, _res, next) => {
  if (!allowedRoles.includes(req.user?.role)) {
    return next(
      new ApiError(
        403,
        errorCodes.forbidden,
        "No tienes permisos para realizar esta accion.",
      ),
    );
  }

  return next();
};
