# Inventory Service

Servicio de productos, inventario y movimientos.

Responsabilidades objetivo:

- Productos y categorias predefinidas.
- Stock actual y stock minimo.
- Entradas, salidas e historial de movimientos.
- Reglas de SKU, eliminacion controlada y stock no negativo.

Estado actual: productos, categorias y movimientos reales implementados hasta Fase 7.

## Ejecucion local

El servicio ya tiene un servidor Express base en `src/server.js`.

- Puerto por defecto: `4002`.
- Rutas internas registradas bajo `/internal`.
- JWT preparado para rutas protegidas.
- Cliente Supabase preparado solo para backend.
- Errores normalizados con `{ message, code, details }`.
- Productos y categorias consumen Supabase desde backend.
- Movimientos de entrada y salida usan la funcion RPC `register_inventory_movement`
  versionada en `docs/database/schema.sql` para actualizar stock y registrar historial
  en una operacion atomica.
- El historial soporta filtros por producto, tipo y rango de fechas, con paginacion.

Variables requeridas en entorno local:

```txt
HOST=127.0.0.1
PORT=4002
CORS_ORIGIN=http://localhost:3000
SUPABASE_URL=https://pdshxuzgqafjkmfsjocq.supabase.co
SUPABASE_SECRET_KEY=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
```

No guardar contrasenas ni claves privadas en Git.

Comandos:

```bash
pnpm --filter @stocktrack360/inventory-service dev
pnpm --filter @stocktrack360/inventory-service lint
```
