import { ApiError, errorCodes } from "./apiError.js";

export const validationError = (message, details = null) =>
  new ApiError(400, errorCodes.validationError, message, details);

export const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

export const requireBodyObject = (body) => {
  if (!isPlainObject(body)) {
    throw validationError("El cuerpo de la peticion debe ser un objeto JSON.");
  }

  return body;
};

export const requireNonEmptyString = (value, fieldName) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw validationError("Completa los campos obligatorios.", {
      field: fieldName,
    });
  }

  return value.trim();
};

export const readOptionalQueryString = (query, fieldName) => {
  const value = query[fieldName];

  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (Array.isArray(value) || typeof value !== "string") {
    throw validationError("Parametro de consulta invalido.", {
      field: fieldName,
    });
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

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

export const validateUuid = (value, fieldName = "id") => {
  if (
    typeof value !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    )
  ) {
    throw validationError("Identificador invalido.", { field: fieldName });
  }

  return value;
};
