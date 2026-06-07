# Guia de ejecucion - StockTrack360

## Resumen

StockTrack360 es un monorepo academico para gestion de inventario. La estructura oficial del MVP esta organizada en:

- `apps/frontend`
- `apps/api-gateway`
- `apps/auth-service`
- `apps/inventory-service`
- `apps/reporting-alerts-service`
- `packages/shared`

El frontend debe consumir solo el API Gateway. Las rutas publicas vigentes se documentan en `docs/api-contracts.md` y `docs/openapi.yaml`.

## Requisitos

- Node.js 18 o superior
- pnpm
- Git

## Instalacion

Desde la raiz del repositorio:

```bash
pnpm install
```

## Ejecucion en desarrollo

### Frontend

```bash
pnpm dev:frontend
```

Puerto objetivo:

```txt
http://localhost:3000
```

### API Gateway

```bash
pnpm dev:gateway
```

Puerto objetivo:

```txt
http://localhost:4000
```

### Auth Service

```bash
pnpm dev:auth
```

Puerto objetivo:

```txt
http://localhost:4001
```

### Inventory Service

```bash
pnpm dev:inventory
```

Puerto objetivo:

```txt
http://localhost:4002
```

### Reporting Alerts Service

```bash
pnpm dev:reporting-alerts
```

Puerto objetivo:

```txt
http://localhost:4003
```

### Todas las apps

```bash
pnpm dev:all
```

## Verificacion basica

1. Instalar dependencias con `pnpm install`.
2. Ejecutar `pnpm dev:frontend`.
3. Abrir `http://localhost:3000`.
4. Revisar las rutas y contratos esperados en `docs/api-contracts.md`.

## Puertos oficiales

| App | Puerto | Responsabilidad |
| --- | --- | --- |
| `apps/frontend` | `3000` | Interfaz Next.js. Consume solo API Gateway. |
| `apps/api-gateway` | `4000` | Entrada publica bajo `/api`. |
| `apps/auth-service` | `4001` | Login, JWT, usuarios y roles. |
| `apps/inventory-service` | `4002` | Productos, categorias, stock y movimientos. |
| `apps/reporting-alerts-service` | `4003` | Alertas, dashboard y reportes. |

## Notas de arquitectura

- No usar la carpeta historica `stock-track-360`; el frontend oficial vive en `apps/frontend`.
- No agregar endpoints publicos directamente en `apps/frontend/src/app/api` para reemplazar al API Gateway.
- No llamar servicios internos desde el frontend.
- Las rutas publicas deben vivir bajo `/api` en `apps/api-gateway`.
- Las rutas internas de servicios deben vivir bajo `/internal`.

## Documentacion relacionada

- `README.md`
- `docs/project-context.md`
- `docs/api-contracts.md`
- `docs/openapi.yaml`
- `docs/development-phases.md`
- `docs/team-work-plan.md`
