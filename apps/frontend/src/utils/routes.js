import { PERMISSIONS } from "./permissions";

export const APP_ROUTES = [
  {
    label: "Dashboard",
    href: "/dashboard",
    marker: "DB",
    permission: PERMISSIONS.VIEW_DASHBOARD,
  },
  {
    label: "Productos",
    href: "/productos",
    marker: "PR",
    permission: PERMISSIONS.MANAGE_PRODUCTS,
  },
  {
    label: "Inventario",
    href: "/inventario",
    marker: "IN",
    permission: PERMISSIONS.VIEW_INVENTORY,
  },
  {
    label: "Movimientos",
    href: "/movimientos",
    marker: "MV",
    permission: PERMISSIONS.REGISTER_MOVEMENTS,
  },
  {
    label: "Alertas",
    href: "/alertas",
    marker: "AL",
    permission: PERMISSIONS.VIEW_ALERTS,
  },
  {
    label: "Reportes",
    href: "/reportes",
    marker: "RP",
    permission: PERMISSIONS.VIEW_REPORTS,
  },
  {
    label: "Usuarios",
    href: "/usuarios",
    marker: "US",
    permission: PERMISSIONS.MANAGE_USERS,
  },
];

export const PUBLIC_ROUTES = {
  login: "/login",
};
