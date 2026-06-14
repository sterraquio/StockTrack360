# API Gateway

Punto unico de entrada para el frontend.

Responsabilidades objetivo:

- Exponer rutas `/api/auth/*`, `/api/inventory/*`, `/api/alerts/*` y `/api/reports/*`.
- Redirigir peticiones a los servicios internos por HTTP.
- Centralizar CORS, manejo de errores y reenvio de JWT.

Estado actual: gateway base implementado para Fase 4.

## Fase 4

El gateway tiene un servidor Express en `src/server.js` y proxy HTTP hacia los
servicios internos.

- Puerto por defecto: `4000`.
- Rutas publicas registradas bajo `/api`.
- CORS configurable con `CORS_ORIGIN`.
- Validacion de JWT y roles para rutas protegidas.
- Errores normalizados con `{ message, code, details }`.
- Reenvio de metodo, query params, body JSON, `Authorization` y headers seguros.
- Respuesta `503 SERVICE_UNAVAILABLE` cuando un servicio interno no responde.

Variables requeridas en entorno local:

```txt
HOST=127.0.0.1
PORT=4000
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=
SERVICE_TIMEOUT_MS=5000
AUTH_SERVICE_URL=http://localhost:4001
INVENTORY_SERVICE_URL=http://localhost:4002
REPORTING_ALERTS_SERVICE_URL=http://localhost:4003
```

Comandos:

```bash
pnpm --filter @stocktrack360/api-gateway dev
pnpm --filter @stocktrack360/api-gateway lint
```
