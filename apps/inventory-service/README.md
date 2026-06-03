# Inventory Service

Servicio de productos, inventario y movimientos.

## Responsabilidades implementadas

- Productos y categorias predefinidas.
- Stock actual y stock minimo.
- Entradas, salidas e historial de movimientos.
- Reglas de SKU, eliminacion controlada y stock no negativo.
- Validacion de JWT y roles `ADMINISTRADOR` / `USUARIO`.
- Actualizacion sincronica de stock junto con el movimiento.

## Rutas internas

```txt
GET    /internal/products
GET    /internal/products/:id
POST   /internal/products
PATCH  /internal/products/:id
DELETE /internal/products/:id
GET    /internal/categories
POST   /internal/categories
POST   /internal/movements/entries
POST   /internal/movements/exits
GET    /internal/movements
```

## Ejecucion local

```sh
pnpm --filter @stocktrack360/inventory-service dev
```

Puerto objetivo: `4002`.

## Estado

Fase 6 implementada con almacenamiento en memoria para ejecucion academica local. La persistencia en PostgreSQL/Supabase queda pendiente para la integracion final si el equipo define credenciales y cliente de base de datos.
