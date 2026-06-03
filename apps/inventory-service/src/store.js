import { randomUUID } from "node:crypto";
import { createServiceError, HTTP_STATUS, paginate, parsePagination } from "./http.js";

const MOVEMENT_TYPES = new Set(["ENTRADA", "SALIDA"]);
const DAY_MS = 24 * 60 * 60 * 1000;

const now = new Date();
const createdAt = new Date(now.getFullYear(), now.getMonth(), 2, 9, 30).toISOString();

const categories = [
  { id: "cat-food", name: "Alimentos y bebidas", requiresExpirationDate: true },
  { id: "cat-cleaning", name: "Aseo y hogar", requiresExpirationDate: false },
  { id: "cat-health", name: "Salud y cuidado personal", requiresExpirationDate: true },
  { id: "cat-stationery", name: "Papeleria", requiresExpirationDate: false },
  { id: "cat-hardware", name: "Ferreteria", requiresExpirationDate: false },
];

const products = [
  buildProduct("prod-arroz-500", "Arroz 500g", "ARR-500", categories[0], addDays(now, 120), 10, 28),
  buildProduct("prod-leche-1l", "Leche 1L", "LEC-001", categories[0], addDays(now, 6), 12, 8),
  buildProduct("prod-yogurt", "Yogurt natural 900g", "YOG-900", categories[0], addDays(now, -3), 8, 5),
  buildProduct("prod-detergente", "Detergente liquido 1L", "DET-001", categories[1], null, 6, 18),
  buildProduct("prod-alcohol", "Alcohol antiseptico 700ml", "ALC-700", categories[2], addDays(now, 24), 10, 3),
  buildProduct("prod-cuaderno", "Cuaderno cuadriculado", "CUA-100", categories[3], null, 15, 40),
  buildProduct("prod-tornillos", "Tornillos zincados x100", "TOR-100", categories[4], null, 5, 0),
];

const movements = [
  buildMovement("mov-001", products[0], "ENTRADA", 20, addDays(now, -12)),
  buildMovement("mov-002", products[0], "SALIDA", 6, addDays(now, -8)),
  buildMovement("mov-003", products[1], "SALIDA", 4, addDays(now, -6)),
  buildMovement("mov-004", products[2], "SALIDA", 7, addDays(now, -4)),
  buildMovement("mov-005", products[3], "ENTRADA", 12, addDays(now, -3)),
  buildMovement("mov-006", products[4], "SALIDA", 5, addDays(now, -2)),
  buildMovement("mov-007", products[5], "ENTRADA", 30, addDays(now, -1)),
].sort(sortByNewest);

export function listProducts(query) {
  const search = query.get("search")?.trim().toLowerCase();
  const sku = query.get("sku")?.trim().toLowerCase();
  const categoryId = query.get("categoryId");
  const filteredProducts = products
    .filter((product) => !search || product.name.toLowerCase().includes(search) || product.sku.toLowerCase() === search)
    .filter((product) => !sku || product.sku.toLowerCase() === sku)
    .filter((product) => !categoryId || product.category.id === categoryId);

  return paginate(filteredProducts, parsePagination(query));
}

export function getProductById(id) {
  const product = products.find((item) => item.id === id);

  if (!product) {
    throw createServiceError(HTTP_STATUS.notFound, "PRODUCT_NOT_FOUND", "Producto no encontrado.");
  }

  return product;
}

