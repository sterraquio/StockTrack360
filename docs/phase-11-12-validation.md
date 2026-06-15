# Validacion de fases 11 y 12

Fecha de validacion: 2026-06-14

## Alcance

Este documento registra el cierre tecnico de:

- Fase 11: conexion del frontend al API Gateway real y desactivacion de mocks.
- Fase 12: normalizacion de errores y consistencia entre contratos, OpenAPI, backend y frontend.

## Fase 11 - Frontend contra API Gateway

Estado local esperado en `apps/frontend/.env.local`:

```txt
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:4000
NEXT_PUBLIC_AUTH_MOCK_ENABLED=false
NEXT_PUBLIC_DATA_MOCK_ENABLED=false
```

La auditoria confirma:

- Los mocks quedan apagados para validacion local real.
- Los servicios de `apps/frontend/src/services` consumen `apiRequest(...)` cuando los mocks no estan activos.
- El unico `fetch` directo en frontend esta centralizado en `apps/frontend/src/services/apiClient.js`.
- No hay referencias en `apps/frontend/src` a `localhost:4001`, `localhost:4002`, `localhost:4003` ni rutas `/internal`.
- No hay variables `NEXT_PUBLIC_SUPABASE_*` como camino de datos del MVP.
- Las rutas usadas por el frontend estan bajo `/api` y corresponden al contrato oficial.

## Fase 12 - Contratos, errores y OpenAPI

Se agrego el comando:

```bash
pnpm validate:contracts
```

La validacion automatica revisa:

- Rutas publicas de `apps/frontend/src/services/apiContract.js`.
- Rutas publicas de `packages/shared/src/contracts/ApiRoutes.js`.
- Rutas declaradas en `docs/openapi.yaml`.
- Codigos de error compartidos en `packages/shared/src/contracts/ApiErrors.js`.
- Forma normalizada de errores en middlewares backend: `{ message, code, details }`.
- Ausencia de rutas antiguas como `/api/users`, `/api/products` o `/api/inventory-movements` en frontend.

## Comandos ejecutados

```bash
rg -n "fetch\(|axios|localhost:4001|localhost:4002|localhost:4003|/internal/|/api/users|/api/products|/api/inventory-movements|NEXT_PUBLIC_SUPABASE" apps/frontend/src apps/frontend/.env.example apps/frontend/README.md
pnpm -r lint
pnpm validate:contracts
pnpm --filter @stocktrack360/frontend build
pnpm dev:all
curl -I http://127.0.0.1:3000/login
```

## Resultado

- `pnpm -r lint` finaliza sin errores.
- `pnpm validate:contracts` finaliza sin errores.
- `pnpm --filter @stocktrack360/frontend build` finaliza sin errores con acceso de red para descargar fuentes de `next/font`.
- `pnpm dev:all` levanta frontend, gateway, auth-service, inventory-service y reporting-alerts-service.
- `GET /login` en frontend responde `200 OK`.
- Las pruebas HTTP contra el API Gateway confirman:
  - `GET /api/auth/me` sin token responde `401` con `{ message, code, details }`.
  - `POST /api/auth/login` responde `200` para administrador y usuario semilla.
  - `GET /api/auth/users` responde `200` con `{ items, pagination }` para administrador.
  - `GET /api/auth/users` responde `403` con `{ message, code, details }` para usuario operativo.
  - `GET /api/inventory/categories` responde `200` con `{ items }`.
  - `GET /api/reports/dashboard` responde `200` con `DashboardSummary`.
  - Una ruta inexistente bajo `/api` responde `404` con `{ message, code, details }`.
- La conexion frontend real queda configurada por variables locales y por los servicios existentes.
- Los contratos publicos, `packages/shared` y OpenAPI quedan alineados para pruebas finales.

## Pendiente de prueba manual visual

Para validar visualmente todos los flujos se deben levantar las apps con:

```bash
pnpm dev:all
```

Luego recorrer login, usuarios, productos, inventario, movimientos, alertas, dashboard y reportes con las credenciales semilla academicas documentadas. No se deben commitear secretos ni claves privadas de Supabase.
