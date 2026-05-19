# AGENTS.md - Instrucciones para Codex

## Proyecto

Este repositorio corresponde a **StockTrack360**, una aplicación web de gestión de inventario orientada a pequeños y medianos negocios de Colombia.

El sistema permite centralizar la administración de productos, usuarios, existencias, movimientos de inventario, alertas operativas, dashboard y reportes básicos, con el objetivo de mejorar el control del stock y apoyar la toma de decisiones.

## Fuente de verdad del proyecto

Antes de modificar código, Codex debe revisar primero:

- `/docs/project-context.md`

Este archivo es la fuente principal de verdad del proyecto.

También debe revisar, si existen:

- `/docs/frontend-guidelines.md`
- `/docs/design-system.md`

Para el frontend, las fuentes de verdad quedan así:

- `/docs/project-context.md`: fuente funcional principal.
- `/docs/design-system.md`: fuente visual y técnica principal.
- `/docs/frontend-guidelines.md`: referencia histórica del prototipo/Figma.
- `AGENTS.md`: reglas operativas para Codex y colaboración.

Si `/docs/project-context.md` no existe, Codex debe detenerse e indicarlo antes de continuar.

Si algún documento complementario no existe, Codex debe indicarlo, pero puede continuar usando `/docs/project-context.md` como referencia principal.

Codex no debe inventar información que no esté definida en la documentación.

## Tecnologías del proyecto

El proyecto debe desarrollarse respetando las tecnologías definidas:

- Frontend: React + JavaScript.
- Backend: Next.js + JavaScript.
- Base de datos: PostgreSQL con Supabase.
- Autenticación: JWT.
- Diseño de prototipo: Figma.
- Documentación: README y documentos dentro de `/docs`.

No cambiar estas tecnologías sin justificación explícita y sin aprobación del equipo.

## Arquitectura del proyecto

StockTrack360 debe seguir una arquitectura modular en monorepo con enfoque hacia microservicios.

Para este MVP, los módulos no deben implementarse como microservicios completamente independientes con despliegues separados. Deben organizarse lógicamente dentro del mismo repositorio, separando responsabilidades por dominio.

La arquitectura debe mantener separación clara entre:

- Presentación.
- Rutas o controladores.
- Lógica de negocio.
- Acceso a datos.
- Validaciones.
- Componentes compartidos.

Codex no debe mezclar toda la lógica del sistema en un solo archivo o módulo.

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

## Funcionalidades fuera del alcance

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
- Creación, edición o eliminación de categorías por parte de los usuarios.

Si una tarea solicita alguna funcionalidad fuera del alcance, Codex debe advertirlo antes de implementarla.

## Roles del sistema

Los roles funcionales del MVP son:

### Administrador

Puede:

- Gestionar usuarios.
- Registrar productos.
- Editar productos.
- Eliminar productos solo si tienen stock igual a 0.
- Registrar entradas y salidas.
- Consultar inventario.
- Consultar historial de movimientos.
- Ver alertas.
- Ver dashboard.
- Ver reportes.

### Usuario / Encargado de inventario

Puede:

- Registrar entradas y salidas.
- Consultar productos.
- Consultar inventario.
- Consultar historial de movimientos.
- Ver alertas.
- Ver dashboard.
- Ver reportes básicos.

No puede:

- Gestionar usuarios.
- Eliminar productos.
- Modificar roles o estados de otros usuarios.

## Reglas generales de desarrollo

Codex debe:

- Trabajar siempre con base en la documentación del proyecto.
- Usar `/docs/design-system.md` como fuente visual principal del frontend.
- Mantener el código claro, modular y mantenible.
- Reutilizar componentes, funciones y módulos existentes antes de crear nuevos.
- Evitar duplicar lógica.
- Mantener nombres consistentes con la documentación.
- Usar extensión `.jsx` para archivos que renderizan JSX, como páginas, layouts y componentes React.
- Mantener en `.js` la lógica pura, servicios, constantes, contratos, helpers y archivos barrel de exportación.
- Usar `SKU` y `código único` como el mismo concepto.
- Respetar las reglas de negocio definidas.
- Explicar qué archivos crea, modifica o elimina.
- Indicar riesgos, pendientes o supuestos técnicos.
- Proponer un plan antes de cambios grandes.

Codex no debe:

- Crear funcionalidades fuera del alcance.
- Cambiar la arquitectura sin justificación.
- Cambiar tecnologías principales sin aprobación.
- Crear componentes duplicados.
- Crear botones, inputs, tablas, cards, modales o badges personalizados por módulo si existe un componente compartido en `stock-track-360/src/components`.
- Usar colores hardcodeados en pantallas cuando exista un token o clase del sistema de diseño.
- Dejar código muerto o sin uso.
- Eliminar documentación.
- Romper módulos de otros integrantes sin explicar el impacto.
- Introducir dependencias innecesarias.

## Reglas de autenticación y seguridad

La autenticación debe usar JWT.

El token debe permitir identificar:

- Usuario autenticado.
- Rol del usuario.

El sistema debe aplicar control de acceso basado en roles.

Las validaciones de permisos deben hacerse en backend, no solo en la interfaz.

Durante el inicio de sesión, los errores deben ser genéricos. No se debe indicar si falló el correo, la contraseña o el estado del usuario.

Mensaje recomendado:

```txt
Usuario o contraseña incorrectos.
