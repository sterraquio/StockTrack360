# Reporting Alerts Service

Servicio de alertas, dashboard y reportes basicos.

Responsabilidades objetivo:

- Alertas de stock bajo.
- Productos vencidos y proximos a vencer en 7 o 30 dias.
- Dashboard con indicadores basicos.
- Reportes de stock bajo, vencimientos, top salidas y movimientos por periodo.

Estado actual: alertas reales, dashboard y reportes basicos implementados contra
Supabase/PostgreSQL.

## Ejecucion local

El servicio ya tiene un servidor Express base en `src/server.js`.

- Puerto por defecto: `4003`.
- Rutas internas registradas bajo `/internal`.
- JWT preparado para rutas protegidas.
- Cliente Supabase preparado solo para backend.
- Errores normalizados con `{ message, code, details }`.
- Alertas de stock bajo, vencidos y proximos a vencer consumen productos desde
  Supabase con paginacion.
- Dashboard consume productos y movimientos para calcular KPIs del periodo.
- Reportes disponibles:
  - `/internal/reports/low-stock`
  - `/internal/reports/expiring-products`
  - `/internal/reports/top-exits`
  - `/internal/reports/movements-by-period`
- Las respuestas mantienen errores normalizados y validan `from`, `to`, `days`,
  `limit`, `groupBy`, `page` y `pageSize` segun contrato.

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
