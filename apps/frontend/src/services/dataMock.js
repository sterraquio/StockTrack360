"use client";

import { ApiClientError } from "./apiError";
import { getAuthUser } from "./authStorage";

const DATA_MOCK_STORAGE_KEY = "stocktrack360.dataMockState.v1";
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

const CATEGORY_FOOD_ID = "cat-alimentos-bebidas";
const CATEGORY_CLEANING_ID = "cat-aseo-hogar";
const CATEGORY_HEALTH_ID = "cat-salud-cuidado";
const CATEGORY_STATIONERY_ID = "cat-papeleria";
const CATEGORY_HARDWARE_ID = "cat-ferreteria";

export function isDataMockEnabled() {
  return process.env.NEXT_PUBLIC_DATA_MOCK_ENABLED === "true";
}

export async function mockListUsers(query) {
  const state = readState();
  const search = normalizeText(query?.search);
  const role = query?.role;
  const status = query?.status;

  const users = state.users
    .filter((user) => !search || includesText(user.name, search) || includesText(user.email, search))
    .filter((user) => !role || user.role === role)
    .filter((user) => !status || user.status === status)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));

  return paginate(users, query);
}

export async function mockCreateUser(payload) {
  const state = readState();
  const email = String(payload?.email ?? "").trim().toLowerCase();
  const now = new Date().toISOString();

  if (state.users.some((user) => user.email.toLowerCase() === email)) {
    throwMockError({
      code: "EMAIL_ALREADY_EXISTS",
      message: "Ya existe un usuario con ese correo.",
      status: 409,
    });
  }

  const user = {
    id: buildId("user"),
    name: String(payload?.name ?? "").trim(),
    email,
    role: payload?.role ?? "USUARIO",
    status: payload?.status ?? "ACTIVE",
    createdAt: now,
    updatedAt: now,
  };

  state.users.push(user);
  writeState(state);

  return user;
}

export async function mockUpdateUser(id, payload) {
  const state = readState();
  const user = state.users.find((item) => item.id === id);

  if (!user) {
    throwMockError({
      code: "USER_NOT_FOUND",
      message: "Usuario no encontrado.",
      status: 404,
    });
  }

  user.name = payload?.name ?? user.name;
  user.role = payload?.role ?? user.role;
  user.status = payload?.status ?? user.status;
  user.updatedAt = new Date().toISOString();

  writeState(state);

  return user;
}

export async function mockListProducts(query) {
  const state = readState();
  const search = normalizeText(query?.search);
  const sku = normalizeText(query?.sku);
  const categoryId = query?.categoryId;

  const products = state.products
    .filter((product) => !search || includesText(product.name, search))
    .filter((product) => !sku || normalizeText(product.sku) === sku)
    .filter((product) => !categoryId || product.category?.id === categoryId)
    .sort((left, right) => left.name.localeCompare(right.name));

  return paginate(products, query);
}

export async function mockGetProductById(id) {
  const product = readState().products.find((item) => item.id === id);

  if (!product) {
    throwMockError({
      code: "PRODUCT_NOT_FOUND",
      message: "Producto no encontrado.",
      status: 404,
    });
  }

  return product;
}

export async function mockCreateProduct(payload) {
  const state = readState();
  const category = findCategory(state, payload?.categoryId);
  const sku = String(payload?.sku ?? "").trim().toUpperCase();
  const now = new Date().toISOString();

  if (state.products.some((product) => product.sku.toUpperCase() === sku)) {
    throwMockError({
      code: "SKU_ALREADY_EXISTS",
      message: "Ya existe un producto con ese SKU.",
      status: 409,
    });
  }

  const product = {
    id: buildId("product"),
    name: String(payload?.name ?? "").trim(),
    sku,
    category: toProductCategory(category),
    expirationDate: payload?.expirationDate || null,
    minimumStock: toNullableNumber(payload?.minimumStock),
    availableStock: 0,
    createdAt: now,
    updatedAt: now,
  };

  state.products.push(product);
  writeState(state);

  return product;
}

