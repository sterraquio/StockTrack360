export const apiRoutes = {
  gateway: {
    auth: {
      login: "/api/auth/login",
      me: "/api/auth/me",
      logout: "/api/auth/logout",
      users: "/api/auth/users",
      userById: "/api/auth/users/:id",
    },
    inventory: {
      products: "/api/inventory/products",
      productById: "/api/inventory/products/:id",
      categories: "/api/inventory/categories",
      movements: "/api/inventory/movements",
      movementEntries: "/api/inventory/movements/entries",
      movementExits: "/api/inventory/movements/exits",
    },
    alerts: {
      lowStock: "/api/alerts/low-stock",
      expired: "/api/alerts/expired",
      expiringSoon: "/api/alerts/expiring-soon",
    },
    reports: {
      dashboard: "/api/reports/dashboard",
      lowStock: "/api/reports/low-stock",
      expiringProducts: "/api/reports/expiring-products",
      topExits: "/api/reports/top-exits",
      movementsByPeriod: "/api/reports/movements-by-period",
    },
  },
  internal: {
    authService: {
      login: "/internal/auth/login",
      me: "/internal/auth/me",
      logout: "/internal/auth/logout",
      users: "/internal/users",
      userById: "/internal/users/:id",
    },
    inventoryService: {
      products: "/internal/products",
      productById: "/internal/products/:id",
      categories: "/internal/categories",
      movements: "/internal/movements",
      movementEntries: "/internal/movements/entries",
      movementExits: "/internal/movements/exits",
    },
    reportingAlertsService: {
      lowStockAlerts: "/internal/alerts/low-stock",
      expiredAlerts: "/internal/alerts/expired",
      expiringSoonAlerts: "/internal/alerts/expiring-soon",
      dashboardReport: "/internal/reports/dashboard",
      lowStockReport: "/internal/reports/low-stock",
      expiringProductsReport: "/internal/reports/expiring-products",
      topExitsReport: "/internal/reports/top-exits",
      movementsByPeriodReport: "/internal/reports/movements-by-period",
    },
  },
};

export const apiMethods = {
  get: "GET",
  post: "POST",
  patch: "PATCH",
  delete: "DELETE",
};
