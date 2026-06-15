export const errorCodes = {
  unauthorized: "UNAUTHORIZED",
  forbidden: "FORBIDDEN",
  notFound: "NOT_FOUND",
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
