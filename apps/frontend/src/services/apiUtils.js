import { ApiClientError } from "./apiError";

export function buildApiUrl(path, query) {
  const baseUrl = getApiGatewayUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${baseUrl}${normalizedPath}`);

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

export function replacePathParams(path, params = {}) {
  return Object.entries(params).reduce((currentPath, [key, value]) => {
    if (value === undefined || value === null || value === "") {
      throw new ApiClientError({
        code: "MISSING_PATH_PARAM",
        message: `Falta el parametro de ruta: ${key}.`,
      });
    }

    return currentPath.replace(`:${key}`, encodeURIComponent(String(value)));
  }, path);
}

function getApiGatewayUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

  if (!baseUrl) {
    throw new ApiClientError({
      code: "API_GATEWAY_URL_MISSING",
      message: "No esta configurada la URL del API Gateway.",
    });
  }

  return baseUrl.replace(/\/+$/, "");
}
