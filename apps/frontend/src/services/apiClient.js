import { USER_MESSAGES } from "@/utils/messages";
import { ApiClientError } from "./apiError";
import { getAuthToken } from "./authStorage";
import { buildApiUrl } from "./apiUtils";

export async function apiRequest(path, options = {}) {
  const {
    auth = true,
    body,
    headers = {},
    method = "GET",
    query,
    ...fetchOptions
  } = options;

  const requestHeaders = buildHeaders({ auth, body, headers });
  const requestOptions = {
    ...fetchOptions,
    method,
    headers: requestHeaders,
  };

  if (body !== undefined && body !== null) {
    requestOptions.body = isFormData(body) ? body : JSON.stringify(body);
  }

  const response = await fetch(buildApiUrl(path, query), requestOptions);

  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new ApiClientError({
      code: data?.code,
      details: data?.details,
      message: data?.message ?? USER_MESSAGES.saveError,
      status: response.status,
    });
  }

  return data;
}

function buildHeaders({ auth, body, headers }) {
  const requestHeaders = { ...headers };

  if (body !== undefined && body !== null && !isFormData(body)) {
    setHeaderIfMissing(requestHeaders, "Content-Type", "application/json");
  }

  if (auth !== false) {
    const token = getAuthToken();

    if (token) {
      setHeaderIfMissing(requestHeaders, "Authorization", `Bearer ${token}`);
    }
  }

  return requestHeaders;
}

function setHeaderIfMissing(headers, name, value) {
  const exists = Object.keys(headers).some(
    (headerName) => headerName.toLowerCase() === name.toLowerCase(),
  );

  if (!exists) {
    headers[name] = value;
  }
}

function isFormData(value) {
  return typeof FormData !== "undefined" && value instanceof FormData;
}
