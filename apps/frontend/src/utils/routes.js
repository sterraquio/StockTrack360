import { PERMISSIONS } from "./permissions";

export const APP_ROUTES = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    permission: PERMISSIONS.VIEW_DASHBOARD,
  },
  {
    label: "Productos",
    href: "/productos",
    icon: "products",
    permission: PERMISSIONS.VIEW_PRODUCTS,
  },
  {
    label: "Inventario",
    href: "/inventario",
    icon: "inventory",
    permission: PERMISSIONS.VIEW_INVENTORY,
  },
  {
    label: "Movimientos",
    href: "/movimientos",
    icon: "movements",
    permission: PERMISSIONS.REGISTER_MOVEMENTS,
  },
  {
    label: "Alertas",
    href: "/alertas",
    icon: "alerts",
    permission: PERMISSIONS.VIEW_ALERTS,
  },
  {
    label: "Reportes",
    href: "/reportes",
    icon: "reports",
    permission: PERMISSIONS.VIEW_REPORTS,
  },
  {
    label: "Usuarios",
    href: "/usuarios",
    icon: "users",
    permission: PERMISSIONS.MANAGE_USERS,
  },
];

export const PUBLIC_ROUTES = {
  login: "/login",
};

export const DEFAULT_AUTHENTICATED_ROUTE = "/dashboard";

export function getRouteByPathname(pathname) {
  return APP_ROUTES.find((route) => {
    return pathname === route.href || pathname.startsWith(`${route.href}/`);
  });
}
