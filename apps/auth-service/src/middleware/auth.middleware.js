import jwt from "jsonwebtoken";
import { authMessages, roles, userStatuses } from "../constants/auth.constants.js";
import { env } from "../config/env.js";
import { findUserById } from "../repositories/users.repository.js";
import { ApiError, errorCodes } from "../utils/apiError.js";

export const requireAuth = (req, _res, next) => {
  const authHeader = req.get("authorization") || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(
      new ApiError(
        401,
        errorCodes.unauthorized,
        authMessages.invalidSession,
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
        authMessages.invalidSession,
      ),
    );
  }
};

export { roles };

export const requireActiveUser = async (req, _res, next) => {
  try {
    const userId = req.user?.userId || req.user?.sub;

    if (!userId) {
      return next(
        new ApiError(401, errorCodes.unauthorized, authMessages.invalidSession),
      );
    }

    const user = await findUserById(userId);

    if (!user) {
      return next(
        new ApiError(401, errorCodes.unauthorized, authMessages.invalidSession),
      );
    }

    if (user.status !== userStatuses.active) {
      return next(
        new ApiError(403, errorCodes.userInactive, authMessages.inactiveUser),
      );
    }

    req.authenticatedUser = user;
    req.user = {
      ...req.user,
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
    };

    return next();
  } catch (error) {
    return next(error);
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
