# Contratos API - StockTrack360

## Proposito

Este documento define el contrato entre `apps/frontend`, `apps/api-gateway` y los microservicios internos de StockTrack360. El frontend debe consumir solamente el API Gateway. El API Gateway se comunica por HTTP/REST con `auth-service`, `inventory-service` y `reporting-alerts-service`.

Los contratos permiten que los 3 integrantes trabajen en paralelo sin inventar rutas, formatos de datos, roles o errores incompatibles.

## Convenciones

- API JSON: propiedades en `camelCase`.
- Base de datos PostgreSQL/Supabase: tablas y columnas en `snake_case` y plural.
- Entidades conceptuales: `PascalCase`.
- Roles persistidos: `ADMINISTRADOR`, `USUARIO`.
- Autenticacion: `Authorization: Bearer <token>`.
- Error comun:

```json
{
  "message": "Mensaje legible para usuario.",
  "code": "ERROR_CODE",
  "details": null
}
```

- Paginacion comun:

```json
{
  "items": [],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "totalItems": 0,
    "totalPages": 0
  }
}
```

## Servicios

| App | Puerto | Responsabilidad |
| --- | --- | --- |
| `apps/frontend` | `3000` | Interfaz Next.js. Consume solo API Gateway. |
| `apps/api-gateway` | `4000` | Entrada publica, CORS, errores, autenticacion y proxy HTTP. |
| `apps/auth-service` | `4001` | Login, JWT, usuario actual, usuarios y roles. |
| `apps/inventory-service` | `4002` | Productos, categorias, stock y movimientos. |
| `apps/reporting-alerts-service` | `4003` | Alertas, dashboard y reportes. |

## Modelos base

### User

Tabla: `users`

```json
{
  "id": "uuid",
  "name": "Administrador",
  "email": "admin@stocktrack360.local",
  "role": "ADMINISTRADOR",
  "status": "ACTIVE",
  "createdAt": "2026-05-25T10:00:00.000Z",
  "updatedAt": "2026-05-25T10:00:00.000Z"
}
```

Columnas: `id`, `name`, `email`, `password_hash`, `role`, `status`, `created_at`, `updated_at`.

### Role

Valores permitidos:

```json
{
  "ADMINISTRADOR": "Administrador",
  "USUARIO": "Usuario operativo"
}
```

### Category

Tabla: `categories`

```json
{
  "id": "uuid",
  "name": "Alimentos y bebidas",
  "requiresExpirationDate": true
}
```

Columnas: `id`, `name`, `requires_expiration_date`.

### Product

Tabla: `products`

```json
{
  "id": "uuid",
  "name": "Arroz 500g",
  "sku": "ARR-500",
  "category": {
    "id": "uuid",
    "name": "Alimentos y bebidas"
  },
  "expirationDate": "2026-12-31",
  "minimumStock": 10,
  "availableStock": 25,
  "createdAt": "2026-05-25T10:00:00.000Z",
  "updatedAt": "2026-05-25T10:00:00.000Z"
}
```

Columnas: `id`, `category_id`, `name`, `sku`, `expiration_date`, `minimum_stock`, `available_stock`, `created_at`, `updated_at`.

### InventoryMovement

Tabla: `inventory_movements`

```json
{
  "id": "uuid",
  "productId": "uuid",
  "productName": "Arroz 500g",
  "sku": "ARR-500",
  "userId": "uuid",
  "userName": "Administrador",
  "type": "ENTRADA",
  "quantity": 10,
  "createdAt": "2026-05-25T10:00:00.000Z"
}
```

Columnas: `id`, `product_id`, `user_id`, `type`, `quantity`, `created_at`.

### LowStockAlert

```json
{
  "productId": "uuid",
  "name": "Arroz 500g",
  "sku": "ARR-500",
  "categoryName": "Alimentos y bebidas",
  "availableStock": 5,
  "minimumStock": 10
}
```

### ExpirationAlert

