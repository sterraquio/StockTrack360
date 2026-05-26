# Plan de trabajo para el equipo - StockTrack360

## 1. Objetivo del plan

Este documento explica cómo deben trabajar los 3 integrantes del equipo para desarrollar StockTrack360 manteniendo:

- Consistencia visual entre todas las pantallas.
- Separación clara por módulos.
- Uso obligatorio del sistema de diseño compartido.
- Respeto por las reglas funcionales del MVP.
- Integración técnica alineada con la documentación oficial.

Fuentes de verdad del proyecto:

- `/docs/project-context.md`: fuente funcional principal.
- `/docs/design-system.md`: fuente visual principal.
- `/docs/frontend-guidelines.md`: referencia histórica del prototipo/Figma.

Antes de programar cualquier módulo, cada integrante debe revisar esos documentos.

---

## 2. Tecnologías oficiales del proyecto

Según la documentación oficial, StockTrack360 debe usar:

- Frontend: React + JavaScript.
- Backend: Next.js + JavaScript.
- Base de datos: PostgreSQL con Supabase.
- Autenticación: JWT.
- Estilos: Tailwind CSS v4.
- Diseño base: Figma.
- Documentación: README y archivos dentro de `/docs`.

Regla importante:

No usar Prisma por ahora. Prisma no está definido en la documentación ni aparece instalado en el proyecto. Si el equipo quiere usarlo, debe aprobarlo explícitamente antes de incorporarlo.

---

## 3. Estructura del proyecto

La estructura principal debe respetarse así:

```txt
stock-track-360/src
  /app
  /components
  /features
  /hooks
  /services
  /styles
  /types
  /utils
```

### 3.1 `/src/app`

Contiene las rutas de Next.js.

Ejemplos:

```txt
src/app/login/page.jsx
src/app/(app)/dashboard/page.jsx
src/app/(app)/productos/page.jsx
src/app/(app)/inventario/page.jsx
src/app/(app)/movimientos/page.jsx
src/app/(app)/alertas/page.jsx
src/app/(app)/reportes/page.jsx
src/app/(app)/usuarios/page.jsx
```

Reglas:

- Las páginas deben ser delgadas.
- No deben contener toda la lógica del módulo.
- Deben importar componentes o pantallas desde `src/features`.
- Si renderizan JSX, deben usar extensión `.jsx`.

### 3.2 `/src/components`

Contiene componentes compartidos. Todos los módulos deben usarlos.

```txt
src/components
  /ui
  /forms
  /data-display
  /feedback
  /layout
```

Regla principal:

Nadie debe crear botones, inputs, tablas, cards, modales o badges propios dentro de un módulo si ya existe un componente compartido.

### 3.3 `/src/components/ui`

Componentes base:

```txt
Button
Input
Select
SearchInput
Card
Modal
Badge
Loader
```

Uso obligatorio para:

- Botones.
- Inputs.
- Selects.
- Cards.
- Modales.
- Badges.
- Loaders.

Ejemplo correcto:

```jsx
import { Button, Input, Select } from "@/components/ui";
```

Ejemplo incorrecto:

```jsx
<button className="bg-green-500 rounded-xl px-8">
  Guardar
</button>
```

### 3.4 `/src/components/forms`

Patrones de formularios y filtros:

```txt
FieldGroup
FilterToolbar
FormActions
```

Uso esperado:

- `FilterToolbar`: barras de búsqueda y filtros.
- `FieldGroup`: agrupar campos de formularios.
- `FormActions`: botones de guardar, cancelar o confirmar.

Ejemplo:

```jsx
<FilterToolbar actions={<Button>Buscar</Button>}>
  <SearchInput placeholder="Buscar por nombre o SKU..." />
  <Select label="Categoría" options={categoryOptions} />
</FilterToolbar>
```

### 3.5 `/src/components/data-display`

Componentes para mostrar datos:

```txt
Table
Pagination
KpiCard
StatusCell
```

Uso esperado:

- `Table`: cualquier listado.
- `Pagination`: listados mayores a 10 registros.
- `KpiCard`: indicadores del dashboard o resúmenes.
- `StatusCell`: estados dentro de tablas.

