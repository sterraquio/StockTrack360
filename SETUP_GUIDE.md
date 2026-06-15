# Guia de setup local - StockTrack360

Fecha de actualizacion: 2026-06-15

Esta guia resume los pasos para ejecutar StockTrack360 desde cero en entorno local academico sin exponer secretos.

## 1. Requisitos

- Node.js instalado.
- pnpm compatible con el `packageManager` del repositorio.
- Acceso al proyecto Supabase configurado para el MVP.
- Clave backend privada de Supabase (`SUPABASE_SECRET_KEY` o `SUPABASE_SERVICE_ROLE_KEY`).

No se debe configurar Supabase directamente en el frontend.

## 2. Instalar dependencias

Desde la raiz del monorepo:

```bash
pnpm install
```

## 3. Preparar base de datos

En Supabase SQL Editor, ejecutar en este orden:

```txt
docs/database/schema.sql
docs/database/seed.sql
```

Verificacion recomendada:

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('users', 'categories', 'products', 'inventory_movements')
order by table_name;
```

Las credenciales semilla academicas son:

```txt
admin@stocktrack360.local / Admin123*
usuario@stocktrack360.local / Usuario123*
```

No guardar la contrasena de la base de datos ni claves privadas en el repositorio.

## 4. Configurar variables de entorno

Crear archivos locales:

```bash
cp apps/api-gateway/.env.example apps/api-gateway/.env
cp apps/auth-service/.env.example apps/auth-service/.env
cp apps/inventory-service/.env.example apps/inventory-service/.env
cp apps/reporting-alerts-service/.env.example apps/reporting-alerts-service/.env
cp apps/frontend/.env.example apps/frontend/.env.local
```

### `apps/api-gateway/.env`

```txt
HOST=127.0.0.1
PORT=4000
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=<mismo valor usado por los servicios>
SERVICE_TIMEOUT_MS=5000
AUTH_SERVICE_URL=http://localhost:4001
INVENTORY_SERVICE_URL=http://localhost:4002
REPORTING_ALERTS_SERVICE_URL=http://localhost:4003
```

### `apps/auth-service/.env`

```txt
HOST=127.0.0.1
PORT=4001
CORS_ORIGIN=http://localhost:3000
SUPABASE_URL=https://pdshxuzgqafjkmfsjocq.supabase.co
SUPABASE_SECRET_KEY=<clave backend privada>
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=<mismo valor usado por gateway y servicios>
JWT_EXPIRES_IN=8h
```

### `apps/inventory-service/.env`

```txt
HOST=127.0.0.1
PORT=4002
CORS_ORIGIN=http://localhost:3000
SUPABASE_URL=https://pdshxuzgqafjkmfsjocq.supabase.co
SUPABASE_SECRET_KEY=<clave backend privada>
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=<mismo valor usado por gateway y servicios>
```

### `apps/reporting-alerts-service/.env`

```txt
HOST=127.0.0.1
PORT=4003
CORS_ORIGIN=http://localhost:3000
SUPABASE_URL=https://pdshxuzgqafjkmfsjocq.supabase.co
SUPABASE_SECRET_KEY=<clave backend privada>
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=<mismo valor usado por gateway y servicios>
```

### `apps/frontend/.env.local`

```txt
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:4000
NEXT_PUBLIC_AUTH_MOCK_ENABLED=false
NEXT_PUBLIC_DATA_MOCK_ENABLED=false
```

## 5. Ejecutar la aplicacion

Opcion recomendada desde la raiz:

```bash
pnpm dev:all
```

Opcion por app:

```bash
pnpm dev:auth
pnpm dev:inventory
pnpm dev:reporting-alerts
pnpm dev:gateway
pnpm dev:frontend
```

Abrir:

```txt
http://localhost:3000/login
```

## 6. Validar antes de entregar

```bash
pnpm -r lint
pnpm validate:contracts
pnpm --filter @stocktrack360/frontend build
```

Luego recorrer:

- Login correcto e incorrecto.
- Logout y sesion invalida.
- Usuarios con `ADMINISTRADOR`.
- Restriccion de usuarios con `USUARIO`.
- Productos, inventario, busqueda, SKU y filtros.
- Entradas, salidas e historial.
- Alertas de stock bajo, vencidos y proximos a vencer.
- Dashboard y reportes.

La validacion final registrada vive en `docs/phase-13-manual-validation.md`.

## 7. Problemas comunes

- Si el build falla descargando fuentes Geist, repetir con acceso de red disponible.
- Si el frontend no conecta, verificar `NEXT_PUBLIC_API_GATEWAY_URL`.
- Si login falla con credenciales semilla, verificar que `docs/database/seed.sql` se haya ejecutado.
- Si los servicios no consultan datos, verificar `SUPABASE_SECRET_KEY` o `SUPABASE_SERVICE_ROLE_KEY`.
- Si aparece `401`, revisar que el token JWT exista y que `JWT_SECRET` sea el mismo en gateway y servicios.
- Si aparece `403`, revisar el rol del usuario autenticado.