```json
{
  "productId": "uuid",
  "name": "Leche 1L",
  "sku": "LEC-001",
  "categoryName": "Alimentos y bebidas",
  "expirationDate": "2026-06-01",
  "daysUntilExpiration": 6,
  "status": "EXPIRING_SOON"
}
```

Valores de `status`: `EXPIRED`, `EXPIRING_SOON`.

### DashboardSummary

```json
{
  "totalProducts": 120,
  "lowStockProducts": 8,
  "expiredProducts": 3,
  "expiringSoonProducts": 12,
  "movementsInPeriod": 45,
  "topMovedProducts": []
}
```

### ReportItem

```json
{
  "id": "uuid",
  "productId": "uuid",
  "name": "Arroz 500g",
  "sku": "ARR-500",
  "categoryName": "Alimentos y bebidas",
  "value": 25,
  "label": "Salidas",
  "metadata": {}
}
```

## Rutas internas por microservicio

### `auth-service`

```txt
POST  /internal/auth/login
GET   /internal/auth/me
POST  /internal/auth/logout
GET   /internal/users
POST  /internal/users
PATCH /internal/users/:id
```

### `inventory-service`

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

Nota: `POST /internal/categories` queda reservado para administracion tecnica o seed. No debe exponerse como CRUD de categorias en la interfaz del MVP.

### `reporting-alerts-service`

```txt
GET /internal/alerts/low-stock
GET /internal/alerts/expired
GET /internal/alerts/expiring-soon
GET /internal/reports/dashboard
GET /internal/reports/low-stock
GET /internal/reports/expiring-products
GET /internal/reports/top-exits
GET /internal/reports/movements-by-period
```

## Contratos publicos del API Gateway

### Login

- Metodo: `POST`
- Ruta publica en api-gateway: `/api/auth/login`
- Servicio interno responsable: `auth-service`
- Ruta interna del microservicio: `/internal/auth/login`
- Requiere autenticacion: No
- Roles permitidos: Publico
- Headers: `Content-Type: application/json`
- Params: Ninguno
- Query params: Ninguno
- Body:

```json
{
  "email": "admin@stocktrack360.local",
  "password": "password"
}
```

- Respuesta 200:

```json
{
  "token": "jwt",
  "user": {
    "id": "uuid",
    "name": "Administrador",
    "email": "admin@stocktrack360.local",
    "role": "ADMINISTRADOR",
    "status": "ACTIVE"
  }
}
```

- Errores posibles: `400 VALIDATION_ERROR`, `401 INVALID_CREDENTIALS`, `403 USER_INACTIVE`
- Validaciones: `email` requerido, `password` requerido.
- Notas de implementacion: el mensaje de login fallido debe ser generico: `Correo o contrasena incorrectos.`

### Obtener usuario actual

- Metodo: `GET`
- Ruta publica en api-gateway: `/api/auth/me`
- Servicio interno responsable: `auth-service`
- Ruta interna del microservicio: `/internal/auth/me`
- Requiere autenticacion: Si
- Roles permitidos: `ADMINISTRADOR`, `USUARIO`
- Headers: `Authorization: Bearer <token>`
- Params: Ninguno
- Query params: Ninguno
- Body: Ninguno
- Respuesta 200: `User`
- Errores posibles: `401 UNAUTHORIZED`, `403 FORBIDDEN`
- Validaciones: JWT valido.
- Notas de implementacion: el gateway puede validar formato/presencia y el auth-service valida identidad.

### Logout

- Metodo: `POST`
- Ruta publica en api-gateway: `/api/auth/logout`
- Servicio interno responsable: `auth-service`
- Ruta interna del microservicio: `/internal/auth/logout`
- Requiere autenticacion: Si
- Roles permitidos: `ADMINISTRADOR`, `USUARIO`
- Headers: `Authorization: Bearer <token>`
- Params: Ninguno
- Query params: Ninguno
- Body: Ninguno
- Respuesta 200:

```json
{
  "message": "Sesion cerrada correctamente."
}
```

- Errores posibles: `401 UNAUTHORIZED`
- Validaciones: JWT valido.
- Notas de implementacion: si JWT es stateless, logout limpia sesion en frontend.

