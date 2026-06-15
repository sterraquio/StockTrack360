# Fase 13 - Pruebas manuales integrales

Fecha de validacion: 2026-06-15

## Alcance

Esta fase valida flujos completos del MVP desde el API Gateway y disponibilidad de las rutas principales del frontend. No cambia contratos ni agrega funcionalidades.

Apps involucradas:

- `apps/frontend`
- `apps/api-gateway`
- `apps/auth-service`
- `apps/inventory-service`
- `apps/reporting-alerts-service`
- `packages/shared`

## Entorno usado

Variables frontend locales confirmadas:

```txt
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:4000
NEXT_PUBLIC_AUTH_MOCK_ENABLED=false
NEXT_PUBLIC_DATA_MOCK_ENABLED=false
```

Variables backend locales confirmadas sin imprimir secretos:

- Gateway con `JWT_SECRET`, URLs internas y CORS configurados.
- Servicios con `SUPABASE_URL`, `SUPABASE_SECRET_KEY` y `JWT_SECRET` configurados.
- `SUPABASE_SERVICE_ROLE_KEY` queda vacia porque se usa `SUPABASE_SECRET_KEY`.

Los servidores se levantaron con:

```bash
pnpm dev:all
```

Servicios disponibles:

- Frontend: `http://localhost:3000`
- Gateway: `http://127.0.0.1:4000`
- Auth Service: `http://127.0.0.1:4001`
- Inventory Service: `http://127.0.0.1:4002`
- Reporting Alerts Service: `http://127.0.0.1:4003`

## Validaciones automaticas previas

| Comando | Resultado |
| --- | --- |
| `pnpm -r lint` | Cumple |
| `pnpm validate:contracts` | Cumple |
| `pnpm --filter @stocktrack360/frontend build` | Cumple con red disponible para `next/font` |
| `pnpm dev:all` | Cumple |

Nota: en el sandbox de Codex, el primer build fallo por falta de red al descargar fuentes de Google mediante `next/font`. Al repetir con red disponible, el build finalizo correctamente.

## Pruebas de lectura y permisos

| Caso | Ruta / flujo | Resultado |
| --- | --- | --- |
| Login incorrecto | `POST /api/auth/login` | `401 INVALID_CREDENTIALS` |
| Login administrador | `POST /api/auth/login` | `200` |
| Login usuario operativo | `POST /api/auth/login` | `200` |
| Usuario autenticado | `GET /api/auth/me` | `200` |
| Listar usuarios como admin | `GET /api/auth/users` | `200`, total observado: 4 |
| Listar usuarios como usuario | `GET /api/auth/users` | `403 FORBIDDEN` |
| Listar categorias | `GET /api/inventory/categories` | `200`, total observado: 8 |
| Listar productos | `GET /api/inventory/products` | `200`, total observado: 7 |
| Listar movimientos | `GET /api/inventory/movements` | `200`, total observado: 12 |
| Alertas stock bajo | `GET /api/alerts/low-stock` | `200`, total observado: 2 |
| Alertas vencidos | `GET /api/alerts/expired` | `200`, total observado: 0 |
| Alertas proximos 7 dias | `GET /api/alerts/expiring-soon?days=7` | `200`, total observado: 2 |
| Alertas proximos 30 dias | `GET /api/alerts/expiring-soon?days=30` | `200`, total observado: 4 |
| Dashboard | `GET /api/reports/dashboard` | `200` |
| Reporte stock bajo | `GET /api/reports/low-stock` | `200`, total observado: 2 |
| Reporte vencimientos | `GET /api/reports/expiring-products?days=30` | `200`, total observado: 4 |
| Reporte mas salidas | `GET /api/reports/top-exits?limit=10` | `200`, total observado: 4 |
| Reporte movimientos periodo | `GET /api/reports/movements-by-period?groupBy=day` | `200`, total observado: 1 |

## Pruebas de escritura controladas

Estas pruebas dejaron datos de evidencia con prefijo de Fase 13.

Datos creados:

```txt
Usuario: fase13.20260615194225@stocktrack360.local
Producto SKU: F13-20260615194225
Producto eliminado con stock 0: F13-DEL-20260615194557
```

