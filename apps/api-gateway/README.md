# API Gateway

Punto unico de entrada para el frontend.

Responsabilidades objetivo:

- Exponer rutas `/api/auth/*`, `/api/inventory/*`, `/api/alerts/*` y `/api/reports/*`.
- Redirigir peticiones a los servicios internos por HTTP.
- Centralizar CORS, manejo de errores y reenvio de JWT.

Estado actual: estructura preparada en Fase 1. La implementacion corresponde a la Fase 3.