### Listar usuarios

- Metodo: `GET`
- Ruta publica en api-gateway: `/api/auth/users`
- Servicio interno responsable: `auth-service`
- Ruta interna del microservicio: `/internal/users`
- Requiere autenticacion: Si
- Roles permitidos: `ADMINISTRADOR`
- Headers: `Authorization: Bearer <token>`
- Params: Ninguno
- Query params: `search`, `role`, `status`, `page`, `pageSize`
- Body: Ninguno
- Respuesta 200: respuesta paginada de `User`
- Errores posibles: `400 VALIDATION_ERROR`, `401 UNAUTHORIZED`, `403 FORBIDDEN`
- Validaciones: `role` en `ADMINISTRADOR` o `USUARIO`; paginacion valida.
- Notas de implementacion: no exponer `passwordHash`.

### Crear usuario

- Metodo: `POST`
- Ruta publica en api-gateway: `/api/auth/users`
- Servicio interno responsable: `auth-service`
- Ruta interna del microservicio: `/internal/users`
- Requiere autenticacion: Si
- Roles permitidos: `ADMINISTRADOR`
- Headers: `Authorization: Bearer <token>`, `Content-Type: application/json`
- Params: Ninguno
- Query params: Ninguno
- Body:

```json
{
  "name": "Usuario Inventario",
  "email": "inventario@stocktrack360.local",
  "password": "password",
  "role": "USUARIO",
  "status": "ACTIVE"
}
```

- Respuesta 201: `User`
- Errores posibles: `400 VALIDATION_ERROR`, `401 UNAUTHORIZED`, `403 FORBIDDEN`, `409 EMAIL_ALREADY_EXISTS`
- Validaciones: nombre, correo, contrasena, rol y estado obligatorios; correo unico; rol permitido.
- Notas de implementacion: guardar contrasena como hash, nunca en texto plano.

### Editar usuario

- Metodo: `PATCH`
- Ruta publica en api-gateway: `/api/auth/users/:id`
- Servicio interno responsable: `auth-service`
- Ruta interna del microservicio: `/internal/users/:id`
- Requiere autenticacion: Si
- Roles permitidos: `ADMINISTRADOR`
- Headers: `Authorization: Bearer <token>`, `Content-Type: application/json`
- Params: `id`
- Query params: Ninguno
- Body:

```json
{
  "name": "Usuario Inventario",
  "role": "USUARIO",
  "status": "ACTIVE"
}
```

- Respuesta 200: `User`
- Errores posibles: `400 VALIDATION_ERROR`, `401 UNAUTHORIZED`, `403 FORBIDDEN`, `404 USER_NOT_FOUND`
- Validaciones: no permitir modificar `email`; rol y estado deben ser valores permitidos.
- Notas de implementacion: si se requiere cambio de contrasena, debe definirse un contrato separado.

### Listar productos

- Metodo: `GET`
- Ruta publica en api-gateway: `/api/inventory/products`
- Servicio interno responsable: `inventory-service`
- Ruta interna del microservicio: `/internal/products`
- Requiere autenticacion: Si
- Roles permitidos: `ADMINISTRADOR`, `USUARIO`
- Headers: `Authorization: Bearer <token>`
- Params: Ninguno
- Query params: `search`, `sku`, `categoryId`, `page`, `pageSize`
- Body: Ninguno
- Respuesta 200:

```json
{
  "items": [],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "totalItems": 0,
    "totalPages": 0
  }
}
```

- Errores posibles: `400 VALIDATION_ERROR`, `401 UNAUTHORIZED`, `403 FORBIDDEN`
- Validaciones: busqueda por nombre parcial, SKU exacto, `page >= 1`, `pageSize <= 100`.
- Notas de implementacion: el frontend debe usar esta misma ruta para productos e inventario general.

### Obtener producto por ID

