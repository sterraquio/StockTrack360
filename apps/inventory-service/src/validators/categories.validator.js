import {
  requireBodyObject,
  requireNonEmptyString,
} from "../utils/validation.js";

export const validateCreateCategoryPayload = (payload) => {
  const body = requireBodyObject(payload);

  return {
    name: requireNonEmptyString(body.name, "name"),
    requiresExpirationDate:
      typeof body.requiresExpirationDate === "boolean"
        ? body.requiresExpirationDate
        : false,
  };
};