export function createProduct(payload) {
  validateProductCreate(payload);

  if (findProductBySku(payload.sku)) {
    throw createServiceError(HTTP_STATUS.conflict, "SKU_ALREADY_EXISTS", "El SKU ya esta registrado.");
  }

  const category = findCategory(payload.categoryId);
  const timestamp = new Date().toISOString();
  const product = {
    id: randomUUID(),
    name: payload.name.trim(),
    sku: payload.sku.trim().toUpperCase(),
    category: toProductCategory(category),
    expirationDate: normalizeDate(payload.expirationDate),
    minimumStock: normalizeOptionalStock(payload.minimumStock),
    availableStock: 0,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  products.push(product);

  return product;
}

export function updateProduct(id, payload) {
  if (Object.hasOwn(payload, "sku")) {
    throw createServiceError(HTTP_STATUS.badRequest, "VALIDATION_ERROR", "El SKU no se puede modificar.");
  }

  if (Object.hasOwn(payload, "availableStock")) {
    throw createServiceError(HTTP_STATUS.badRequest, "VALIDATION_ERROR", "El stock se modifica solo con movimientos.");
  }

  const product = getProductById(id);

  validateProductUpdate(payload);

  if (Object.hasOwn(payload, "name")) {
    product.name = payload.name.trim();
  }

  if (Object.hasOwn(payload, "categoryId")) {
    product.category = toProductCategory(findCategory(payload.categoryId));
  }

  if (Object.hasOwn(payload, "expirationDate")) {
    product.expirationDate = normalizeDate(payload.expirationDate);
  }

  if (Object.hasOwn(payload, "minimumStock")) {
    product.minimumStock = normalizeOptionalStock(payload.minimumStock);
  }

  product.updatedAt = new Date().toISOString();

  return product;
}

export function deleteProduct(id) {
  const product = getProductById(id);

  if (product.availableStock > 0) {
    throw createServiceError(HTTP_STATUS.conflict, "PRODUCT_HAS_STOCK", "No se puede eliminar un producto con stock disponible.");
  }

  const index = products.findIndex((item) => item.id === id);
  products.splice(index, 1);

  return { message: "Producto eliminado correctamente." };
}

export function listCategories() {
  return { items: categories };
}

export function createCategory(payload) {
  if (!payload.name?.trim()) {
    throw createServiceError(HTTP_STATUS.badRequest, "VALIDATION_ERROR", "El nombre de la categoria es obligatorio.");
  }

  if (categories.some((category) => category.name.toLowerCase() === payload.name.trim().toLowerCase())) {
    throw createServiceError(HTTP_STATUS.conflict, "CATEGORY_ALREADY_EXISTS", "La categoria ya existe.");
  }

  const category = {
    id: randomUUID(),
    name: payload.name.trim(),
    requiresExpirationDate: Boolean(payload.requiresExpirationDate),
  };

  categories.push(category);

  return category;
}

export function registerEntry(payload, user) {
  const product = getProductById(payload.productId);
  const quantity = validateMovementQuantity(payload.quantity);

  product.availableStock += quantity;
  product.updatedAt = new Date().toISOString();

  return appendMovement(product, "ENTRADA", quantity, user);
}

export function registerExit(payload, user) {
  const product = getProductById(payload.productId);
  const quantity = validateMovementQuantity(payload.quantity);

  if (quantity > product.availableStock) {
    throw createServiceError(HTTP_STATUS.conflict, "INSUFFICIENT_STOCK", "La salida no puede superar el stock disponible.");
  }

  product.availableStock -= quantity;
  product.updatedAt = new Date().toISOString();

  return appendMovement(product, "SALIDA", quantity, user);
}

export function listMovements(query) {
  const type = query.get("type");

  if (type && !MOVEMENT_TYPES.has(type)) {
    throw createServiceError(HTTP_STATUS.badRequest, "VALIDATION_ERROR", "El tipo de movimiento no es valido.");
  }

  const productId = query.get("productId");
  const from = query.get("from");
  const to = query.get("to");

  validateDateRange(from, to);

  const filteredMovements = movements
    .filter((movement) => !productId || movement.productId === productId)
    .filter((movement) => !type || movement.type === type)
    .filter((movement) => isDateInRange(movement.createdAt.slice(0, 10), from, to))
    .sort(sortByNewest);

  return paginate(filteredMovements, parsePagination(query));
}

function appendMovement(product, type, quantity, user) {
  const movement = {
    id: randomUUID(),
    productId: product.id,
    productName: product.name,
    sku: product.sku,
    userId: user.userId,
    userName: user.name ?? "Usuario autenticado",
    type,
    quantity,
    createdAt: new Date().toISOString(),
  };

  movements.unshift(movement);

  return movement;
}

function buildProduct(id, name, sku, category, expirationDate, minimumStock, availableStock) {
  return {
    id,
    name,
    sku,
    category: toProductCategory(category),
    expirationDate: expirationDate ? formatDate(expirationDate) : null,
    minimumStock,
    availableStock,
    createdAt,
    updatedAt: createdAt,
  };
}

function buildMovement(id, product, type, quantity, date) {
  return {
    id,
    productId: product.id,
    productName: product.name,
    sku: product.sku,
    userId: "auth-admin-user",
    userName: "Administrador",
    type,
    quantity,
    createdAt: date.toISOString(),
  };
}

function validateProductCreate(payload) {
  const errors = {};

  if (!payload.name?.trim()) errors.name = "El nombre es obligatorio.";
  if (!payload.sku?.trim()) errors.sku = "El SKU es obligatorio.";
  if (!payload.categoryId) errors.categoryId = "La categoria es obligatoria.";

  validateDateAndMinimumStock(payload, errors);

  if (Object.keys(errors).length > 0) {
    throw createServiceError(HTTP_STATUS.badRequest, "VALIDATION_ERROR", "Datos de producto invalidos.", errors);
  }
}

function validateProductUpdate(payload) {
  const errors = {};

  if (Object.hasOwn(payload, "name") && !payload.name?.trim()) {
    errors.name = "El nombre es obligatorio.";
  }

  if (Object.hasOwn(payload, "categoryId") && !payload.categoryId) {
    errors.categoryId = "La categoria es obligatoria.";
  }

  validateDateAndMinimumStock(payload, errors);

  if (Object.keys(errors).length > 0) {
    throw createServiceError(HTTP_STATUS.badRequest, "VALIDATION_ERROR", "Datos de producto invalidos.", errors);
  }
}

function validateDateAndMinimumStock(payload, errors) {
  if (Object.hasOwn(payload, "expirationDate") && payload.expirationDate && !isIsoDate(payload.expirationDate)) {
    errors.expirationDate = "La fecha de vencimiento debe usar formato YYYY-MM-DD.";
  }

  if (Object.hasOwn(payload, "minimumStock") && payload.minimumStock !== null && payload.minimumStock !== "") {
    const minimumStock = Number(payload.minimumStock);

    if (!Number.isInteger(minimumStock) || minimumStock < 0) {
      errors.minimumStock = "El stock minimo debe ser un entero mayor o igual a 0.";
    }
  }
}

function validateMovementQuantity(value) {
  const quantity = Number(value);

  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw createServiceError(HTTP_STATUS.badRequest, "VALIDATION_ERROR", "La cantidad debe ser un entero mayor a 0.");
  }

  return quantity;
}

