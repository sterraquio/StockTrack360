# Fase 1 - Revisión y alineación documental

Fecha: 2026-06-11

## Objetivo

Dejar el proyecto alineado con las fuentes oficiales antes de implementar backend real o conectar Supabase.

## Diagnóstico

- La estructura oficial del monorepo existe con `apps/frontend`, `apps/api-gateway`, `apps/auth-service`, `apps/inventory-service`, `apps/reporting-alerts-service` y `packages/shared`.
- `docs/project-context.md`, `docs/api-contracts.md`, `docs/design-system.md` y `docs/openapi.yaml` existen y cubren el alcance del MVP.
- El frontend ya tiene contratos locales para usuarios bajo `/api/auth/users`.
- `docs/openapi.yaml` ya contiene las rutas públicas de usuarios bajo `/api/auth/users` y `/api/auth/users/{id}`.
- `packages/shared/src/contracts/ApiRoutes.js` no exponía las rutas públicas de usuarios bajo `gateway.auth`.
- `packages/shared/src/contracts/ApiErrors.js` no exponía los códigos `EMAIL_ALREADY_EXISTS` y `USER_NOT_FOUND`, aunque ya estaban documentados y usados en mocks.
- La regla de productos vencidos estaba desalineada en `docs/api-contracts.md`: usaba una comparación estrictamente anterior a la fecha actual, mientras el documento maestro define vencido como fecha anterior o igual a la fecha actual.
- El mensaje genérico de login estaba escrito con una variante basada en "Usuario" en frontend/mock/evidencia y con la variante oficial `Correo o contraseña incorrectos.` en diseño y documento maestro.

## Alineaciones realizadas

- Se alineó la regla de vencidos a `expirationDate <= today` en `docs/api-contracts.md`.
- Se normalizó el mensaje genérico de login a `Correo o contraseña incorrectos.`.
- Se agregaron rutas públicas de usuarios en `packages/shared`.
- Se agregaron códigos de error compartidos faltantes para usuarios.
- Se verificó que OpenAPI ya mantiene las rutas públicas oficiales de usuarios.

## Fuera de alcance de esta fase

- No se implementó backend real.
- No se creó conexión a Supabase.
- No se crearon scripts SQL.
- No se agregaron dependencias.
- No se cambiaron contratos públicos ni rutas nuevas.
- No se modificó UI visual.

## Validación esperada

```bash
pnpm --filter @stocktrack360/shared lint
pnpm -r lint
rg -n "/api/auth/users|EMAIL_ALREADY_EXISTS|USER_NOT_FOUND" docs packages apps/frontend/src
rg -n "expirationDate" docs/api-contracts.md
```

Además, confirmar que no queden variantes antiguas del mensaje de login ni de la regla estrictamente anterior para vencidos.