| Caso | Resultado |
| --- | --- |
| Crear usuario como administrador | `201`, rol `USUARIO` |
| Rechazar usuario duplicado | `409 EMAIL_ALREADY_EXISTS` |
| Editar usuario creado | `200`, usuario queda `INACTIVE` |
| Rechazar crear producto con rol `USUARIO` | `403 FORBIDDEN` |
| Crear producto como administrador | `201`, SKU `F13-20260615194225` |
| Rechazar SKU duplicado | `409 SKU_ALREADY_EXISTS` |
| Editar producto como administrador | `200` |
| Buscar producto por SKU exacto | `200`, total observado: 1 |
| Registrar entrada como usuario | `201`, cantidad 5 |
| Registrar salida como usuario | `201`, cantidad 2 |
| Rechazar salida insuficiente | `409 INSUFFICIENT_STOCK` |
| Consultar historial por producto | `200`, total observado: 2 |
| Rechazar eliminar producto con stock mayor a 0 | `409 PRODUCT_HAS_STOCK` |
| Crear producto temporal con stock 0 | `201`, SKU `F13-DEL-20260615194557` |
| Eliminar producto temporal con stock 0 | `200`, `Producto eliminado correctamente.` |
| Logout administrador | `200`, `Sesion cerrada correctamente.` |
| Sesion invalida sin token | `401 UNAUTHORIZED` |

El producto de evidencia queda con stock disponible mayor a 0 para conservar la prueba de bloqueo de eliminacion y los movimientos asociados.

## Disponibilidad de rutas frontend

Con `pnpm dev:all`, las rutas principales respondieron correctamente:

| Ruta | Resultado |
| --- | --- |
| `/login` | `200` |
| `/dashboard` | `200` |
| `/usuarios` | `200` |
| `/productos` | `200` |
| `/inventario` | `200` |
| `/movimientos` | `200` |
| `/alertas` | `200` |
| `/reportes` | `200` |

## Checklist funcional por historia

| Historia | Estado | Evidencia |
| --- | --- | --- |
| HU-01 Login correcto/incorrecto | Cumple | Login admin/usuario `200`; login incorrecto `401` |
| HU-02 Logout/sesion invalida | Cumple | Logout `200`; `GET /api/auth/me` sin token `401` |
| HU-03 Restriccion por rol | Cumple | Usuario operativo recibe `403` en usuarios y creacion de productos |
| HU-04 Registrar usuarios | Cumple | Usuario Fase 13 creado |
| HU-05 Consultar usuarios | Cumple | `GET /api/auth/users` admin `200` |
| HU-06 Editar usuarios | Cumple | Usuario Fase 13 queda `INACTIVE` |
| HU-07 Registrar productos | Cumple | Producto Fase 13 creado |
| HU-08 Categorias predefinidas | Cumple | 8 categorias listadas |
| HU-09 Editar productos | Cumple | Producto Fase 13 editado |
| HU-10 Consultar productos | Cumple | Listado y busqueda por SKU `200` |
| HU-11 Eliminar productos | Cumple | Bloqueo con stock `409`; eliminacion con stock 0 `200` |
| HU-12 Inventario general | Cumple | Listado productos `200`; frontend `/inventario` `200` |
| HU-13 Buscar productos | Cumple | Busqueda SKU exacto `200`, total 1 |
| HU-14 Filtrar por categoria | Cumple por API | Categorias y productos responden; filtro visual disponible en `/inventario` |
| HU-15 Registrar entrada | Cumple | Entrada Fase 13 `201` |
| HU-16 Registrar salida | Cumple | Salida Fase 13 `201`; insuficiente `409` |
| HU-17 Historial | Cumple | Historial por producto total 2 |
| HU-18 Stock bajo | Cumple | Alerta stock bajo `200` |
| HU-19 Vencidos | Cumple | Alerta vencidos `200` |
| HU-20 Proximos a vencer | Cumple | Alertas 7/30 dias `200` |
| HU-21 Dashboard | Cumple | Dashboard `200` |
| HU-22 Reporte stock bajo | Cumple | Reporte stock bajo `200` |
| HU-23 Reporte vencimientos | Cumple | Reporte vencimientos `200` |
| HU-24 Reporte mas salidas | Cumple | Reporte top salidas `200` |
| HU-25 Producto con stock integrado | Cumple | Listado de productos usa stock disponible integrado |

## Evidencia pendiente para exposicion

Si el docente solicita evidencia visual, capturar pantallas con las apps levantadas:

1. Login correcto e incorrecto.
2. Dashboard.
3. Usuarios admin y acceso denegado para usuario.
4. Productos: crear, editar y bloqueo por stock.
5. Inventario con busqueda y filtro.
6. Movimientos: entrada, salida e historial.
7. Alertas 7/30 dias, vencidos y stock bajo.
8. Reportes.

No se deben capturar ni publicar tokens JWT, claves Supabase ni contrasenas reales.
