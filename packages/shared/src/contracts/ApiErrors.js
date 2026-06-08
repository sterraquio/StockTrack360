export const apiErrorShape = {
  message: "Mensaje legible para usuario.",
  code: "ERROR_CODE",
  details: null,
};

export const apiErrorCodes = {
  validationError: "VALIDATION_ERROR",
  unauthorized: "UNAUTHORIZED",
  forbidden: "FORBIDDEN",
  invalidCredentials: "INVALID_CREDENTIALS",
  userInactive: "USER_INACTIVE",
  notFound: "NOT_FOUND",
  productNotFound: "PRODUCT_NOT_FOUND",
  categoryNotFound: "CATEGORY_NOT_FOUND",
  skuAlreadyExists: "SKU_ALREADY_EXISTS",
  categoryAlreadyExists: "CATEGORY_ALREADY_EXISTS",
  productHasStock: "PRODUCT_HAS_STOCK",
  insufficientStock: "INSUFFICIENT_STOCK",
  serviceUnavailable: "SERVICE_UNAVAILABLE",
  internalError: "INTERNAL_ERROR",
};
