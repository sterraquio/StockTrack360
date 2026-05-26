# Plan de trabajo para el equipo - StockTrack360

## 1. Objetivo

Este documento define cómo deben trabajar los 3 integrantes del equipo en la arquitectura oficial de StockTrack360:

```txt
apps/frontend
apps/api-gateway
apps/auth-service
apps/inventory-service
apps/reporting-alerts-service
packages/shared
```

El objetivo es permitir trabajo paralelo por fases, con contratos API claros y sin conflictos innecesarios entre apps.

## 2. Fuentes de verdad

Antes de programar, cada integrante debe leer:

- `docs/project-context.md`: alcance funcional, reglas de negocio, roles y arquitectura.
- `docs/api-contracts.md`: contratos entre frontend, API Gateway y servicios.
- `docs/design-system.md`: fuente visual principal para UI.
- `docs/development-phases.md`: fases oficiales.

`docs/frontend-guidelines.md` es referencia histórica del prototipo/Figma y queda subordinada a `docs/design-system.md`.

## 3. Arquitectura de trabajo

```txt
apps/frontend
  Consume solo apps/api-gateway.

apps/api-gateway
  Expone rutas publicas /api.
  Redirige a servicios internos.

apps/auth-service
  Autenticacion, usuarios, roles y permisos.

apps/inventory-service
  Productos, categorias, stock y movimientos.

apps/reporting-alerts-service
  Alertas, dashboard y reportes.

packages/shared
  Constantes, contratos, roles, errores y helpers livianos.
```

Para el MVP se usa una sola base PostgreSQL/Supabase compartida. La separación por base de datos por microservicio queda como mejora futura.

## 4. Distribución por integrante

## Integrante 1: Frontend

### Apps principales

```txt
apps/frontend
```

### Responsabilidades

- Implementar pantallas de login, dashboard, usuarios, productos, inventario, movimientos, alertas y reportes.
- Consumir únicamente rutas públicas de `apps/api-gateway`.
- Crear servicios o hooks frontend basados en `docs/api-contracts.md`.
- Reutilizar componentes compartidos en `apps/frontend/src/components`.
- Respetar `docs/design-system.md`.
- Mostrar estados `loading`, `empty`, `error` y éxito.
- Ocultar acciones no permitidas según rol, sin asumir que eso reemplaza la validación backend.

### No debe hacer

- No llamar directamente a `auth-service`, `inventory-service` ni `reporting-alerts-service`.
- No inventar rutas.
- No crear CRUD de categorías en UI.
- No crear botones, tablas, inputs, cards, badges o modales duplicados si existe un componente compartido.
- No implementar reglas críticas solo en frontend.

## Integrante 2: API Gateway y Auth

### Apps principales

```txt
apps/api-gateway
apps/auth-service
```

### Responsabilidades en `apps/api-gateway`

- Exponer rutas públicas bajo `/api`.
- Validar presencia/formato de JWT cuando aplique.
- Reenviar peticiones a servicios internos.
- Centralizar CORS.
- Normalizar errores.
- Aplicar autorización general si corresponde.

### Responsabilidades en `apps/auth-service`

- Login.
- Logout si aplica.
- Validación de credenciales.
- Generación y validación de JWT.
- Gestión de usuarios.
- Roles `ADMINISTRADOR` y `USUARIO`.
- Control de permisos de usuarios.

### No debe hacer

- No implementar lógica de inventario en auth o gateway.
- No crear roles nuevos.
- No exponer mensajes específicos de error de login.
- No guardar contraseñas en texto plano.
- No modificar contratos sin actualizar `docs/api-contracts.md` y `docs/openapi.yaml`.

## Integrante 3: Inventario, Alertas y Reportes

### Apps principales

```txt
apps/inventory-service
apps/reporting-alerts-service
```

### Responsabilidades en `apps/inventory-service`

- Productos.
- Categorías predefinidas.
- Stock actual.
- Stock mínimo.
- Fecha de vencimiento.
- Entradas y salidas.
- Historial de movimientos.
- Actualización atómica del stock.

### Responsabilidades en `apps/reporting-alerts-service`

- Alertas de stock bajo.
- Productos vencidos.
- Productos próximos a vencer en 7 y 30 días.
- Dashboard con indicadores básicos.
- Reportes de stock bajo, vencimientos, productos con más salidas y movimientos por periodo.

### No debe hacer

- No implementar autenticación o gestión de usuarios.
- No crear categorías administrables por usuarios.
- No implementar reportes financieros, compras avanzadas, ventas avanzadas o IA.
- No llamar al frontend.
- No cambiar rutas públicas sin coordinar con gateway y contratos.

## 5. Contratos API

La fuente principal es `docs/api-contracts.md`.

Reglas:

- El frontend consume solo el API Gateway.
- El API Gateway expone rutas públicas bajo `/api`.
- Los servicios internos exponen rutas bajo `/internal`.
- Las rutas públicas de usuarios son:

```txt
GET   /api/auth/users
POST  /api/auth/users
PATCH /api/auth/users/:id
```

- Las rutas antiguas sin el prefijo de dominio definido en `docs/api-contracts.md` no son contratos vigentes.

## 6. Cómo evitar conflictos

- Trabajar una tarea por rama.
- Indicar en el nombre o descripción de la tarea la app afectada.
- No modificar apps de otro integrante sin justificarlo.
- Cambios que afecten contratos deben revisarse antes de implementar UI o servicios.
- Si un cambio toca más de una app, documentar por qué es necesario.
- Mantener commits pequeños.
- Probar la app afectada y el flujo integrado cuando aplique.
- Actualizar documentación si cambia un contrato, regla o responsabilidad.

## 7. Fases resumidas

El detalle vive en `docs/development-phases.md`.

1. Fase 0: Diagnóstico.
2. Fase 1: Estructura monorepo.
3. Fase 2: Contratos API.
4. Fase 3: Frontend base.
5. Fase 4: API Gateway base.
6. Fase 5: Auth Service.
7. Fase 6: Inventory Service.
8. Fase 7: Reporting Alerts Service.
9. Fase 8: Integración.
10. Fase 9: Pruebas manuales.
11. Fase 10: Documentación y evidencias finales.

## 8. Checklist antes de entregar una tarea

- La tarea respeta `docs/project-context.md`.
- Las rutas usadas existen en `docs/api-contracts.md`.
- El frontend no llama servicios internos.
- Se respetan roles `ADMINISTRADOR` y `USUARIO`.
- No se agregó funcionalidad fuera del MVP.
- No se agregaron apps principales nuevas.
- No se introdujo Docker, Kubernetes, Kafka, RabbitMQ o Prisma.
- Los cambios visuales respetan `docs/design-system.md`.
- La documentación se actualizó si cambió contrato o arquitectura.
