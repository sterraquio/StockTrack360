import { USER_MESSAGES } from "@/utils/messages";

export class ApiClientError extends Error {
  constructor({
    code = "API_ERROR",
    details = null,
    message = USER_MESSAGES.saveError,
    status = 0,
  } = {}) {
    super(message);
    this.name = "ApiClientError";
    this.code = code;
    this.details = details;
    this.status = status;
  }
}