export async function mockUpdateProduct(id, payload) {
  const state = readState();
  const product = state.products.find((item) => item.id === id);

  if (!product) {
    throwMockError({
      code: "PRODUCT_NOT_FOUND",
      message: "Producto no encontrado.",
      status: 404,
    });
  }

  if (payload?.categoryId) {
    product.category = toProductCategory(findCategory(state, payload.categoryId));
  }

  product.name = payload?.name ?? product.name;
  product.expirationDate = payload?.expirationDate || null;
  product.minimumStock = toNullableNumber(payload?.minimumStock);
  product.updatedAt = new Date().toISOString();

  writeState(state);

  return product;
}

export async function mockDeleteProduct(id) {
  const state = readState();
  const product = state.products.find((item) => item.id === id);

  if (!product) {
    throwMockError({
      code: "PRODUCT_NOT_FOUND",
      message: "Producto no encontrado.",
      status: 404,
    });
  }

  if (product.availableStock > 0) {
    throwMockError({
      code: "PRODUCT_HAS_STOCK",
      message: "No se puede eliminar un producto con stock disponible.",
      status: 409,
    });
  }

  state.products = state.products.filter((item) => item.id !== id);
  writeState(state);

  return { message: "Producto eliminado correctamente." };
}

export async function mockListCategories() {
  return { items: readState().categories };
}

export async function mockListMovements(query) {
  const state = readState();
  const productId = query?.productId;
  const type = query?.type;
  const from = query?.from;
  const to = query?.to;

  const movements = state.movements
    .filter((movement) => !productId || movement.productId === productId)
    .filter((movement) => !type || movement.type === type)
    .filter((movement) => isDateInRange(movement.createdAt.slice(0, 10), from, to))
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));

  return paginate(movements, query);
}

export async function mockCreateEntry(payload) {
  return createMovement("ENTRADA", payload);
}

export async function mockCreateExit(payload) {
  return createMovement("SALIDA", payload);
}

export async function mockListLowStockAlerts(query) {
  return paginate(getLowStockAlerts(readState()), query);
}

export async function mockListExpiredAlerts(query) {
  return paginate(getExpirationAlerts(readState(), { expiredOnly: true }), query);
}

export async function mockListExpiringSoonAlerts(query) {
  return paginate(getExpirationAlerts(readState(), { days: Number(query?.days) || 30 }), query);
}

export async function mockGetDashboard(query) {
  const state = readState();
  const movementsInPeriod = filterMovementsByPeriod(state.movements, query);

  return {
    totalProducts: state.products.length,
    lowStockProducts: getLowStockAlerts(state).length,
    expiredProducts: getExpirationAlerts(state, { expiredOnly: true }).length,
    expiringSoonProducts: getExpirationAlerts(state, { days: 30 }).length,
    movementsInPeriod: movementsInPeriod.length,
    topMovedProducts: buildTopMovedProducts(state, movementsInPeriod, "Movimientos"),
  };
}

export async function mockGetLowStockReport(query) {
  return paginate(getLowStockAlerts(readState()), query);
}

export async function mockGetExpiringProductsReport(query) {
  return paginate(getExpirationAlerts(readState(), { days: Number(query?.days) || 30 }), query);
}

export async function mockGetTopExitsReport(query) {
  const state = readState();
  const exits = filterMovementsByPeriod(state.movements, query).filter(
    (movement) => movement.type === "SALIDA",
  );
  const limit = Math.min(Number(query?.limit) || 10, 50);

  return {
    items: buildTopMovedProducts(state, exits, "Salidas").slice(0, limit),
  };
}

export async function mockGetMovementsByPeriodReport(query) {
  const groupBy = query?.groupBy || "day";
  const movements = filterMovementsByPeriod(readState().movements, query);
  const groups = new Map();

  movements.forEach((movement) => {
    const period = getPeriodKey(movement.createdAt.slice(0, 10), groupBy);
    const current = groups.get(period) ?? { period, entries: 0, exits: 0 };

    if (movement.type === "ENTRADA") {
      current.entries += movement.quantity;
    } else {
      current.exits += movement.quantity;
    }

    groups.set(period, current);
  });

  return {
    items: Array.from(groups.values()).sort((left, right) =>
      left.period.localeCompare(right.period),
    ),
  };
}

