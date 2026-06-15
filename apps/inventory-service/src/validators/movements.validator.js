import {
  parseNullableDate,
  parsePositiveInteger,
  readOptionalQueryString,
  requireBodyObject,
  validateUuid,
  validationError,
} from "../utils/validation.js";

const allowedMovementTypes = new Set(["ENTRADA", "SALIDA"]);

const normalizeMovementType = (value, fieldName = "type") => {
  if (typeof value !== "string") {
    throw validationError("Tipo de movimiento invalido.", { field: fieldName });
  }

  const type = value.trim().toUpperCase();

  if (!allowedMovementTypes.has(type)) {
    throw validationError("Tipo de movimiento invalido.", {
      field: fieldName,
      allowedValues: [...allowedMovementTypes],
    });
  }

  return type;
};

const parseMovementQuantity = (value) => {
  if (!Number.isInteger(value) || value <= 0) {
    throw validationError("La cantidad debe ser un entero mayor a 0.", {
      field: "quantity",
    });
  }

  return value;
};

export const validateListMovementsQuery = (query) => {
  const productId = readOptionalQueryString(query, "productId");
  const type = readOptionalQueryString(query, "type");
  const from = parseNullableDate(query.from, "from");
  const to = parseNullableDate(query.to, "to");

  if (from && to && from > to) {
    throw validationError("El rango de fechas no es valido.", {
      fields: ["from", "to"],
    });
  }

  return {
    productId: productId ? validateUuid(productId, "productId") : null,
    type: type ? normalizeMovementType(type) : null,
    from,
    to,
    page: parsePositiveInteger(query.page, "page", { defaultValue: 1 }),
    pageSize: parsePositiveInteger(query.pageSize, "pageSize", {
      defaultValue: 10,
      maxValue: 100,
    }),
  };
};

export const validateMovementPayload = (payload) => {
  const body = requireBodyObject(payload);

  return {
    productId: validateUuid(body.productId, "productId"),
    quantity: parseMovementQuantity(body.quantity),
  };
};

export const validateAuthenticatedUserId = (user) => {
  const userId = user?.userId || user?.sub;

  return validateUuid(userId, "userId");
};
