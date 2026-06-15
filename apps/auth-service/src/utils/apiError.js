export const errorCodes = {
  validationError: "VALIDATION_ERROR",
  unauthorized: "UNAUTHORIZED",
  forbidden: "FORBIDDEN",
  invalidCredentials: "INVALID_CREDENTIALS",
  userInactive: "USER_INACTIVE",
  emailAlreadyExists: "EMAIL_ALREADY_EXISTS",
  notFound: "NOT_FOUND",
  userNotFound: "USER_NOT_FOUND",
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
