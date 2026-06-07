// Categorías predefinidas
export const CATEGORIES = [
  { id: 1, name: "Alimentos", slug: "alimentos" },
  { id: 2, name: "Bebidas", slug: "bebidas" },
  { id: 3, name: "Productos de Limpieza", slug: "limpieza" },
  { id: 4, name: "Productos de Higiene", slug: "higiene" },
  { id: 5, name: "Salud", slug: "salud" },
  { id: 6, name: "Cosméticos", slug: "cosmeticos" },
  { id: 7, name: "Papelería", slug: "papeleria" },
  { id: 8, name: "Ferretería", slug: "ferreteria" },
  { id: 9, name: "Ropa", slug: "ropa" },
  { id: 10, name: "Electrónica", slug: "electronica" },
];

export const MOVEMENT_TYPES = {
  ENTRY: "entry",
  EXIT: "exit",
};

export const PRODUCT_STATUS = {
  AVAILABLE: "available",
  LOW_STOCK: "low_stock",
  EXPIRED: "expired",
  EXPIRING: "expiring",
};

export const ALERT_TYPES = {
  LOW_STOCK: "low_stock",
  EXPIRED: "expired",
  EXPIRING_7_DAYS: "expiring_7_days",
  EXPIRING_30_DAYS: "expiring_30_days",
};

export const USER_ROLES = {
  ADMINISTRADOR: "ADMINISTRADOR",
  USUARIO: "USUARIO",
};

export const ERROR_CODES = {
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  DUPLICATE_SKU: "DUPLICATE_SKU",
  INSUFFICIENT_STOCK: "INSUFFICIENT_STOCK",
  PRODUCT_IN_USE: "PRODUCT_IN_USE",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  INTERNAL_ERROR: "INTERNAL_ERROR",
};
