"use client";

import { hasPermission } from "@/utils/permissions";
import { useAuthSession } from "./AuthSessionContext";

export function PermissionGate({ children, fallback = null, permission }) {
  const { role } = useAuthSession();

  if (!permission || hasPermission(role, permission)) {
    return children;
  }

  return fallback;
}
