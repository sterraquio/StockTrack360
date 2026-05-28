"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { classNames } from "@/utils/classNames";
import { hasPermission, ROLES } from "@/utils/permissions";
import { APP_ROUTES } from "@/utils/routes";

export function Sidebar({ role = ROLES.ADMIN }) {
  const pathname = usePathname();
  const items = APP_ROUTES.filter((item) => hasPermission(role, item.permission));

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-secondary text-slate-300 lg:flex">
      <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
          ST
        </span>
        <span className="text-xl font-bold tracking-tight text-white">
          StockTrack360
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {items.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              className={classNames(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-150 hover:bg-slate-800 hover:text-white",
                active && "bg-primary text-white hover:bg-primary",
              )}
              href={item.href}
              key={item.href}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10 text-xs font-bold">
                {item.marker}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-800 p-4 text-xs text-slate-400">
        Rol activo: {role}
      </div>
    </aside>
  );
}
