# AGENTS.md - Instrucciones para Codex y agentes de IA

## Proyecto

Este repositorio corresponde a **StockTrack360**, un MVP académico de aplicación web para gestión de inventario orientado a pequeños y medianos negocios de Colombia.

El sistema centraliza productos, usuarios, existencias, entradas, salidas, historial de movimientos, alertas operativas, dashboard y reportes básicos para mejorar el control del stock.

## Lectura obligatoria antes de modificar código

Antes de programar, refactorizar o modificar documentación técnica, Codex debe leer:

1. `docs/project-context.md`: fuente funcional principal del proyecto.
2. `docs/api-contracts.md`: fuente principal de contratos API entre frontend, gateway y servicios.
3. `docs/design-system.md`: fuente visual principal cuando la tarea afecte UI.

También debe revisar cuando aplique:

- `docs/frontend-guidelines.md`: referencia histórica del prototipo/Figma, subordinada al sistema de diseño.
- `docs/team-work-plan.md`: distribución del equipo y reglas de trabajo por apps.
- `docs/development-phases.md`: fases oficiales de implementación.
- `docs/agent-workflow.md`: forma recomendada de trabajar con Codex o agentes.
- `docs/openapi.yaml`: especificación técnica complementaria del API Gateway.

Si `docs/project-context.md` no existe, Codex debe detenerse e indicarlo antes de continuar.

Codex no debe inventar alcance, rutas, roles, módulos, apps ni reglas de negocio que no estén en la documentación oficial.

## Arquitectura oficial

StockTrack360 usa un **monorepo con enfoque de microservicios para MVP académico**.

Estructura oficial:

```txt
StockTrack360/
├── apps/
│   ├── frontend/
│   ├── api-gateway/
│   ├── auth-service/
│   ├── inventory-service/
│   └── reporting-alerts-service/
├── packages/
│   └── shared/
├── docs/
├── AGENTS.md
├── README.md
└── package.json
```

No aumentar la arquitectura a más de 5 apps principales sin aprobación explícita.

La carpeta `stock-track-360/` puede existir temporalmente como frontend legacy/prototipo pendiente de migración. No es la arquitectura oficial nueva.

## Responsabilidad de cada app

### `apps/frontend`

- Aplicación Next.js/React.
- Contiene la interfaz: login, dashboard, usuarios, productos, inventario, movimientos, alertas y reportes.
- Debe consumir únicamente `apps/api-gateway`.
- No debe llamar directamente a `auth-service`, `inventory-service` ni `reporting-alerts-service`.
- Debe respetar `docs/design-system.md` y `docs/frontend-guidelines.md`.
- Debe reutilizar componentes compartidos y evitar duplicación visual.

### `apps/api-gateway`

- Punto único de entrada para el frontend.
- Expone rutas públicas bajo `/api`.
- Redirige peticiones a servicios internos.
- Centraliza CORS, manejo de errores, validación de token y autorización general si aplica.
- Se comunica con `auth-service`, `inventory-service` y `reporting-alerts-service`.

### `apps/auth-service`

- Login y logout si aplica.
- Validación de credenciales.
- JWT.
- Usuarios.
- Roles `ADMINISTRADOR` y `USUARIO`.
- Control de permisos.
- Gestión administrativa de usuarios.

### `apps/inventory-service`

- Productos.
- Categorías predefinidas.
- Stock actual.
- Stock mínimo.
- Fecha de vencimiento.
- Entradas y salidas.
- Historial de movimientos.
- Actualización automática y atómica del stock.

### `apps/reporting-alerts-service`

- Alertas de stock bajo.
- Productos vencidos.
- Productos próximos a vencer en 7 y 30 días.
- Dashboard.
- Reportes básicos: stock bajo, vencimientos, productos con más salidas y movimientos por periodo.

### `packages/shared`

- Tipos o modelos compartidos si aplica.
- Constantes.
- Contratos API.
- Roles.
- Mensajes comunes.
- Helpers reutilizables livianos.
- No debe contener lógica de negocio pesada propia de un microservicio.

## Base de datos

Para el MVP se usa una sola base de datos PostgreSQL/Supabase compartida, con separación lógica por tablas.

Como mejora futura, cada microservicio podría tener su propia base de datos, pero eso está fuera del alcance actual.

## Tecnologías oficiales

- Frontend: React + JavaScript con Next.js.
- Backend: Next.js/JavaScript o runtime JavaScript definido por cada app del monorepo.
- Base de datos: PostgreSQL con Supabase.
- Autenticación: JWT.
- Estilos: Tailwind CSS cuando aplique en frontend.
- Documentación: README y archivos en `docs/`.

No cambiar tecnologías principales sin justificación y aprobación explícita.

## Contratos API

