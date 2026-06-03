export const HTTP_STATUS = {
  ok: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  conflict: 409,
  internalError: 500,
};

export function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(payload));
}

export function sendError(response, statusCode, code, message, details = null) {
  sendJson(response, statusCode, {
    message,
    code,
    details,
  });
}

export async function readJsonBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");

  if (!rawBody) {
    return {};
  }

  return JSON.parse(rawBody);
}

export function getBearerToken(request) {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length).trim();
}

export function parsePagination(query) {
  const page = Number(query.get("page") ?? 1);
  const pageSize = Number(query.get("pageSize") ?? 10);

  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) {
    throw createServiceError(HTTP_STATUS.badRequest, "VALIDATION_ERROR", "La paginacion no es valida.");
  }

  return { page, pageSize };
}

export function paginate(items, { page, pageSize }) {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const start = (page - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
    },
  };
}

export function createServiceError(status, code, message, details = null) {
  return {
    isServiceError: true,
    status,
    code,
    message,
    details,
  };
}