Ejemplo:

```jsx
<Table columns={columns} data={products} loading={isLoading} />
<Pagination page={page} totalItems={totalItems} />
```

### 3.6 `/src/components/feedback`

Componentes de estados y mensajes:

```txt
Alert
EmptyState
ConfirmDialog
```

Uso esperado:

- `Alert`: errores, advertencias, información y éxito.
- `EmptyState`: cuando no hay datos.
- `ConfirmDialog`: confirmaciones, especialmente eliminaciones.

Toda eliminación debe usar confirmación.

### 3.7 `/src/components/layout`

Componentes de estructura:

```txt
AuthenticatedLayout
Sidebar
Navbar
PageContainer
PageHeader
```

Uso esperado:

- Todas las pantallas autenticadas deben usar `PageContainer`.
- Todas las pantallas de módulo deben usar `PageHeader`.
- La navegación principal debe mantenerse en `Sidebar`.

### 3.8 `/src/features`

Cada módulo funcional debe vivir aquí:

```txt
src/features/auth
src/features/users
src/features/products
src/features/inventory-movements
src/features/alerts
src/features/dashboard
src/features/reports
src/features/shared
```

Reglas:

- Cada integrante debe trabajar principalmente dentro de su módulo asignado.
- Los módulos deben reutilizar `src/components`.
- No crear componentes visuales duplicados dentro de `src/features`.

### 3.9 `/src/services`

Aquí van llamadas a API y contratos.

Archivos base:

```txt
src/services/apiClient.js
src/services/apiContract.js
```

Regla:

Los componentes no deben llamar directamente a `fetch`. Deben usar servicios.

Servicios esperados cuando se conecte backend real:

```txt
authService.js
userService.js
productService.js
inventoryService.js
movementService.js
alertService.js
reportService.js
```

### 3.10 `/src/utils`

Aquí van helpers puros:

```txt
permissions.js
routes.js
messages.js
classNames.js
```

Uso esperado:

- Roles.
- Permisos.
- Rutas.
- Mensajes estándar.
- Unión de clases CSS.

### 3.11 `/src/styles`

Contiene reglas de estilos compartidas.

Los tokens globales de Tailwind v4 viven en:

```txt
src/app/globals.css
```

No crear `tailwind.config.js` mientras el proyecto use Tailwind v4 con `@theme`.

---

## 4. Reglas visuales obligatorias

### 4.1 Botones

Usar siempre:

```jsx
<Button />
```

Variantes permitidas:

```txt
primary
secondary
danger
ghost
icon
```

Reglas:

- `primary`: acción principal.
- `secondary`: acción secundaria.
- `danger`: eliminar o acción destructiva.
- `ghost`: acción ligera.
- `icon`: botón solo con icono o marcador corto.
- No crear botones personalizados por módulo.
- Máximo un botón primario por bloque visual.

### 4.2 Inputs y selects

Usar siempre:

```jsx
<Input />
<Select />
<SearchInput />
```

Reglas:

- Todo input debe tener label visible.
- Los errores van debajo del campo.
- No usar placeholder como reemplazo del label.
- `SearchInput` debe usarse para búsqueda por nombre, SKU o correo.

### 4.3 Tablas

Usar siempre:

```jsx
<Table />
```

Reglas:

- Toda tabla debe tener estado de carga.
- Toda tabla debe tener estado vacío.
- Si hay más de 10 registros, usar `Pagination`.
- Las acciones de tabla deben usar botones compartidos.
- Los estados deben representarse con `Badge` o `StatusCell`.

### 4.4 Cards y KPIs

Usar:

```jsx
<Card />
<KpiCard />
```

Reglas:

- `Card` para formularios, paneles y agrupaciones.
- `KpiCard` para indicadores del dashboard o resúmenes.
- No anidar cards dentro de cards salvo que exista una razón clara.

### 4.5 Alertas y estados

Usar:

```jsx
<Alert />
<EmptyState />
<Loader />
```

Reglas:

