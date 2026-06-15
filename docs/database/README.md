# Base de datos - Fase 3

Esta carpeta contiene los scripts versionados para preparar la persistencia real de StockTrack360 en PostgreSQL/Supabase.

## Archivos

- `schema.sql`: crea tablas, constraints, indices, triggers de inmutabilidad y la funcion RPC atomica para movimientos.
- `seed.sql`: inserta usuarios base y categorias predefinidas. Solo contiene hashes bcrypt, no contrasenas en texto plano.

## Orden de ejecucion

1. Abrir el proyecto en Supabase.
2. Ir a SQL Editor.
3. Ejecutar completo `docs/database/schema.sql`.
4. Ejecutar completo `docs/database/seed.sql`.

No pegar ni guardar la contrasena de la base de datos, `SUPABASE_SECRET_KEY` ni `SUPABASE_SERVICE_ROLE_KEY` en archivos del repositorio. Las apps backend deben leer esas claves desde sus `.env` locales.

## Validaciones sugeridas

Verificar tablas oficiales:

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('users', 'categories', 'products', 'inventory_movements')
order by table_name;
```

Verificar usuarios semilla sin exponer hashes:

```sql
select email, role, status
from public.users
order by email;
```

Verificar categorias:

```sql
select name, requires_expiration_date
from public.categories
order by name;
```

Verificar constraints principales:

```sql
select conname
from pg_constraint
where conrelid in (
  'public.users'::regclass,
  'public.categories'::regclass,
  'public.products'::regclass,
  'public.inventory_movements'::regclass
)
order by conname;
```

Verificar que la funcion atomica exista:

```sql
select proname, proacl
from pg_proc
where proname = 'register_inventory_movement';
```

Verificar permisos directos revocados para clientes publicos y concedidos al backend:

```sql
select grantee, table_name, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in ('users', 'categories', 'products', 'inventory_movements')
  and grantee in ('anon', 'authenticated', 'service_role')
order by grantee, table_name, privilege_type;
```

Prueba tecnica opcional de la funcion atomica en una transaccion con rollback:

```sql
begin;

insert into public.products (name, sku, category_id, minimum_stock)
select 'Producto prueba RPC', 'TEST-RPC', id, 2
from public.categories
where name = 'Otros'
on conflict (sku) do update
set name = excluded.name
returning id;

select *
from public.register_inventory_movement(
  (select id from public.products where sku = 'TEST-RPC'),
  (select id from public.users where email = 'admin@stocktrack360.local'),
  'ENTRADA',
  5
);

rollback;
```

## Decisiones de seguridad

- RLS queda deshabilitado en estas tablas para el MVP porque el acceso a datos se hara solo desde backend con clave privada y validaciones propias de JWT/RBAC.
- El script revoca permisos directos al pseudo-rol `public` y a los roles `anon` y `authenticated` de Supabase cuando esos roles existen.
- El script concede permisos de tablas y ejecucion de la funcion RPC al rol `service_role` cuando existe, para que las apps backend puedan usar la clave privada de Supabase.
- El frontend no debe usar Supabase directamente ni variables `NEXT_PUBLIC_SUPABASE_*` para consultar datos.
- `email` y `sku` quedan protegidos por triggers para conservar su inmutabilidad.
- `available_stock` y cantidades de movimientos tienen checks para impedir stock negativo y cantidades invalidas.
- La funcion `register_inventory_movement` bloquea el producto con `for update`, valida stock suficiente y guarda el movimiento en la misma transaccion.
