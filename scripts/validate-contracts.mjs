import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const rootDir = process.cwd();

const requiredPublicPaths = new Set([
  "/api/auth/login",
  "/api/auth/me",
  "/api/auth/logout",
  "/api/auth/users",
  "/api/auth/users/:id",
  "/api/inventory/products",
  "/api/inventory/products/:id",
  "/api/inventory/categories",
  "/api/inventory/movements",
  "/api/inventory/movements/entries",
  "/api/inventory/movements/exits",
  "/api/alerts/low-stock",
  "/api/alerts/expired",
  "/api/alerts/expiring-soon",
  "/api/reports/dashboard",
  "/api/reports/low-stock",
  "/api/reports/expiring-products",
  "/api/reports/top-exits",
  "/api/reports/movements-by-period",
]);

const requiredErrorCodes = new Set([
  "VALIDATION_ERROR",
  "UNAUTHORIZED",
  "FORBIDDEN",
  "INVALID_CREDENTIALS",
  "USER_INACTIVE",
  "EMAIL_ALREADY_EXISTS",
  "USER_NOT_FOUND",
  "PRODUCT_NOT_FOUND",
  "CATEGORY_NOT_FOUND",
  "SKU_ALREADY_EXISTS",
  "CATEGORY_ALREADY_EXISTS",
  "PRODUCT_HAS_STOCK",
  "INSUFFICIENT_STOCK",
  "SERVICE_UNAVAILABLE",
  "INTERNAL_ERROR",
]);

const forbiddenFrontendPatterns = [
  /localhost:4001/,
  /localhost:4002/,
  /localhost:4003/,
  /\/internal\//,
  /\/api\/users\b/,
  /\/api\/products\b/,
  /\/api\/inventory-movements\b/,
  /NEXT_PUBLIC_SUPABASE/,
];

const failures = [];

function readProjectFile(path) {
  return readFileSync(join(rootDir, path), "utf8");
}

function normalizePath(path) {
  return path.replaceAll("{id}", ":id");
}

function extractQuotedPaths(source) {
  return [...source.matchAll(/path:\s*"([^"]+)"/g)].map((match) => match[1]);
}

function extractSharedRoutePaths(source, sectionName) {
  const sectionStart = source.indexOf(`${sectionName}: {`);

  if (sectionStart === -1) {
    failures.push(`No se encontro la seccion ${sectionName} en ApiRoutes.js.`);
    return [];
  }

  const nextSectionStart = source.indexOf("\n  },", sectionStart);
  const section = source.slice(sectionStart, nextSectionStart);

  return [...section.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
}

function extractOpenApiPaths(source) {
  return [...source.matchAll(/^  (\/api\/[^:]+):$/gm)].map((match) =>
    normalizePath(match[1]),
  );
}

function listFiles(dir) {
  const absoluteDir = join(rootDir, dir);

  if (!existsSync(absoluteDir)) {
    return [];
  }

  return readdirSync(absoluteDir).flatMap((name) => {
    const absolutePath = join(absoluteDir, name);
    const relativePath = relative(rootDir, absolutePath);

    if (statSync(absolutePath).isDirectory()) {
      return listFiles(relativePath);
    }

    return relativePath;
  });
}

function assertSetContains({ actual, expected, label }) {
  for (const value of expected) {
    if (!actual.has(value)) {
      failures.push(`${label} no incluye ${value}.`);
    }
  }
}

function assertOnlyPublicGatewayPaths(paths, label) {
  for (const path of paths) {
    if (!path.startsWith("/api/")) {
      failures.push(`${label} contiene una ruta que no es publica: ${path}.`);
    }

    if (path.includes("/internal/")) {
      failures.push(`${label} contiene una ruta interna: ${path}.`);
    }

    if (!requiredPublicPaths.has(path)) {
      failures.push(`${label} contiene una ruta no oficial: ${path}.`);
    }
  }
}

function validateFrontendContracts() {
  const source = readProjectFile("apps/frontend/src/services/apiContract.js");
  const paths = extractQuotedPaths(source);
  const pathSet = new Set(paths);

  assertOnlyPublicGatewayPaths(paths, "apiContract.js");
  assertSetContains({
    actual: pathSet,
    expected: new Set([
      "/api/auth/login",
      "/api/auth/me",
      "/api/auth/logout",
      "/api/auth/users",
      "/api/auth/users/:id",
      "/api/inventory/products",
      "/api/inventory/products/:id",
      "/api/inventory/categories",
      "/api/inventory/movements",
      "/api/inventory/movements/entries",
      "/api/inventory/movements/exits",
      "/api/alerts/low-stock",
      "/api/alerts/expired",
      "/api/alerts/expiring-soon",
      "/api/reports/dashboard",
      "/api/reports/low-stock",
      "/api/reports/expiring-products",
      "/api/reports/top-exits",
      "/api/reports/movements-by-period",
    ]),
    label: "apiContract.js",
  });
}

function validateFrontendSource() {
  const files = listFiles("apps/frontend/src").filter((path) =>
    /\.(js|jsx)$/.test(path),
  );

  for (const file of files) {
    const source = readProjectFile(file);

    for (const pattern of forbiddenFrontendPatterns) {
      if (pattern.test(source)) {
        failures.push(`${file} contiene patron prohibido: ${pattern}.`);
      }
    }
  }
}

function validateSharedRoutes() {
  const source = readProjectFile("packages/shared/src/contracts/ApiRoutes.js");
  const gatewayPaths = new Set(extractSharedRoutePaths(source, "gateway"));

  assertSetContains({
    actual: gatewayPaths,
    expected: requiredPublicPaths,
    label: "packages/shared gateway routes",
  });
}

function validateOpenApi() {
  const source = readProjectFile("docs/openapi.yaml");
  const openApiPaths = new Set(extractOpenApiPaths(source));

  assertSetContains({
    actual: openApiPaths,
    expected: requiredPublicPaths,
    label: "docs/openapi.yaml",
  });
}

function validateSharedErrorCodes() {
  const source = readProjectFile("packages/shared/src/contracts/ApiErrors.js");

  for (const code of requiredErrorCodes) {
    if (!source.includes(`"${code}"`)) {
      failures.push(`ApiErrors.js no incluye ${code}.`);
    }
  }
}

function validateErrorShape() {
  const middlewareFiles = [
    "apps/api-gateway/src/middleware/error.middleware.js",
    "apps/auth-service/src/middleware/error.middleware.js",
    "apps/inventory-service/src/middleware/error.middleware.js",
    "apps/reporting-alerts-service/src/middleware/error.middleware.js",
  ];

  for (const file of middlewareFiles) {
    const source = readProjectFile(file);
    const hasNormalizedResponse =
      source.includes("message") &&
      source.includes("code") &&
      source.includes("details") &&
      source.includes(".json({ message, code, details })");

    if (!hasNormalizedResponse) {
      failures.push(`${file} no evidencia respuesta normalizada de error.`);
    }
  }
}

validateFrontendContracts();
validateFrontendSource();
validateSharedRoutes();
validateOpenApi();
validateSharedErrorCodes();
validateErrorShape();

if (failures.length > 0) {
  console.error("Validacion de contratos fallida:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log("Contratos API validados correctamente.");
}
