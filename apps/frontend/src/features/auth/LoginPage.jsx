"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Alert } from "@/components/feedback";
import { Button, Card, Input } from "@/components/ui";
import { getCurrentUser, login } from "@/services/authService";
import { clearAuthSession, getAuthToken } from "@/services/authStorage";
import { USER_MESSAGES } from "@/utils/messages";

export function LoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [sessionNotice, setSessionNotice] = useState(() =>
    getInitialSessionNotice(),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function redirectAuthenticatedUser() {
      if (!getAuthToken()) {
        return;
      }

      try {
        await getCurrentUser();

        if (isActive) {
          router.replace("/dashboard");
        }
      } catch {
        clearAuthSession();

        if (isActive) {
          setSessionNotice(USER_MESSAGES.invalidSession);
        }
      }
    }

    redirectAuthenticatedUser();

    return () => {
      isActive = false;
    };
  }, [router]);

  function handleChange(event) {
    const { name, value } = event.target;

    setCredentials((currentCredentials) => ({
      ...currentCredentials,
      [name]: value,
    }));
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));
    setFormError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextFieldErrors = validateCredentials(credentials);

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setFormError(USER_MESSAGES.requiredFields);
      return;
    }

    setIsSubmitting(true);
    setFormError("");
    setSessionNotice("");

    try {
      await login({
        email: credentials.email.trim(),
        password: credentials.password,
      });
      router.replace("/dashboard");
    } catch {
      clearAuthSession();
      setFormError(USER_MESSAGES.invalidLogin);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-app-bg p-4">
      <Card className="w-full max-w-md p-8" variant="form">
        <div className="mb-8 text-center">
          <p className="text-2xl font-bold tracking-tight text-text-heading">
            StockTrack360
          </p>
          <p className="mt-1 text-sm text-text-muted">
            Ingresa con tus credenciales para continuar.
          </p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {sessionNotice ? (
            <Alert variant="warning">{sessionNotice}</Alert>
          ) : null}
          <Input
            autoComplete="email"
            disabled={isSubmitting}
            error={fieldErrors.email}
            label="Correo electrónico"
            name="email"
            onChange={handleChange}
            placeholder="correo@empresa.com"
            type="email"
            value={credentials.email}
          />
          <Input
            autoComplete="current-password"
            disabled={isSubmitting}
            error={fieldErrors.password}
            label="Contraseña"
            name="password"
            onChange={handleChange}
            placeholder="Ingresa tu contraseña"
            type="password"
            value={credentials.password}
          />
          {formError ? <Alert variant="error">{formError}</Alert> : null}
          <Button className="w-full" loading={isSubmitting} type="submit">
            {isSubmitting ? "Validando..." : "Iniciar sesión"}
          </Button>
        </form>
      </Card>
    </main>
  );
}

function getInitialSessionNotice() {
  if (typeof window === "undefined") {
    return "";
  }

  const params = new URLSearchParams(window.location.search);

  return params.get("session") === "invalid" ? USER_MESSAGES.invalidSession : "";
}

function validateCredentials(credentials) {
  const errors = {};

  if (!credentials.email.trim()) {
    errors.email = USER_MESSAGES.requiredFields;
  }

  if (!credentials.password) {
    errors.password = USER_MESSAGES.requiredFields;
  }

  return errors;
}