function createMovement(type, payload) {
  const state = readState();
  const product = state.products.find((item) => item.id === payload?.productId);
  const quantity = Number(payload?.quantity);

  if (!product) {
    throwMockError({
      code: "PRODUCT_NOT_FOUND",
      message: "Producto no encontrado.",
      status: 404,
    });
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    throwMockError({
      code: "VALIDATION_ERROR",
      message: "La cantidad debe ser un entero mayor a 0.",
      status: 400,
    });
  }

  if (type === "SALIDA" && quantity > product.availableStock) {
    throwMockError({
      code: "INSUFFICIENT_STOCK",
      message: "La salida no puede superar el stock disponible.",
      status: 409,
    });
  }

  product.availableStock += type === "ENTRADA" ? quantity : -quantity;
  product.updatedAt = new Date().toISOString();

  const user = getAuthUser();
  const movement = {
    id: buildId("movement"),
    productId: product.id,
    productName: product.name,
    sku: product.sku,
    userId: user?.id ?? "mock-admin-user",
    userName: user?.name ?? "Administrador",
    type,
    quantity,
    createdAt: new Date().toISOString(),
  };

  state.movements.unshift(movement);
  writeState(state);

  return movement;
}

function readState() {
  if (!canUseLocalStorage()) {
    return buildInitialState();
  }

  try {
    const stored = window.localStorage.getItem(DATA_MOCK_STORAGE_KEY);

    if (stored) {
      return JSON.parse(stored);
    }

    const state = buildInitialState();
    writeState(state);
    return state;
  } catch {
    return buildInitialState();
  }
}

function writeState(state) {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(DATA_MOCK_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be unavailable in restricted browser contexts.
  }
}

function buildInitialState() {
  const now = new Date();
  const createdAt = new Date(now.getFullYear(), now.getMonth(), 2, 9, 30).toISOString();
  const categories = [
    {
      id: CATEGORY_FOOD_ID,
      name: "Alimentos y bebidas",
      requiresExpirationDate: true,
    },
    {
      id: CATEGORY_CLEANING_ID,
      name: "Aseo y hogar",
      requiresExpirationDate: false,
    },
    {
      id: CATEGORY_HEALTH_ID,
      name: "Salud y cuidado personal",
      requiresExpirationDate: true,
    },
    {
      id: CATEGORY_STATIONERY_ID,
      name: "Papelería",
      requiresExpirationDate: false,
    },
    {
      id: CATEGORY_HARDWARE_ID,
      name: "Ferretería",
      requiresExpirationDate: false,
    },
  ];

  const products = [
    buildProduct("prod-arroz-500", "Arroz 500g", "ARR-500", categories[0], addDays(now, 120), 10, 28, createdAt),
    buildProduct("prod-leche-1l", "Leche 1L", "LEC-001", categories[0], addDays(now, 6), 12, 8, createdAt),
    buildProduct("prod-yogurt", "Yogurt natural 900g", "YOG-900", categories[0], addDays(now, -3), 8, 5, createdAt),
    buildProduct("prod-detergente", "Detergente líquido 1L", "DET-001", categories[1], null, 6, 18, createdAt),
    buildProduct("prod-alcohol", "Alcohol antiséptico 700ml", "ALC-700", categories[2], addDays(now, 24), 10, 3, createdAt),
    buildProduct("prod-cuaderno", "Cuaderno cuadriculado", "CUA-100", categories[3], null, 15, 40, createdAt),
    buildProduct("prod-tornillos", "Tornillos zincados x100", "TOR-100", categories[4], null, 5, 0, createdAt),
  ];

  return {
    categories,
    products,
    users: [
      {
        id: "mock-admin-user",
        name: "Administrador",
        email: "admin@stocktrack360.local",
        role: "ADMINISTRADOR",
        status: "ACTIVE",
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: "mock-operator-user",
        name: "Usuario Inventario",
        email: "usuario@stocktrack360.local",
        role: "USUARIO",
        status: "ACTIVE",
        createdAt,
        updatedAt: createdAt,
      },
    ],
    movements: buildInitialMovements(products, now),
  };
}