- Metodo: `GET`
- Ruta publica en api-gateway: `/api/inventory/products/:id`
- Servicio interno responsable: `inventory-service`
- Ruta interna del microservicio: `/internal/products/:id`
- Requiere autenticacion: Si
- Roles permitidos: `ADMINISTRADOR`, `USUARIO`
- Headers: `Authorization: Bearer <token>`
- Params: `id`
- Query params: Ninguno
- Body: Ninguno
- Respuesta 200: `Product`
- Errores posibles: `401 UNAUTHORIZED`, `403 FORBIDDEN`, `404 PRODUCT_NOT_FOUND`
- Validaciones: `id` obligatorio.
- Notas de implementacion: usado para detalle y formulario de edicion.

### Crear producto

- Metodo: `POST`
- Ruta publica en api-gateway: `/api/inventory/products`
- Servicio interno responsable: `inventory-service`
- Ruta interna del microservicio: `/internal/products`
- Requiere autenticacion: Si
- Roles permitidos: `ADMINISTRADOR`
- Headers: `Authorization: Bearer <token>`, `Content-Type: application/json`
- Params: Ninguno
- Query params: Ninguno
- Body:

```json
{
  "name": "Arroz 500g",
  "sku": "ARR-500",
  "categoryId": "uuid",
  "expirationDate": "2026-12-31",
  "minimumStock": 10
}
```

- Respuesta 201: `Product`
- Errores posibles: `400 VALIDATION_ERROR`, `401 UNAUTHORIZED`, `403 FORBIDDEN`, `409 SKU_ALREADY_EXISTS`
- Validaciones: nombre, SKU y categoria obligatorios; SKU unico; stock inicial `0`.
- Notas de implementacion: no aceptar `availableStock` desde frontend.

### Editar producto

- Metodo: `PATCH`
- Ruta publica en api-gateway: `/api/inventory/products/:id`
- Servicio interno responsable: `inventory-service`
- Ruta interna del microservicio: `/internal/products/:id`
- Requiere autenticacion: Si
- Roles permitidos: `ADMINISTRADOR`
- Headers: `Authorization: Bearer <token>`, `Content-Type: application/json`
- Params: `id`
- Query params: Ninguno
- Body:

```json
{
  "name": "Arroz 500g",
  "categoryId": "uuid",
  "expirationDate": "2026-12-31",
  "minimumStock": 10
}
```

- Respuesta 200: `Product`
- Errores posibles: `400 VALIDATION_ERROR`, `401 UNAUTHORIZED`, `403 FORBIDDEN`, `404 PRODUCT_NOT_FOUND`
- Validaciones: no permitir modificar `sku`.
- Notas de implementacion: cambios parciales con `PATCH`.

### Eliminar producto

- Metodo: `DELETE`
- Ruta publica en api-gateway: `/api/inventory/products/:id`
- Servicio interno responsable: `inventory-service`
- Ruta interna del microservicio: `/internal/products/:id`
- Requiere autenticacion: Si
- Roles permitidos: `ADMINISTRADOR`
- Headers: `Authorization: Bearer <token>`
- Params: `id`
- Query params: Ninguno
- Body: Ninguno
- Respuesta 200:

```json
{
  "message": "Producto eliminado correctamente."
}
```

- Errores posibles: `401 UNAUTHORIZED`, `403 FORBIDDEN`, `404 PRODUCT_NOT_FOUND`, `409 PRODUCT_HAS_STOCK`
- Validaciones: solo eliminar si `availableStock === 0`.
- Notas de implementacion: el frontend debe usar confirmacion antes de llamar esta ruta.

### Listar categorias

- Metodo: `GET`
- Ruta publica en api-gateway: `/api/inventory/categories`
- Servicio interno responsable: `inventory-service`
- Ruta interna del microservicio: `/internal/categories`
- Requiere autenticacion: Si
- Roles permitidos: `ADMINISTRADOR`, `USUARIO`
- Headers: `Authorization: Bearer <token>`
- Params: Ninguno
- Query params: Ninguno
- Body: Ninguno
- Respuesta 200:

```json
{
  "items": []
}
```

- Errores posibles: `401 UNAUTHORIZED`, `403 FORBIDDEN`
- Validaciones: ninguna especial.
- Notas de implementacion: categorias predefinidas del MVP.

