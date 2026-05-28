import { Alert } from "@/components/feedback";
import { Button, Card, Input } from "@/components/ui";
import { USER_MESSAGES } from "@/utils/messages";

export function LoginPage() {
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
        <form className="space-y-5">
          <Input
            autoComplete="email"
            label="Correo electrónico"
            name="email"
            placeholder="correo@empresa.com"
            type="email"
          />
          <Input
            autoComplete="current-password"
            label="Contraseña"
            name="password"
            placeholder="Ingresa tu contraseña"
            type="password"
          />
          <Alert variant="info">{USER_MESSAGES.invalidLogin}</Alert>
          <Button className="w-full" type="submit">
            Iniciar sesión
          </Button>
        </form>
      </Card>
    </main>
  );
}
