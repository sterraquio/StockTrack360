import { env } from "../config/env.js";
import { getServiceTarget } from "../repositories/serviceRegistry.repository.js";
import { ApiError, errorCodes } from "../utils/apiError.js";

const methodsWithoutBody = new Set(["GET", "HEAD"]);
const hopByHopHeaders = new Set([
  "connection",
  "content-length",
  "expect",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

const appendQueryParams = (url, query) => {
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => url.searchParams.append(key, String(item)));
      return;
    }

    url.searchParams.append(key, String(value));
  });
};

const hasJsonBody = (req) => {
  if (methodsWithoutBody.has(req.method)) {
    return false;
  }

  if (req.body === undefined || req.body === null) {
    return false;
  }

  if (typeof req.body !== "object") {
    return true;
  }

  return Object.keys(req.body).length > 0;
};

const buildForwardHeaders = (req, shouldForwardBody) => {
  const headers = {};

  Object.entries(req.headers).forEach(([key, value]) => {
    if (hopByHopHeaders.has(key) || value === undefined) {
      return;
    }

    if (key === "content-type" && !shouldForwardBody) {
      return;
    }

    headers[key] = Array.isArray(value) ? value.join(", ") : value;
  });

  if (shouldForwardBody && !headers["content-type"]) {
    headers["content-type"] = req.get("content-type") || "application/json";
  }

  return headers;
};

const readServiceResponse = async (response, serviceName) => {
  if (response.status === 204) {
    return null;
  }

  const responseText = await response.text();

  if (!responseText) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    if (response.ok) {
      return responseText;
    }

    throw new ApiError(
      response.status,
      errorCodes.serviceUnavailable,
      "Respuesta invalida del servicio interno.",
      {
        service: serviceName,
        statusCode: response.status,
      },
    );
  }

  try {
    return JSON.parse(responseText);
  } catch (_error) {
    throw new ApiError(
      503,
      errorCodes.serviceUnavailable,
      "Respuesta invalida del servicio interno.",
      {
        service: serviceName,
        statusCode: response.status,
      },
    );
  }
};

export const proxyToService =
  ({ serviceName, internalPath }) =>
  async (req, res, next) => {
    const target = getServiceTarget(serviceName);

    if (!target) {
      return next(
        new ApiError(
          503,
          errorCodes.serviceUnavailable,
          "Servicio interno no configurado.",
          { service: serviceName },
        ),
      );
    }

    const resolvedPath =
      typeof internalPath === "function" ? internalPath(req) : internalPath;
    const url = new URL(resolvedPath, target);
    appendQueryParams(url, req.query);

    const shouldForwardBody = hasJsonBody(req);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), env.serviceTimeoutMs);

    try {
      const response = await fetch(url, {
        method: req.method,
        headers: buildForwardHeaders(req, shouldForwardBody),
        body: shouldForwardBody ? JSON.stringify(req.body) : undefined,
        signal: controller.signal,
      });

      const payload = await readServiceResponse(response, serviceName);

      if (payload === null) {
        return res.status(response.status).end();
      }

      if (typeof payload === "string") {
        return res.status(response.status).send(payload);
      }

      return res.status(response.status).json(payload);
    } catch (error) {
      if (error instanceof ApiError) {
        return next(error);
      }

      return next(
        new ApiError(
          503,
          errorCodes.serviceUnavailable,
          "Servicio temporalmente no disponible.",
          {
            service: serviceName,
            target,
          },
        ),
      );
    } finally {
      clearTimeout(timeout);
    }
  };
