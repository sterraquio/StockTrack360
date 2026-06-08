# Frontend

Aplicacion Next.js oficial de StockTrack360.

## Estado

La base visual del prototipo fue migrada a `apps/frontend` como app oficial del monorepo.

La app usa:

- Next.js con App Router.
- React.
- Tailwind CSS v4.
- Componentes compartidos en `src/components`.
- Rutas de modulos bajo `src/app`.

## Comandos

Desde la raiz del monorepo:

```bash
pnpm --filter @stocktrack360/frontend dev
pnpm --filter @stocktrack360/frontend lint
pnpm --filter @stocktrack360/frontend build
```

## API Gateway

El frontend debe consumir unicamente el API Gateway configurado con:

```txt
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:4000
```

No debe llamar directamente a `auth-service`, `inventory-service` ni `reporting-alerts-service`.