function buildProduct(id, name, sku, category, expirationDate, minimumStock, availableStock, createdAt) {
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

function buildInitialMovements(products, now) {
  return [
    buildMovement("mov-001", products[0], "ENTRADA", 20, addDays(now, -12)),
    buildMovement("mov-002", products[0], "SALIDA", 6, addDays(now, -8)),
    buildMovement("mov-003", products[1], "SALIDA", 4, addDays(now, -6)),
    buildMovement("mov-004", products[2], "SALIDA", 7, addDays(now, -4)),
    buildMovement("mov-005", products[3], "ENTRADA", 12, addDays(now, -3)),
    buildMovement("mov-006", products[4], "SALIDA", 5, addDays(now, -2)),
    buildMovement("mov-007", products[5], "ENTRADA", 30, addDays(now, -1)),
  ].sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

function buildMovement(id, product, type, quantity, date) {
  return {
    id,
    productId: product.id,
    productName: product.name,
    sku: product.sku,
    userId: "mock-admin-user",
    userName: "Administrador",
    type,
    quantity,
    createdAt: date.toISOString(),
  };
}

function getLowStockAlerts(state) {
  return state.products
    .filter(
      (product) =>
        product.minimumStock !== null &&
        product.minimumStock !== undefined &&
        product.availableStock <= product.minimumStock,
    )
    .map((product) => ({
      productId: product.id,
      name: product.name,
      sku: product.sku,
      categoryName: product.category?.name ?? "N/A",
      availableStock: product.availableStock,
      minimumStock: product.minimumStock,
    }));
}

function getExpirationAlerts(state, { days = 30, expiredOnly = false } = {}) {
  return state.products
    .filter((product) => product.expirationDate)
    .map((product) => ({
      product,
      daysUntilExpiration: getDaysUntilExpiration(product.expirationDate),
    }))
    .filter(({ daysUntilExpiration }) =>
      expiredOnly
        ? daysUntilExpiration < 0
        : daysUntilExpiration >= 0 && daysUntilExpiration <= days,
    )
    .map(({ product, daysUntilExpiration }) => ({
      productId: product.id,
      name: product.name,
      sku: product.sku,
      categoryName: product.category?.name ?? "N/A",
      expirationDate: product.expirationDate,
      daysUntilExpiration,
      status: daysUntilExpiration < 0 ? "EXPIRED" : "EXPIRING_SOON",
    }));
}

function buildTopMovedProducts(state, movements, label) {
  const totals = new Map();

  movements.forEach((movement) => {
    totals.set(movement.productId, (totals.get(movement.productId) ?? 0) + movement.quantity);
  });

  return Array.from(totals.entries())
    .map(([productId, value]) => {
      const product = state.products.find((item) => item.id === productId);

      return {
        id: `report-${productId}`,
        productId,
        name: product?.name ?? "Producto no disponible",
        sku: product?.sku ?? "N/A",
        categoryName: product?.category?.name ?? "N/A",
        value,
        label,
        metadata: {},
      };
    })
    .sort((left, right) => right.value - left.value);
}

function filterMovementsByPeriod(movements, query = {}) {
  return movements.filter((movement) =>
    isDateInRange(movement.createdAt.slice(0, 10), query.from, query.to),
  );
}

function paginate(items, query = {}) {
  const page = Math.max(Number(query?.page) || DEFAULT_PAGE, 1);
  const pageSize = Math.max(Number(query?.pageSize) || DEFAULT_PAGE_SIZE, 1);
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
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

function findCategory(state, categoryId) {
  const category = state.categories.find((item) => item.id === categoryId);

  if (!category) {
    throwMockError({
      code: "VALIDATION_ERROR",
      message: "Selecciona una categoría válida.",
      status: 400,
    });
  }

  return category;
}

function toProductCategory(category) {
  return {
    id: category.id,
    name: category.name,
  };
}

function toNullableNumber(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return Number(value);
}

function getDaysUntilExpiration(expirationDate) {
  const today = startOfDay(new Date());
  const expiration = startOfDay(new Date(`${expirationDate}T00:00:00`));

  return Math.ceil((expiration.getTime() - today.getTime()) / 86400000);
}

function isDateInRange(date, from, to) {
  return (!from || date >= from) && (!to || date <= to);
}

function getPeriodKey(date, groupBy) {
  const value = new Date(`${date}T00:00:00`);

  if (groupBy === "month") {
    return date.slice(0, 7);
  }

  if (groupBy === "week") {
    const day = value.getDay() || 7;
    value.setDate(value.getDate() - day + 1);
    return formatDate(value);
  }

  return date;
}

function normalizeText(value) {
  return String(value ?? "").trim().toLowerCase();
}

function includesText(value, search) {
  return normalizeText(value).includes(search);
}

function buildId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function startOfDay(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function throwMockError(options) {
  throw new ApiClientError(options);
}

function canUseLocalStorage() {
  return typeof window !== "undefined" && "localStorage" in window;
}
