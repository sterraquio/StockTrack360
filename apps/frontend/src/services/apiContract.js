export const API_CONTRACT = {
  auth: {
    login: { method: "POST", path: "/api/auth/login" },
    me: { method: "GET", path: "/api/auth/me" },
    logout: { method: "POST", path: "/api/auth/logout" },
  },
  users: {
    list: { method: "GET", path: "/api/auth/users" },
    create: { method: "POST", path: "/api/auth/users" },
    update: { method: "PATCH", path: "/api/auth/users/:id" },
  },
  products: {
    list: { method: "GET", path: "/api/inventory/products" },
    detail: { method: "GET", path: "/api/inventory/products/:id" },
    create: { method: "POST", path: "/api/inventory/products" },
    update: { method: "PATCH", path: "/api/inventory/products/:id" },
    delete: { method: "DELETE", path: "/api/inventory/products/:id" },
  },
  categories: {
    list: { method: "GET", path: "/api/inventory/categories" },
  },
  movements: {
    list: { method: "GET", path: "/api/inventory/movements" },
    createEntry: { method: "POST", path: "/api/inventory/movements/entries" },
    createExit: { method: "POST", path: "/api/inventory/movements/exits" },
  },
  alerts: {
    lowStock: { method: "GET", path: "/api/alerts/low-stock" },
    expired: { method: "GET", path: "/api/alerts/expired" },
    expiringSoon: { method: "GET", path: "/api/alerts/expiring-soon" },
  },
  reports: {
    dashboard: { method: "GET", path: "/api/reports/dashboard" },
    lowStock: { method: "GET", path: "/api/reports/low-stock" },
    expiringProducts: { method: "GET", path: "/api/reports/expiring-products" },
    topExits: { method: "GET", path: "/api/reports/top-exits" },
    movementsByPeriod: {
      method: "GET",
      path: "/api/reports/movements-by-period",
    },
  },
};

export const API_ERROR_SHAPE = {
  message: "Mensaje legible para usuario.",
  code: "ERROR_CODE",
  details: null,
};
