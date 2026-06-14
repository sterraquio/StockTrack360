# Reporting Alerts Service

Servicio de alertas, dashboard y reportes basicos.

Responsabilidades objetivo:

- Alertas de stock bajo.
- Productos vencidos y proximos a vencer en 7 o 30 dias.
- Dashboard con indicadores basicos.
- Reportes de stock bajo, vencimientos, top salidas y movimientos por periodo.

Estado actual: estructura preparada en Fase 1. La implementacion corresponde a la Fase 6.

## Fase 2

El servicio ya tiene un servidor Express base en `src/server.js`.

- Puerto por defecto: `4003`.
- Rutas internas registradas bajo `/internal`.
- JWT preparado para rutas protegidas.
- Cliente Supabase preparado solo para backend.
- Errores normalizados con `{ message, code, details }`.
- Las rutas oficiales responden `503 SERVICE_UNAVAILABLE` hasta implementar alertas y reportes reales.

Variables requeridas en entorno local:

```txt
HOST=127.0.0.1
PORT=4003
CORS_ORIGIN=http://localhost:3000
SUPABASE_URL=https://pdshxuzgqafjkmfsjocq.supabase.co
SUPABASE_SECRET_KEY=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
```

No guardar contrasenas ni claves privadas en Git.

Comandos:

```bash
pnpm --filter @stocktrack360/reporting-alerts-service dev
pnpm --filter @stocktrack360/reporting-alerts-service lint
```