### Crear categoria

- Metodo: `POST`
- Ruta publica en api-gateway: `/api/inventory/categories`
- Servicio interno responsable: `inventory-service`
- Ruta interna del microservicio: `/internal/categories`
- Requiere autenticacion: Si
- Roles permitidos: `ADMINISTRADOR`
- Headers: `Authorization: Bearer <token>`, `Content-Type: application/json`
- Params: Ninguno
- Query params: Ninguno
- Body:

```json
{
  "name": "Nueva categoria",
  "requiresExpirationDate": true
}
```

- Respuesta 201: `Category`
- Errores posibles: `400 VALIDATION_ERROR`, `401 UNAUTHORIZED`, `403 FORBIDDEN`, `409 CATEGORY_ALREADY_EXISTS`
- Validaciones: nombre obligatorio y unico.
- Notas de implementacion: no debe usarse desde la interfaz del MVP. Se documenta solo como endpoint tecnico/admin para seed o preparacion.

### Registrar entrada

- Metodo: `POST`
- Ruta publica en api-gateway: `/api/inventory/movements/entries`
- Servicio interno responsable: `inventory-service`
- Ruta interna del microservicio: `/internal/movements/entries`
- Requiere autenticacion: Si
- Roles permitidos: `ADMINISTRADOR`, `USUARIO`
- Headers: `Authorization: Bearer <token>`, `Content-Type: application/json`
- Params: Ninguno
- Query params: Ninguno
- Body:

```json
{
  "productId": "uuid",
  "quantity": 10
}
```

- Respuesta 201: `InventoryMovement`
- Errores posibles: `400 VALIDATION_ERROR`, `401 UNAUTHORIZED`, `403 FORBIDDEN`, `404 PRODUCT_NOT_FOUND`
- Validaciones: cantidad entera mayor a `0`.
- Notas de implementacion: movimiento y actualizacion de stock deben ser atomicos.

### Registrar salida

- Metodo: `POST`
- Ruta publica en api-gateway: `/api/inventory/movements/exits`
- Servicio interno responsable: `inventory-service`
- Ruta interna del microservicio: `/internal/movements/exits`
- Requiere autenticacion: Si
- Roles permitidos: `ADMINISTRADOR`, `USUARIO`
- Headers: `Authorization: Bearer <token>`, `Content-Type: application/json`
- Params: Ninguno
- Query params: Ninguno
- Body:

```json
{
  "productId": "uuid",
  "quantity": 5
}
```

- Respuesta 201: `InventoryMovement`
- Errores posibles: `400 VALIDATION_ERROR`, `401 UNAUTHORIZED`, `403 FORBIDDEN`, `404 PRODUCT_NOT_FOUND`, `409 INSUFFICIENT_STOCK`
- Validaciones: cantidad entera mayor a `0`; salida no supera stock disponible.
- Notas de implementacion: stock nunca debe quedar negativo.

### Listar movimientos

- Metodo: `GET`
- Ruta publica en api-gateway: `/api/inventory/movements`
- Servicio interno responsable: `inventory-service`
- Ruta interna del microservicio: `/internal/movements`
- Requiere autenticacion: Si
- Roles permitidos: `ADMINISTRADOR`, `USUARIO`
- Headers: `Authorization: Bearer <token>`
- Params: Ninguno
- Query params: `productId`, `type`, `from`, `to`, `page`, `pageSize`
- Body: Ninguno
- Respuesta 200: respuesta paginada de `InventoryMovement`
- Errores posibles: `400 VALIDATION_ERROR`, `401 UNAUTHORIZED`, `403 FORBIDDEN`
- Validaciones: `type` en `ENTRADA` o `SALIDA`; fechas validas; paginacion valida.
- Notas de implementacion: ordenar del mas reciente al mas antiguo.

### Alertas de stock bajo

