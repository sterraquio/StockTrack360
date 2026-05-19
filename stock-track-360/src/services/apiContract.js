export const API_CONTRACT = {
  auth: {
    login: { method: "POST", path: "/api/auth/login" },
    me: { method: "GET", path: "/api/auth/me" },
    logout: { method: "POST", path: "/api/auth/logout" },
  },
  users: {
    list: { method: "GET", path: "/api/users" },
    create: { method: "POST", path: "/api/users" },
    update: { method: "PATCH", path: "/api/users/:id" },
  },
  products: {
    list: { method: "GET", path: "/api/products" },
    create: { method: "POST", path: "/api/products" },
    update: { method: "PATCH", path: "/api/products/:id" },
    delete: { method: "DELETE", path: "/api/products/:id" },
  },
  movements: {
    list: { method: "GET", path: "/api/inventory-movements" },
    createEntry: { method: "POST", path: "/api/inventory-movements/entries" },
    createExit: { method: "POST", path: "/api/inventory-movements/exits" },
  },
  alerts: {
    lowStock: { method: "GET", path: "/api/alerts/low-stock" },
    expired: { method: "GET", path: "/api/alerts/expired" },
    expiring: { method: "GET", path: "/api/alerts/expiring" },
  },
  reports: {
    lowStock: { method: "GET", path: "/api/reports/low-stock" },
    expiration: { method: "GET", path: "/api/reports/expiration" },
    topExits: { method: "GET", path: "/api/reports/top-exits" },
  },
};

export const API_ERROR_SHAPE = {
  message: "Mensaje legible para usuario.",
  code: "ERROR_CODE",
  details: null,
};
