# Evidencia fase 11 frontend

Fecha de validacion: 2026-06-04

## Alcance

Fase 11 del plan frontend: validaciones finales y evidencias para cerrar calidad visual, funcional y academica de `apps/frontend`.

## Validaciones realizadas

| Criterio | Resultado | Evidencia |
| --- | --- | --- |
| Responsive desktop/mobile | Cumple | Layout con `Sidebar` desktop (`lg:flex`), contenido con `lg:pl-64`, `Navbar` visible en mobile y tablas con `overflow-x-auto`. |
| Sin rutas inventadas | Cumple | `apps/frontend/src/services/apiContract.js` usa rutas oficiales bajo `/api/auth`, `/api/inventory`, `/api/alerts` y `/api/reports`. |
| Sin llamadas directas a microservicios | Cumple | Busqueda en `apps/frontend/src` solo encontro `fetch` centralizado en `services/apiClient.js`; no hay referencias a `4001`, `4002`, `4003` ni `/internal`. |
| Sin componentes duplicados | Cumple | Las pantallas reutilizan componentes compartidos en `src/components`: `Button`, `Input`, `Select`, `SearchInput`, `Card`, `Modal`, `Badge`, `Table`, `Pagination`, `Alert`, `EmptyState`, `ConfirmDialog`, `KpiCard` y `StatusCell`. |
| Roles correctos | Cumple | `utils/permissions.js` conserva solo `ADMINISTRADOR` y `USUARIO`; `AuthenticatedLayout` valida acceso de ruta y `ProductsPage` valida acciones por permiso. |
| Estados UI en modulos | Cumple | Login, dashboard, usuarios, productos, inventario, movimientos, alertas y reportes cubren loading, error, empty y success segun aplique. |
| Paginacion en listados mayores a 10 | Cumple | `PAGE_SIZE = 10` y `Pagination` en usuarios, productos, inventario, movimientos, alertas y reportes paginados. |
| Mensajes estandar | Cumple | Login usa el mensaje generico oficial: `Correo o contraseña incorrectos.` |
| Lint frontend | Cumple | `pnpm --filter @stocktrack360/frontend lint` finalizo sin errores. |
| Build frontend | Cumple | `pnpm --filter @stocktrack360/frontend build` compilo correctamente en el entorno actual. |
| Servidor local | Cumple | `http://127.0.0.1:3000/login` respondio `HTTP/1.1 200 OK`. |

## Comandos ejecutados

```bash
rg -n "fetch\(|axios|localhost:4001|localhost:4002|localhost:4003|/internal/|/api/users|/api/products|/api/inventory-movements" apps/frontend/src
pnpm --filter @stocktrack360/frontend lint
pnpm --filter @stocktrack360/frontend build
pnpm --filter @stocktrack360/frontend exec next dev --hostname 127.0.0.1 --port 3000
curl -I http://127.0.0.1:3000/login
```

## Observaciones

- El intento inicial de `build` fallo cuando el entorno anterior no tenia acceso de red para descargar fuentes Geist mediante `next/font`.
- Con los permisos actuales, `build` y la validacion HTTP local finalizaron correctamente.
- No se cambiaron contratos API ni arquitectura.
- No se tocaron apps distintas a `apps/frontend` ni documentacion de evidencia.

## Pruebas manuales sugeridas

1. Iniciar el frontend con `pnpm --filter @stocktrack360/frontend dev`.
2. Probar login exitoso y login fallido.
3. Verificar redireccion a `/login?session=invalid` con sesion invalida.
4. Entrar con `ADMINISTRADOR` y revisar `/usuarios`, `/productos`, `/inventario`, `/movimientos`, `/alertas`, `/reportes` y `/dashboard`.
5. Entrar con `USUARIO` y confirmar que no pueda acceder a `/usuarios` ni eliminar productos.
6. Revisar filtros y paginacion en listados con mas de 10 registros.
7. Probar ancho mobile y desktop en login, layout autenticado, tablas y modales.
