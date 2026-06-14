import { getRuntimeReadiness } from "../services/runtimeReadiness.service.js";
import { ApiError, errorCodes } from "../utils/apiError.js";

export const pendingService = (moduleName) => (_req, _res, next) => {
  next(
    new ApiError(
      503,
      errorCodes.serviceUnavailable,
      "Servicio temporalmente no disponible.",
      {
        module: moduleName,
        phase: "fase-2-skeleton",
        readiness: getRuntimeReadiness(),
      },
    ),
  );
};
