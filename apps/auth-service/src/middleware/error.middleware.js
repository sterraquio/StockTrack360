import { ApiError, errorCodes } from "../utils/apiError.js";

export const notFoundHandler = (req, _res, next) => {
  next(
    new ApiError(404, errorCodes.notFound, "Ruta no encontrada.", {
      method: req.method,
      path: req.originalUrl,
    }),
  );
};

export const errorHandler = (error, _req, res, _next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({
      message: "JSON invalido.",
      code: "VALIDATION_ERROR",
      details: null,
    });
  }

  const statusCode = error.statusCode || 500;
  const code = error.code || errorCodes.internalError;
  const message = error.message || "Error interno del servidor.";
  const details = error.details ?? null;

  if (statusCode >= 500 && !(error instanceof ApiError)) {
    console.error(error);
  }

  return res.status(statusCode).json({ message, code, details });
};