- Error: `Alert variant="error"`.
- Advertencia: `Alert variant="warning"`.
- Éxito: `Alert variant="success"`.
- Información: `Alert variant="info"`.
- Si no hay datos, usar `EmptyState`.

### 4.6 Eliminaciones

Toda eliminación debe usar:

```jsx
<ConfirmDialog />
```

Y botón:

```jsx
<Button variant="danger" />
```

Aplica especialmente a:

- Eliminar productos.
- Confirmar acciones destructivas.
- Salidas sensibles si el flujo lo requiere.

---

## 5. Reglas de colores, fuentes y espaciado

No usar colores hardcodeados en pantallas.

Incorrecto:

```jsx
<div className="bg-[#123456] text-red-900">
```

Correcto:

```jsx
<div className="bg-app-bg text-text-body">
```

Usar tokens definidos en Tailwind v4:

```txt
bg-primary
bg-primary-hover
bg-app-bg
bg-surface
text-text-primary
text-text-heading
text-text-body
text-text-muted
border-border-default
border-border-input
bg-danger
bg-success
bg-warning
```

Reglas:

- No mezclar fuentes.
- Usar `font-mono` solo para SKU, códigos o identificadores.
- Usar espaciado Tailwind estándar.
- No usar valores arbitrarios sin justificación.

---

## 6. Reglas de archivos

Usar `.jsx` para archivos que renderizan JSX:

```txt
page.jsx
layout.jsx
Button.jsx
ProductForm.jsx
```

Usar `.js` para lógica pura:

```txt
apiClient.js
apiContract.js
permissions.js
messages.js
routes.js
```

No mezclar lógica de negocio pesada dentro de componentes visuales.

---

## 7. Roles y permisos

Roles permitidos:

```txt
ADMINISTRADOR
USUARIO
```

No crear roles adicionales.

### 7.1 Administrador

Puede:

- Gestionar usuarios.
- Registrar productos.
- Editar productos.
- Eliminar productos si tienen stock igual a 0.
- Registrar entradas y salidas.
- Consultar inventario.
- Ver alertas.
- Ver dashboard.
- Ver reportes.

### 7.2 Usuario

Puede:

- Registrar entradas y salidas.
- Consultar productos.
- Consultar inventario.
- Consultar historial.
- Ver alertas.
- Ver dashboard.
- Ver reportes básicos.

No puede:

- Gestionar usuarios.
- Eliminar productos.
- Cambiar roles.
- Cambiar estado de otros usuarios.

Regla importante:

El frontend puede ocultar botones, pero el backend debe validar permisos siempre.

---

## 8. Reglas de base de datos y servicios

La documentación define:

```txt
PostgreSQL con Supabase
```

Por eso, el equipo debe planear conexión con Supabase.

No usar Prisma salvo aprobación explícita.

### 8.1 Usuario

Campos:

```txt
id
nombre
correo
contraseña_hash
rol
estado
```

Reglas:

- Correo único.
- Correo inmutable.
- Rol obligatorio.
- Contraseña nunca en texto plano.

### 8.2 Categoría

Campos:

```txt
id
nombre
```

Reglas:

- Categorías predefinidas.
- No hay CRUD de categorías en el MVP.

### 8.3 Producto

Campos:

```txt
id
categoria_id
nombre
sku
fecha_vencimiento
stock_minimo
stock_disponible
```

Reglas:

- SKU único.
- SKU inmutable.
- Stock inicial 0.
- Si no hay fecha de vencimiento, mostrar `N/A`.
- Si no hay stock mínimo, no genera alerta.

### 8.4 MovimientoInventario

Campos:

```txt
id
producto_id
usuario_id
tipo
cantidad
fecha_hora
```

Tipos:

```txt
ENTRADA
SALIDA
```

Reglas:

- Cantidad mayor a 0.
- Salida no puede superar stock disponible.
- Stock nunca puede quedar negativo.
- Movimiento y actualización de stock deben ser atómicos.

---

## 9. Contratos de API

El archivo base es:

```txt
src/services/apiContract.js
```

Contratos esperados:

