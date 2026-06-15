import {
  parseNullableDate,
  parseNullableNonNegativeInteger,
  parsePositiveInteger,
  readOptionalQueryString,
  requireBodyObject,
  requireNonEmptyString,
  validateUuid,
  validationError,
} from "../utils/validation.js";

const normalizeSku = (value) => requireNonEmptyString(value, "sku").toUpperCase();

export const validateProductId = (id) => validateUuid(id, "id");

export const validateListProductsQuery = (query) => {
  const search = readOptionalQueryString(query, "search");
  const sku = readOptionalQueryString(query, "sku");
  const categoryId = readOptionalQueryString(query, "categoryId");

  return {
    search,
    sku: sku ? sku.toUpperCase() : null,
    categoryId: categoryId ? validateUuid(categoryId, "categoryId") : null,
    page: parsePositiveInteger(query.page, "page", { defaultValue: 1 }),
    pageSize: parsePositiveInteger(query.pageSize, "pageSize", {
      defaultValue: 10,
      maxValue: 100,
    }),
  };
};

export const validateCreateProductPayload = (payload) => {
  const body = requireBodyObject(payload);

  return {
    name: requireNonEmptyString(body.name, "name"),
    sku: normalizeSku(body.sku),
    categoryId: validateUuid(body.categoryId, "categoryId"),
    expirationDate: parseNullableDate(body.expirationDate, "expirationDate"),
    minimumStock: parseNullableNonNegativeInteger(body.minimumStock, "minimumStock"),
  };
};

export const validateUpdateProductPayload = (payload) => {
  const body = requireBodyObject(payload);
  const forbiddenFields = ["sku", "availableStock", "id"].filter((field) =>
    Object.prototype.hasOwnProperty.call(body, field),
  );

  if (forbiddenFields.length > 0) {
    throw validationError("No se permite modificar este campo.", {
      fields: forbiddenFields,
    });
  }

  const updates = {};

  if (Object.prototype.hasOwnProperty.call(body, "name")) {
    updates.name = requireNonEmptyString(body.name, "name");
  }

  if (Object.prototype.hasOwnProperty.call(body, "categoryId")) {
    updates.categoryId = validateUuid(body.categoryId, "categoryId");
  }

  if (Object.prototype.hasOwnProperty.call(body, "expirationDate")) {
    updates.expirationDate = parseNullableDate(body.expirationDate, "expirationDate");
  }

  if (Object.prototype.hasOwnProperty.call(body, "minimumStock")) {
    updates.minimumStock = parseNullableNonNegativeInteger(
      body.minimumStock,
      "minimumStock",
    );
  }

  if (Object.keys(updates).length === 0) {
    throw validationError("Debes enviar al menos un campo editable.", {
      allowedFields: ["name", "categoryId", "expirationDate", "minimumStock"],
    });
  }

  return updates;
};