- Metodo: `GET`
- Ruta publica en api-gateway: `/api/alerts/low-stock`
- Servicio interno responsable: `reporting-alerts-service`
- Ruta interna del microservicio: `/internal/alerts/low-stock`
- Requiere autenticacion: Si
- Roles permitidos: `ADMINISTRADOR`, `USUARIO`
- Headers: `Authorization: Bearer <token>`
- Params: Ninguno
- Query params: `page`, `pageSize`
- Body: Ninguno
- Respuesta 200: respuesta paginada de `LowStockAlert`
- Errores posibles: `401 UNAUTHORIZED`, `403 FORBIDDEN`
- Validaciones: `minimumStock IS NOT NULL` y `availableStock <= minimumStock`.
- Notas de implementacion: no persistir alertas en tabla para el MVP.

### Alertas de productos vencidos

- Metodo: `GET`
- Ruta publica en api-gateway: `/api/alerts/expired`
- Servicio interno responsable: `reporting-alerts-service`
- Ruta interna del microservicio: `/internal/alerts/expired`
- Requiere autenticacion: Si
- Roles permitidos: `ADMINISTRADOR`, `USUARIO`
- Headers: `Authorization: Bearer <token>`
- Params: Ninguno
- Query params: `page`, `pageSize`
- Body: Ninguno
- Respuesta 200: respuesta paginada de `ExpirationAlert`
- Errores posibles: `401 UNAUTHORIZED`, `403 FORBIDDEN`
- Validaciones: `expirationDate < today`.
- Notas de implementacion: productos sin vencimiento no generan alerta.

### Alertas de productos proximos a vencer

- Metodo: `GET`
- Ruta publica en api-gateway: `/api/alerts/expiring-soon`
- Servicio interno responsable: `reporting-alerts-service`
- Ruta interna del microservicio: `/internal/alerts/expiring-soon`
- Requiere autenticacion: Si
- Roles permitidos: `ADMINISTRADOR`, `USUARIO`
- Headers: `Authorization: Bearer <token>`
- Params: Ninguno
- Query params: `days=7|30`, `page`, `pageSize`
- Body: Ninguno
- Respuesta 200: respuesta paginada de `ExpirationAlert`
- Errores posibles: `400 VALIDATION_ERROR`, `401 UNAUTHORIZED`, `403 FORBIDDEN`
- Validaciones: `days` debe ser `7` o `30`; default recomendado `30`.
- Notas de implementacion: debe distinguir vencidos de proximos a vencer.

### Dashboard

- Metodo: `GET`
- Ruta publica en api-gateway: `/api/reports/dashboard`
- Servicio interno responsable: `reporting-alerts-service`
- Ruta interna del microservicio: `/internal/reports/dashboard`
- Requiere autenticacion: Si
- Roles permitidos: `ADMINISTRADOR`, `USUARIO`
- Headers: `Authorization: Bearer <token>`
- Params: Ninguno
- Query params: `from`, `to`
- Body: Ninguno
- Respuesta 200: `DashboardSummary`
- Errores posibles: `400 VALIDATION_ERROR`, `401 UNAUTHORIZED`, `403 FORBIDDEN`, `503 SERVICE_UNAVAILABLE`
- Validaciones: rango de fechas valido.
- Notas de implementacion: puede devolver datos parciales si un calculo no critico falla.

### Reporte de stock bajo

- Metodo: `GET`
- Ruta publica en api-gateway: `/api/reports/low-stock`
- Servicio interno responsable: `reporting-alerts-service`
- Ruta interna del microservicio: `/internal/reports/low-stock`
- Requiere autenticacion: Si
- Roles permitidos: `ADMINISTRADOR`, `USUARIO`
- Headers: `Authorization: Bearer <token>`
- Params: Ninguno
- Query params: `page`, `pageSize`
- Body: Ninguno
- Respuesta 200: respuesta paginada de `LowStockAlert`
- Errores posibles: `401 UNAUTHORIZED`, `403 FORBIDDEN`
- Validaciones: mismas reglas de alerta de stock bajo.
- Notas de implementacion: puede reutilizar consulta de alertas.

### Reporte de productos proximos a vencer