```txt
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/logout

GET    /api/users
POST   /api/users
PATCH  /api/users/:id

GET    /api/products
POST   /api/products
PATCH  /api/products/:id
DELETE /api/products/:id

GET    /api/inventory-movements
POST   /api/inventory-movements/entries
POST   /api/inventory-movements/exits

GET    /api/alerts/low-stock
GET    /api/alerts/expired
GET    /api/alerts/expiring

GET    /api/reports/low-stock
GET    /api/reports/expiration
GET    /api/reports/top-exits
```

Cada integrante debe usar estos contratos y no inventar rutas nuevas sin coordinar.

---

## 10. Distribución del trabajo por integrante

## Integrante 1: base técnica, autenticación y usuarios

### Responsabilidades

- Configurar conexión a Supabase.
- Preparar variables de entorno.
- Implementar autenticación con JWT.
- Implementar login.
- Implementar logout.
- Implementar protección de rutas.
- Implementar control de acceso por roles.
- Implementar módulo de usuarios.

### Pantallas

```txt
/login
/usuarios
```

### Backend/API

```txt
/api/auth/login
/api/auth/me
/api/auth/logout
/api/users
```

### Debe implementar

- Login con correo y contraseña.
- Mensaje genérico si falla login.
- JWT con usuario y rol.
- Listado de usuarios.
- Crear usuario.
- Editar nombre, rol y estado.
- No permitir editar correo.
- Solo `ADMINISTRADOR` puede gestionar usuarios.

### Componentes que debe usar

```txt
Card
Input
Select
Button
Alert
Table
Badge
Modal
ConfirmDialog
PageContainer
PageHeader
```

### No debe hacer

- No crear roles nuevos.
- No mostrar errores específicos de login.
- No guardar contraseña en texto plano.
- No modificar productos o movimientos.

## Integrante 2: productos e inventario

### Responsabilidades

- Implementar gestión de productos.
- Implementar consulta de inventario.
- Implementar filtros y búsqueda.
- Aplicar reglas de SKU y stock.

### Pantallas

```txt
/productos
/inventario
```

### Backend/API

```txt
/api/products
```

También puede necesitar consulta de categorías predefinidas, pero sin CRUD.

### Debe implementar

- Crear producto.
- Editar producto.
- Listar productos.
- Eliminar producto solo si stock es 0.
- SKU único.
- SKU inmutable.
- Stock inicial en 0.
- Fecha de vencimiento opcional.
- Stock mínimo opcional.
- Búsqueda por nombre.
- Búsqueda exacta por SKU.
- Filtro por categoría.
- Paginación si hay más de 10 registros.
- Mostrar `N/A` si no hay fecha de vencimiento.
- Resaltar stock 0 en rojo.

### Componentes que debe usar

```txt
PageContainer
PageHeader
FilterToolbar
SearchInput
Select
Table
Pagination
Badge
StatusCell
Modal
ConfirmDialog
Button
Input
FieldGroup
FormActions
```

### No debe hacer

- No crear, editar ni eliminar categorías desde UI.
- No permitir modificar SKU después de crear.
- No eliminar productos con stock mayor a 0.
- No crear botones o tablas propios.

## Integrante 3: movimientos, alertas, dashboard y reportes

### Responsabilidades

- Implementar entradas y salidas.
- Implementar historial de movimientos.
- Implementar alertas.
- Implementar dashboard.
- Implementar reportes básicos.

### Pantallas

```txt
/movimientos
/alertas
/dashboard
/reportes
```

### Backend/API

```txt
/api/inventory-movements
/api/inventory-movements/entries
/api/inventory-movements/exits
/api/alerts/low-stock
/api/alerts/expired
/api/alerts/expiring
/api/reports/low-stock
/api/reports/expiration
/api/reports/top-exits
```

### Debe implementar

- Registrar entradas.
- Registrar salidas.
- Validar cantidad mayor a 0.
- Validar stock suficiente en salidas.
- Actualizar stock automáticamente.
- Guardar historial con usuario, fecha, tipo y cantidad.
- Mostrar movimientos del más reciente al más antiguo.
- Alertas de stock bajo.
- Alertas de vencidos.
- Alertas próximos a vencer en 7 días.
- Alertas próximos a vencer en 30 días.
- Dashboard con KPIs básicos.
- Reportes básicos en pantalla.

