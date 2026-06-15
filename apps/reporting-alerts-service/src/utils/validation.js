import { ApiError, errorCodes } from "./apiError.js";

export const validationError = (message, details = null) =>
  new ApiError(400, errorCodes.validationError, message, details);

export const parsePositiveInteger = (
  value,
  fieldName,
  { defaultValue, maxValue } = {},
) => {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  if (Array.isArray(value)) {
    throw validationError("Parametro de consulta invalido.", {
      field: fieldName,
    });
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isInteger(parsed) || parsed < 1 || String(parsed) !== String(value)) {
    throw validationError("La paginacion no es valida.", {
      field: fieldName,
    });
  }

  if (maxValue && parsed > maxValue) {
    throw validationError("La paginacion no es valida.", {
      field: fieldName,
      max: maxValue,
    });
  }

  return parsed;
};