- El frontend debe consumir solo rutas públicas del API Gateway.
- Las rutas públicas vigentes se documentan en `docs/api-contracts.md` y `docs/openapi.yaml`.
- No inventar rutas nuevas desde frontend, gateway o servicios.
- Si una tarea requiere cambiar un contrato, actualizar primero `docs/api-contracts.md` y después `docs/openapi.yaml`.
- Las rutas públicas deben vivir bajo `/api`.
- Las rutas internas de servicios deben vivir bajo `/internal`.

Rutas de usuarios oficiales:

```txt
GET   /api/auth/users
POST  /api/auth/users
PATCH /api/auth/users/:id
```

No usar como contrato vigente rutas antiguas sin el prefijo de dominio definido en `docs/api-contracts.md`.

## Alcance funcional del MVP

El sistema sí debe incluir:

- Inicio de sesión.
- Cierre de sesión.
- Control de acceso por roles.
- Gestión de usuarios.
- Registro, consulta, edición y eliminación controlada de productos.
- Categorías predefinidas.
- Consulta general del inventario.
- Búsqueda por nombre.
- Búsqueda por SKU o código único.
- Filtro por categoría.
- Registro de entradas de inventario.
- Registro de salidas de inventario.
- Historial de movimientos.
- Alertas de stock bajo.
- Alertas de productos vencidos.
- Alertas de productos próximos a vencer en 7 días.
- Alertas de productos próximos a vencer en 30 días.
- Dashboard con indicadores básicos.
- Reportes básicos.
- Consulta integrada de producto con stock disponible.

## Fuera del alcance

Codex no debe implementar en este MVP:

- Facturación electrónica.
- Integración contable.
- Pasarelas de pago.
- Aplicación móvil nativa.
- Inteligencia artificial para predicción de demanda.
- Gestión avanzada de múltiples bodegas o sucursales.
- Lectores de código de barras.
- E-commerce.
- Gestión avanzada de compras a proveedores.
- Gestión avanzada de ventas.
- Analítica financiera avanzada.
- Creación, edición o eliminación de categorías por usuarios.
- Docker.
- Kubernetes.
- Kafka.
- RabbitMQ.
- Prisma, salvo aprobación explícita.
- Nuevas apps principales fuera de las 5 oficiales.

Si una tarea solicita algo fuera del alcance, Codex debe advertirlo antes de implementarlo.

## Roles del sistema

Los únicos roles persistidos del MVP son:

- `ADMINISTRADOR`
- `USUARIO`

### Administrador

Puede gestionar usuarios, registrar productos, editar productos, eliminar productos solo si tienen stock igual a 0, registrar entradas y salidas, consultar inventario, consultar historial, ver alertas, dashboard y reportes.

### Usuario

Puede registrar entradas y salidas, consultar productos, inventario e historial, ver alertas, dashboard y reportes básicos.

No puede gestionar usuarios, eliminar productos, modificar roles ni cambiar estados de otros usuarios.

## Reglas generales de desarrollo

Codex debe:

- Trabajar siempre con base en documentación oficial.
- Proponer plan antes de cambios grandes.
- Trabajar por fases pequeñas.
- Identificar la app afectada antes de modificar.
- No modificar múltiples apps sin justificarlo.
- Reutilizar componentes, funciones, contratos y constantes existentes.
- Mantener separación entre presentación, rutas/controladores, lógica de negocio, acceso a datos, validaciones y componentes compartidos.
- Usar `.jsx` para archivos que renderizan JSX.
- Usar `.js` para lógica pura, servicios, constantes, contratos, helpers y barrels.
- Usar `SKU` y `código único` como el mismo concepto.
- Validar permisos en backend, no solo en interfaz.
- Mantener mensajes de login genéricos.

Codex no debe:

- Crear funcionalidades fuera del MVP.
- Cambiar arquitectura sin aprobación.
- Crear componentes visuales duplicados si existe uno compartido en `apps/frontend/src/components`.
- Usar colores hardcodeados si existe token o clase del sistema de diseño.
- Dejar código muerto.
- Eliminar documentación sin justificación.
- Romper módulos de otros integrantes sin explicar impacto.
- Introducir dependencias innecesarias.

## Reglas de autenticación y seguridad

La autenticación debe usar JWT.

El token debe permitir identificar:

- Usuario autenticado.
- Rol del usuario.

El sistema debe aplicar control de acceso basado en roles. Las validaciones de permisos deben hacerse en backend.

Durante el inicio de sesión, los errores deben ser genéricos. Mensaje recomendado:

```txt
Usuario o contraseña incorrectos.
```

## Formato esperado de respuesta de Codex

Al finalizar una tarea, Codex debe responder con:

```md
## Resumen
Qué se hizo.

## Archivos modificados
- ruta/archivo

## Decisiones técnicas
Decisiones relevantes.

## Cómo probar
Pasos concretos.

## Pendientes o riesgos
Lo que falta revisar.
```
