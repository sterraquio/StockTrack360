"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { EmptyState } from "@/components/feedback";
import { Button, Loader } from "@/components/ui";
import { AuthSessionProvider } from "@/features/auth/AuthSessionContext";
import { getCurrentUser, logout } from "@/services/authService";
import { clearAuthSession, getAuthToken } from "@/services/authStorage";
import { USER_MESSAGES } from "@/utils/messages";
import { hasPermission } from "@/utils/permissions";
import {
  DEFAULT_AUTHENTICATED_ROUTE,
  getRouteByPathname,
} from "@/utils/routes";
import { Navbar } from "./Navbar.jsx";
import { PageContainer } from "./PageContainer.jsx";
import { Sidebar } from "./Sidebar.jsx";

export function AuthenticatedLayout({ children, role }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const activeRole = user?.role ?? role;
  const route = getRouteByPathname(pathname);
  const canAccessRoute =
    !route?.permission || hasPermission(activeRole, route.permission);

  useEffect(() => {
    let isActive = true;

    async function validateSession() {
      if (!getAuthToken()) {
        clearAuthSession();
        router.replace("/login");
        return;
      }

      try {
        const currentUser = await getCurrentUser();

        if (isActive) {
          setUser(currentUser);
          setIsCheckingSession(false);
        }
      } catch {
        clearAuthSession();
        router.replace("/login?session=invalid");
      }
    }

    validateSession();

    return () => {
      isActive = false;
    };
  }, [router]);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await logout();
    } catch {
      clearAuthSession();
    } finally {
      router.replace("/login");
    }
  }

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-app-bg p-4">
        <Loader label="Validando sesión..." />
      </main>
    );
  }

  return (
    <AuthSessionProvider user={user}>
      <div className="min-h-screen bg-app-bg">
        <Sidebar role={activeRole} />
        <div className="lg:pl-64">
          <Navbar
            title="Panel operativo"
            userMenu={
              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-text-heading">
                    {user?.name}
                  </p>
                  <p className="text-xs text-text-muted">{activeRole}</p>
                </div>
                <Button
                  loading={isLoggingOut}
                  onClick={handleLogout}
                  size="sm"
                  type="button"
                  variant="secondary"
                >
                  Salir
                </Button>
              </div>
            }
          />
          {canAccessRoute ? (
            children
          ) : (
            <PageContainer>
              <EmptyState
                action={
                  <Button
                    onClick={() => router.replace(DEFAULT_AUTHENTICATED_ROUTE)}
                    type="button"
                  >
                    Ir al dashboard
                  </Button>
                }
                description="Tu rol actual no permite consultar este módulo."
                icon="403"
                title={USER_MESSAGES.forbidden}
              />
            </PageContainer>
          )}
        </div>
      </div>
    </AuthSessionProvider>
  );
}