function validateDateRange(from, to) {
  if ((from && !isIsoDate(from)) || (to && !isIsoDate(to))) {
    throw createServiceError(HTTP_STATUS.badRequest, "VALIDATION_ERROR", "Las fechas deben usar formato YYYY-MM-DD.");
  }

  if (from && to && from > to) {
    throw createServiceError(HTTP_STATUS.badRequest, "VALIDATION_ERROR", "El rango de fechas no es valido.");
  }
}

function findProductBySku(sku) {
  return products.find((product) => product.sku.toLowerCase() === String(sku).toLowerCase());
}

function findCategory(categoryId) {
  const category = categories.find((item) => item.id === categoryId);

  if (!category) {
    throw createServiceError(HTTP_STATUS.badRequest, "VALIDATION_ERROR", "Selecciona una categoria valida.");
  }

  return category;
}

function toProductCategory(category) {
  return {
    id: category.id,
    name: category.name,
  };
}

function normalizeOptionalStock(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return Number(value);
}

function normalizeDate(value) {
  return value ? value : null;
}

function isIsoDate(value) {
  const date = new Date(`${value}T00:00:00.000Z`);

  return /^\d{4}-\d{2}-\d{2}$/.test(String(value)) && !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function isDateInRange(date, from, to) {
  return (!from || date >= from) && (!to || date <= to);
}

function addDays(date, days) {
  return new Date(date.getTime() + days * DAY_MS);
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function sortByNewest(left, right) {
  return right.createdAt.localeCompare(left.createdAt);
}
