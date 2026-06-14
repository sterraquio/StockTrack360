export const errorCodes = {
  validationError: "VALIDATION_ERROR",
  unauthorized: "UNAUTHORIZED",
  forbidden: "FORBIDDEN",
  notFound: "NOT_FOUND",
  productNotFound: "PRODUCT_NOT_FOUND",
  categoryNotFound: "CATEGORY_NOT_FOUND",
  skuAlreadyExists: "SKU_ALREADY_EXISTS",
  categoryAlreadyExists: "CATEGORY_ALREADY_EXISTS",
  productHasStock: "PRODUCT_HAS_STOCK",
  serviceUnavailable: "SERVICE_UNAVAILABLE",
  internalError: "INTERNAL_ERROR",
};

export class ApiError extends Error {
  constructor(statusCode, code, message, details = null) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}