- Metodo: `GET`
- Ruta publica en api-gateway: `/api/reports/expiring-products`
- Servicio interno responsable: `reporting-alerts-service`
- Ruta interna del microservicio: `/internal/reports/expiring-products`
- Requiere autenticacion: Si
- Roles permitidos: `ADMINISTRADOR`, `USUARIO`
- Headers: `Authorization: Bearer <token>`
- Params: Ninguno
- Query params: `days=7|30`, `page`, `pageSize`
- Body: Ninguno
- Respuesta 200: respuesta paginada de `ExpirationAlert`
- Errores posibles: `400 VALIDATION_ERROR`, `401 UNAUTHORIZED`, `403 FORBIDDEN`
- Validaciones: `days` debe ser `7` o `30`; default recomendado `30`.
- Notas de implementacion: no incluye productos sin `expirationDate`.

### Reporte de productos con mas salidas

- Metodo: `GET`
- Ruta publica en api-gateway: `/api/reports/top-exits`
- Servicio interno responsable: `reporting-alerts-service`
- Ruta interna del microservicio: `/internal/reports/top-exits`
- Requiere autenticacion: Si
- Roles permitidos: `ADMINISTRADOR`, `USUARIO`
- Headers: `Authorization: Bearer <token>`
- Params: Ninguno
- Query params: `from`, `to`, `limit`
- Body: Ninguno
- Respuesta 200:

```json
{
  "items": []
}
```

- Errores posibles: `400 VALIDATION_ERROR`, `401 UNAUTHORIZED`, `403 FORBIDDEN`
- Validaciones: rango de fechas valido; `limit <= 50`.
- Notas de implementacion: contar solo movimientos `SALIDA`.

### Reporte de movimientos por periodo

- Metodo: `GET`
- Ruta publica en api-gateway: `/api/reports/movements-by-period`
- Servicio interno responsable: `reporting-alerts-service`
- Ruta interna del microservicio: `/internal/reports/movements-by-period`
- Requiere autenticacion: Si
- Roles permitidos: `ADMINISTRADOR`, `USUARIO`
- Headers: `Authorization: Bearer <token>`
- Params: Ninguno
- Query params: `from`, `to`, `groupBy=day|week|month`
- Body: Ninguno
- Respuesta 200:

```json
{
  "items": [
    {
      "period": "2026-05-01",
      "entries": 10,
      "exits": 8
    }
  ]
}
```

- Errores posibles: `400 VALIDATION_ERROR`, `401 UNAUTHORIZED`, `403 FORBIDDEN`
- Validaciones: rango de fechas valido; `groupBy` en `day`, `week` o `month`.
- Notas de implementacion: usado por dashboard y reportes.

## Usuarios

El modulo de usuarios es requerido por el MVP y su contrato publico oficial queda bajo `/api/auth/users` porque el servicio responsable es `auth-service`:

```txt
GET   /api/auth/users
POST  /api/auth/users
PATCH /api/auth/users/:id
```

Responsable: `auth-service`. Roles permitidos: `ADMINISTRADOR`.

## Trabajo paralelo por integrante

- Integrante 1 (`frontend`): puede crear servicios y mocks usando las rutas publicas y modelos de este documento.
- Integrante 2 (`api-gateway`, `auth-service`): implementa autenticacion, usuarios, autorizacion y proxy a servicios.
- Integrante 3 (`inventory-service`, `reporting-alerts-service`): implementa rutas internas de inventario, alertas y reportes respetando modelos y errores.

## Checklist de contrato completo

- Cada ruta publica tiene ruta interna asociada.
- Cada endpoint define metodo, roles, headers, params, query, body, respuesta, errores y validaciones.
- El frontend no referencia URLs de microservicios internos.
- Los errores usan el formato comun.
- La paginacion usa `{ items, pagination }`.
- Las fechas usan `YYYY-MM-DD` para fechas y datetime ISO para timestamps.
- El CRUD de categorias no aparece como funcionalidad visible del MVP.
- Los roles se mantienen en `ADMINISTRADOR` y `USUARIO`.