### Componentes que debe usar

```txt
PageContainer
PageHeader
Card
KpiCard
FieldGroup
FormActions
Input
Select
Button
Table
Pagination
Badge
StatusCell
Alert
EmptyState
Loader
```

### No debe hacer

- No implementar reportes financieros.
- No implementar compras avanzadas.
- No implementar ventas avanzadas.
- No implementar IA.
- No crear dashboards fuera del alcance del MVP.

---

## 11. Orden de implementación recomendado

### Fase 1: alinear equipo

Todos deben leer:

```txt
/docs/project-context.md
/docs/design-system.md
/docs/frontend-guidelines.md
```

Acuerdos:

- No crear componentes visuales duplicados.
- No cambiar tecnologías.
- No usar Prisma sin aprobación.
- Usar Supabase como base de datos.
- Usar JWT para autenticación.
- Usar solo roles `ADMINISTRADOR` y `USUARIO`.

### Fase 2: base técnica

Responsable principal: Integrante 1.

Tareas:

- Configurar Supabase.
- Definir variables de entorno.
- Crear capa de conexión en `src/lib`.
- Preparar autenticación con JWT.
- Preparar validación de permisos backend.
- Confirmar estructura de tablas.

### Fase 3: usuarios y autenticación

Responsable principal: Integrante 1.

Tareas:

- Login.
- Logout.
- Sesión.
- Protección de rutas.
- CRUD administrativo de usuarios.
- Validación de rol y estado.

### Fase 4: productos e inventario

Responsable principal: Integrante 2.

Tareas:

- Productos.
- Categorías predefinidas.
- Inventario general.
- Búsqueda.
- Filtros.
- Paginación.
- Reglas de SKU y stock.

### Fase 5: movimientos

Responsable principal: Integrante 3.

Tareas:

- Entradas.
- Salidas.
- Historial.
- Validación de stock.
- Actualización atómica.

### Fase 6: alertas, dashboard y reportes

Responsable principal: Integrante 3.

Tareas:

- Alertas dinámicas.
- KPIs.
- Reportes básicos.
- Estados vacíos y de error.

### Fase 7: integración y revisión

Responsables: todos.

Tareas:

- Probar flujo completo por rol.
- Validar permisos backend.
- Validar consistencia visual.
- Revisar responsive.
- Ejecutar lint.
- Ejecutar build.
- Corregir duplicaciones.

---

## 12. Checklist para cada pull request

Antes de abrir un PR, revisar:

```txt
[ ] Leí project-context.md y design-system.md.
[ ] Uso componentes compartidos.
[ ] No creé botones, inputs, tablas, cards o modales propios.
[ ] No usé colores hardcodeados.
[ ] No usé estilos inline innecesarios.
[ ] Usé .jsx para archivos con JSX.
[ ] Usé .js para lógica pura.
[ ] Respeté roles ADMINISTRADOR y USUARIO.
[ ] Validé permisos también desde backend si aplica.
```

---

## 13. Cosas que no se deben implementar en el MVP

No implementar:

```txt
Facturación electrónica
Integración contable
Pasarelas de pago
Aplicación móvil nativa
IA para predicción de demanda
Múltiples bodegas o sucursales avanzadas
Lectores de código de barras
E-commerce
Compras avanzadas
Ventas avanzadas
Analítica financiera avanzada
CRUD de categorías desde UI
Microservicios desplegados por separado
Roles adicionales
Prisma sin aprobación
```

---

## 14. Regla final para el equipo

Si una pantalla necesita un botón, input, tabla, card, modal, badge, alerta, filtro o KPI, primero debe buscarlo en:

```txt
src/components
```

Solo se crea un componente nuevo si:

- No existe uno compartido que cubra el caso.
- El nuevo componente será reutilizable.
- Se ubica dentro de `src/components`, no dentro de un módulo específico.
- El equipo acepta la nueva variante o patrón.

La prioridad es que StockTrack360 se vea como una sola aplicación, no como tres módulos hechos por tres personas distintas.
