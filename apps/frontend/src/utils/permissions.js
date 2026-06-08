export const ROLES = {
  ADMIN: "ADMINISTRADOR",
  USER: "USUARIO",
};

export const PERMISSIONS = {
  MANAGE_USERS: "manage:users",
  DELETE_PRODUCTS: "delete:products",
  MANAGE_PRODUCTS: "manage:products",
  VIEW_PRODUCTS: "view:products",
  REGISTER_MOVEMENTS: "register:movements",
  VIEW_INVENTORY: "view:inventory",
  VIEW_ALERTS: "view:alerts",
  VIEW_DASHBOARD: "view:dashboard",
  VIEW_REPORTS: "view:reports",
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.USER]: [
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.REGISTER_MOVEMENTS,
    PERMISSIONS.VIEW_INVENTORY,
    PERMISSIONS.VIEW_ALERTS,
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_REPORTS,
  ],
};

export function hasPermission(role, permission) {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
