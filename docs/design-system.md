# Design System - StockTrack360

## 1. Propósito del sistema de diseño

El sistema de diseño de StockTrack360 define las reglas visuales, tokens, componentes compartidos y patrones de interacción que deben usarse para implementar `apps/frontend` en React/Next.js con Tailwind CSS.

Sirve para:

- Mantener consistencia visual entre los módulos desarrollados por los 3 integrantes del equipo.
- Evitar botones, tablas, formularios, cards y modales con estilos diferentes.
- Reducir duplicación de componentes y clases CSS.
- Facilitar mantenimiento, revisión de pull requests y evolución del frontend.
- Alinear la implementación con la guía visual proveniente de Figma y con el alcance del MVP.

Este documento es la fuente visual principal del frontend. Cada integrante debe usarlo antes de crear pantallas o componentes. Si existe un componente compartido en `apps/frontend/src/components/ui`, debe reutilizarse. Si una pantalla necesita una variante nueva, primero debe evaluarse si puede resolverse extendiendo el componente existente sin romper su API.

---

## 2. Tokens de diseño

### 2.1 Colores

| Token | Tailwind | Hex | Uso |
| --- | --- | --- | --- |
| `primary` | `blue-600` | `#2563eb` | Acciones principales, enlaces activos, foco principal. |
| `primary-hover` | `blue-700` | `#1d4ed8` | Hover de botones primarios. |
| `secondary` | `slate-900` | `#0f172a` | Sidebar, texto de alta jerarquía, acciones fuertes. |
| `app-bg` | `slate-50` | `#f8fafc` | Fondo general de la aplicación. |
| `surface` | `white` | `#ffffff` | Cards, formularios, modales, tablas. |
| `text-primary` | `slate-900` | `#0f172a` | Títulos principales. |
| `text-heading` | `slate-800` | `#1e293b` | Títulos internos y valores KPI. |
| `text-body` | `slate-700` | `#334155` | Texto de contenido. |
| `text-muted` | `slate-500` | `#64748b` | Descripciones, ayuda, metadatos. |
| `border-soft` | `slate-100` | `#f1f5f9` | Separadores internos ligeros. |
| `border-default` | `slate-200` | `#e2e8f0` | Cards, tablas, divisores. |
| `border-input` | `slate-300` | `#cbd5e1` | Inputs, selects, controles editables. |
| `danger` | `red-600` | `#dc2626` | Errores, eliminación, stock crítico, salidas. |
| `danger-hover` | `red-700` | `#b91c1c` | Hover destructivo. |
| `success` | `emerald-600` | `#059669` | Operaciones exitosas, entradas, estados positivos. |
| `success-hover` | `emerald-700` | `#047857` | Hover positivo. |
| `warning` | `amber-500` | `#f59e0b` | Advertencias y productos próximos a vencer. |
| `warning-strong` | `amber-700` | `#b45309` | Texto de advertencia. |

Fondos semánticos:

| Token | Hex | Uso |
| --- | --- | --- |
| `primary-soft` | `#eff6ff` | Estados informativos y selección suave. |
| `danger-soft` | `#fef2f2` | Errores y stock crítico. |
| `success-soft` | `#ecfdf5` | Confirmaciones y operaciones exitosas. |
| `warning-soft` | `#fffbeb` | Vencimientos próximos y advertencias. |
| `neutral-soft` | `#f1f5f9` | Estados vacíos, fondos de iconos, skeletons. |

Regla: no usar colores hardcodeados fuera del sistema de diseño, salvo casos excepcionales documentados.

### 2.2 Tipografías

Fuente principal: `Geist Sans`, ya configurada en el proyecto Next.js.

Fuente monoespaciada: `Geist Mono`, solo para SKU, códigos, identificadores y valores técnicos.

| Uso | Clase recomendada |
| --- | --- |
| Título de página | `text-3xl font-bold text-slate-900 tracking-tight` |
| Título de login o marca | `text-2xl font-bold text-slate-800 tracking-tight` |
| Título de sección/card | `text-lg font-bold text-slate-800 tracking-tight` |
| Subtítulo de página | `text-sm text-slate-500 mt-1` |
| Texto normal | `text-sm text-slate-700` |
| Texto destacado | `text-base text-slate-700` |
| Texto pequeño | `text-xs text-slate-500` |
| Label | `text-sm font-semibold text-slate-700` |
| Botón | `text-sm font-medium` o `text-sm font-semibold` |
| Header de tabla | `text-xs font-semibold text-slate-500 uppercase tracking-wider` |
| KPI | `text-3xl font-bold text-slate-800` |

Pesos permitidos:

- `font-normal`: texto de lectura y placeholders.
- `font-medium`: navegación y botones secundarios.
- `font-semibold`: labels, botones principales, filas importantes.
- `font-bold`: títulos, KPIs y badges críticos.

### 2.3 Espaciados

Usar escala Tailwind. Evitar valores arbitrarios.

| Contexto | Clase |
| --- | --- |
| Layout principal desktop | `p-8` |
| Layout principal mobile | `p-4` |
| Separación vertical estándar | `space-y-6` |
| Separación amplia | `space-y-8` |
| Header de página | `mb-8` o `gap-4` |
| Grid de dashboard | `gap-6` |
| Card estándar | `p-6` |
| Card de login | `p-8` |
| Toolbar | `p-4 gap-4` |
| Formularios | `space-y-5` o `gap-6` |
| Inputs/selects | `px-4 py-2.5` |
| Botones | `px-5 py-2.5` |
| CTA ancho completo | `w-full px-4 py-3` |
| Celdas de tabla | `px-6 py-4` |
| Sidebar | `w-64` |
| Items de sidebar | `px-4 py-3` |

### 2.4 Border radius

| Token | Valor | Uso |
| --- | --- | --- |
| `radius-sm` | `0.375rem` | Badges pequeños, inputs compactos. |
| `radius-md` | `0.5rem` | Botones, inputs, selects. |
| `radius-lg` | `0.75rem` | Modales y bloques medianos. |
| `radius-xl` | `1rem` | Cards, tablas, contenedores destacados. |
| `radius-full` | `9999px` | Badges tipo píldora. |

Regla: no usar radios decorativos excesivos en herramientas operativas.

### 2.5 Sombras

| Token | Clase | Uso |
| --- | --- | --- |
| `shadow-sm` | `shadow-sm` | Cards, botones, tablas. |
| `shadow-md` | `shadow-md` | Cards clicables en hover. |
| `shadow-lg` | `shadow-lg` | Modales y overlays. |

Regla: usar sombras de forma sutil. La separación principal debe venir de borde, espaciado y jerarquía visual.

### 2.6 Bordes

| Uso | Clase |
| --- | --- |
| Card o tabla | `border border-slate-200` |
| Separador suave | `border-slate-100` |
| Input normal | `border border-slate-300` |
| Input focus | `focus:border-blue-500` |
| Error | `border-red-300` |
| Success | `border-emerald-300` |
| Warning | `border-amber-300` |

### 2.7 Breakpoints

Usar breakpoints estándar de Tailwind:

| Breakpoint | Valor | Uso |
| --- | --- | --- |
| `sm` | `640px` | Ajustes básicos mobile/tablet. |
| `md` | `768px` | Formularios en dos columnas, tablas compactas. |
| `lg` | `1024px` | Layout con sidebar y contenido amplio. |
| `xl` | `1280px` | Dashboard, reportes y grids complejos. |
| `2xl` | `1536px` | Máximo ancho de contenido si aplica. |

### 2.8 Transiciones

| Token | Clase | Uso |
| --- | --- | --- |
| `transition-fast` | `transition-colors duration-150` | Botones, links, filas de tabla. |
| `transition-base` | `transition-all duration-200` | Cards clicables, modales. |
| `transition-slow` | `transition-all duration-300` | Alertas o cambios de estado mayores. |

### 2.9 Animaciones

| Uso | Regla |
| --- | --- |
| Loading de datos | `animate-pulse` para skeletons. |
| Spinner | Borde circular con `border-t-blue-600`. |
| Modal | Fade + zoom suave, `duration-200`. |
| Alertas | Fade + slide vertical leve. |
| Hover | Cambios cortos de color o sombra. |

No usar rebotes, rotaciones decorativas, gradientes animados ni transiciones largas.

---

## 3. Configuración técnica de Tailwind

El frontend objetivo usa Tailwind CSS v4. Las dependencias deben vivir en `apps/frontend/package.json`:

- `tailwindcss: ^4`
- `@tailwindcss/postcss: ^4`

Por tanto, los tokens deben declararse con `@theme` en `apps/frontend/src/app/globals.css`.

Ejemplo recomendado:

```css
@import "tailwindcss";

:root {
  --background: #f8fafc;
  --foreground: #0f172a;
}

@theme {
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-primary-soft: #eff6ff;

  --color-secondary: #0f172a;
  --color-app-bg: #f8fafc;
  --color-surface: #ffffff;

  --color-text-primary: #0f172a;
  --color-text-heading: #1e293b;
  --color-text-body: #334155;
  --color-text-muted: #64748b;

  --color-border-soft: #f1f5f9;
  --color-border-default: #e2e8f0;
  --color-border-input: #cbd5e1;

  --color-danger: #dc2626;
  --color-danger-hover: #b91c1c;
  --color-danger-soft: #fef2f2;

  --color-success: #059669;
  --color-success-hover: #047857;
  --color-success-soft: #ecfdf5;

  --color-warning: #f59e0b;
  --color-warning-strong: #b45309;
  --color-warning-soft: #fffbeb;

  --color-neutral-soft: #f1f5f9;

  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);

  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;

  --shadow-card: 0 1px 2px 0 rgb(15 23 42 / 0.06);
  --shadow-modal: 0 20px 25px -5px rgb(15 23 42 / 0.1), 0 8px 10px -6px rgb(15 23 42 / 0.1);

  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
}
```

Uso esperado:

```jsx
<div className="bg-app-bg text-text-body">
  <button className="bg-primary hover:bg-primary-hover text-white">
    Guardar
  </button>
</div>
```

Si en el futuro el proyecto migra a Tailwind v3, estos tokens deben trasladarse a `tailwind.config.js` dentro de `theme.extend`.

---

## 4. Componentes compartidos obligatorios

Todos los componentes compartidos deben vivir en `apps/frontend/src/components/ui` o en una carpeta compartida equivalente dentro de `apps/frontend/src/components` según su responsabilidad.

### 4.1 Button

Propósito: ejecutar acciones del usuario.

Variantes:

- `primary`: acción principal.
- `secondary`: acción complementaria.
- `danger`: acción destructiva.
- `ghost`: acción ligera o de tabla.
- `icon`: acción solo con icono.

Props recomendadas:

```ts
variant: "primary" | "secondary" | "danger" | "ghost" | "icon"
size: "sm" | "md" | "lg"
loading?: boolean
disabled?: boolean
type?: "button" | "submit" | "reset"
leftIcon?: ReactNode
rightIcon?: ReactNode
```

Estados visuales:

- Normal: color base de variante.
- Hover: cambio de color en un nivel.
- Focus: `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`.
- Disabled/loading: `opacity-50 cursor-not-allowed`.

Ejemplo:

```jsx
<Button variant="primary" loading={isSaving}>
  Guardar producto
</Button>
```

Reglas:

- Máximo un botón primario por bloque visual.
- No crear botones personalizados por módulo.
- Acciones destructivas deben usar `danger` y confirmación.

### 4.2 Input

Propósito: capturar texto, números o datos simples.

Variantes:

- `default`
- `error`
- `success`

Props recomendadas:

```ts
label?: string
placeholder?: string
error?: string
helperText?: string
disabled?: boolean
type?: "text" | "email" | "password" | "number" | "date"
```

Ejemplo:

```jsx
<Input
  label="Nombre del producto"
  placeholder="Ej: Arroz 500g"
  error={errors.name}
/>
```

Reglas:

- Siempre usar label visible.
- Mostrar errores debajo del campo.
- No usar placeholders como reemplazo de labels.

### 4.3 Select

Propósito: seleccionar una opción entre valores conocidos.

Variantes:

- `default`
- `error`
- `disabled`

Props recomendadas:

```ts
label?: string
placeholder?: string
options: Array<{ label: string; value: string }>
error?: string
disabled?: boolean
```

Ejemplo:

```jsx
<Select
  label="Categoría"
  placeholder="Selecciona una categoría"
  options={categoryOptions}
/>
```

Reglas:

- Usar para categorías, roles, estados y filtros.
- No permitir creación de categorías desde la interfaz del MVP.

### 4.4 SearchInput

Propósito: búsqueda por nombre, SKU o criterio operativo.

Props recomendadas:

```ts
value: string
onChange: (value: string) => void
placeholder?: string
disabled?: boolean
```

Ejemplo:

```jsx
<SearchInput
  value={search}
  onChange={setSearch}
  placeholder="Buscar por nombre o SKU..."
/>
```

Reglas:

- Debe incluir icono `Search`.
- Debe mantener altura consistente con `Input`.
- Usar placeholder específico.

### 4.5 Card

Propósito: agrupar información relacionada.

Variantes:

- `default`
- `interactive`
- `kpi`
- `form`

Props recomendadas:

```ts
title?: string
description?: string
variant?: "default" | "interactive" | "kpi" | "form"
children: ReactNode
```

Ejemplo:

```jsx
<Card title="Productos con stock bajo" variant="kpi">
  <p className="text-3xl font-bold text-slate-800">12</p>
</Card>
```

Reglas:

- No anidar cards dentro de cards.
- Hover solo en cards clicables.

### 4.6 Table

Propósito: mostrar listados operativos.

Props recomendadas:

```ts
columns: Array<{ key: string; header: string }>
data: Array<Record<string, unknown>>
loading?: boolean
emptyMessage?: string
```

Ejemplo:

```jsx
<Table
  columns={productColumns}
  data={products}
  loading={isLoading}
  emptyMessage="Sin resultados."
/>
```

Reglas:

- Usar skeletons durante loading.
- Incluir estado empty.
- Acciones con botones de icono.
- Listados con más de 10 registros deben paginarse.

### 4.7 Modal

Propósito: confirmar acciones o capturar datos secundarios.

Variantes:

- `default`
- `confirm`
- `danger`

Props recomendadas:

```ts
open: boolean
onOpenChange: (open: boolean) => void
title: string
description?: string
children?: ReactNode
footer?: ReactNode
```

Ejemplo:

```jsx
<Modal open={open} onOpenChange={setOpen} title="Eliminar producto">
  <p>Esta acción no se puede deshacer.</p>
</Modal>
```

Reglas:

- Usar confirmación para eliminar.
- Cerrar con `X`, Escape y click fuera cuando no haya pérdida de datos.
- Footer con acciones alineadas a la derecha en desktop.

### 4.8 Alert

Propósito: comunicar errores, advertencias, éxitos o información.

Variantes:

- `success`
- `error`
- `warning`
- `info`

Props recomendadas:

```ts
variant: "success" | "error" | "warning" | "info"
title?: string
children: ReactNode
```

Ejemplo:

```jsx
<Alert variant="success">
  Producto creado correctamente.
</Alert>
```

Reglas:

- Una alerta debe decir qué pasó y qué hacer si aplica.
- No usar alertas para contenido largo.
- Usar alertas semánticas para errores, advertencias y éxitos.

### 4.9 Badge

Propósito: representar estados, roles o categorías.

Variantes:

- `success`
- `danger`
- `warning`
- `info`
- `neutral`

Props recomendadas:

```ts
variant: "success" | "danger" | "warning" | "info" | "neutral"
children: ReactNode
```

Ejemplo:

```jsx
<Badge variant="warning">Próximo a vencer</Badge>
```

Reglas:

- Usar badges para estados.
- No representar estados solo con color; incluir texto.

### 4.10 Sidebar

Propósito: navegación principal autenticada.

Props recomendadas:

```ts
items: Array<{ label: string; href: string; icon?: ReactNode }>
activePath: string
userRole?: "ADMINISTRADOR" | "USUARIO"
onLogout: () => void
```

Ejemplo:

```jsx
<Sidebar items={navItems} activePath={pathname} onLogout={logout} />
```

Reglas:

- Ancho desktop `w-64`.
- Fondo `bg-slate-900`.
- Item activo `bg-blue-600 text-white`.
- No duplicar navegación principal en Navbar.

### 4.11 Navbar

Propósito: barra superior contextual.

Props recomendadas:

```ts
title?: string
actions?: ReactNode
userMenu?: ReactNode
```

Ejemplo:

```jsx
<Navbar title="Productos" actions={<Button>Nuevo producto</Button>} />
```

Reglas:

- Usar para título contextual, acciones rápidas o menú de usuario.
- No debe reemplazar al Sidebar como navegación principal desktop.

### 4.12 Loader

Propósito: indicar carga.

Variantes:

- `spinner`
- `skeleton`
- `page`

Props recomendadas:

```ts
variant?: "spinner" | "skeleton" | "page"
label?: string
```

Ejemplo:

```jsx
<Loader variant="skeleton" label="Cargando información..." />
```

Reglas:

- Tablas y cards deben usar skeletons.
- Botones deben usar spinner pequeño o texto de carga.
- Mantener tamaño del componente para evitar saltos visuales.

### 4.13 EmptyState

Propósito: mostrar ausencia de datos.

Props recomendadas:

```ts
title: string
description?: string
icon?: ReactNode
action?: ReactNode
```

Ejemplo:

```jsx
<EmptyState
  title="Sin resultados"
  description="No encontramos productos con los filtros aplicados."
/>
```

Reglas:

- Usar icono neutro.
- Incluir acción solo si existe un siguiente paso claro.

### 4.14 PageHeader

Propósito: encabezado estándar de pantalla.

Props recomendadas:

```ts
title: string
description?: string
actions?: ReactNode
```

Ejemplo:

```jsx
<PageHeader
  title="Productos"
  description="Consulta y administra el catálogo de productos."
  actions={<Button>Agregar producto</Button>}
/>
```

Reglas:

- Debe usarse al inicio de cada módulo autenticado.
- La acción principal debe ir en `actions`.

### 4.15 PageContainer

Propósito: wrapper de layout para pantallas.

Props recomendadas:

```ts
children: ReactNode
size?: "default" | "wide" | "full"
```

Ejemplo:

```jsx
<PageContainer>
  <PageHeader title="Dashboard" />
  <DashboardContent />
</PageContainer>
```

Reglas:

- Usar `p-4 md:p-8`.
- Usar `space-y-6`.
- Evitar paddings personalizados por pantalla.

---

## 5. Estados visuales estándar

| Estado | Regla visual |
| --- | --- |
| Normal | Usar color base, borde visible y contraste suficiente. |
| Hover | Cambiar fondo o color un nivel: `blue-600` a `blue-700`, `white` a `slate-50`. |
| Focus | Usar `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none`. |
| Disabled | `opacity-50 cursor-not-allowed`; sin hover activo. |
| Error | Borde `border-red-300`, texto `text-red-600`, fondo `red-50` si aplica. |
| Success | Color `emerald`, mensaje corto y no invasivo. |
| Warning | Color `amber`, útil para vencimientos o advertencias no bloqueantes. |
| Loading | Deshabilitar acciones, conservar tamaño y mostrar loader o skeleton. |
| Empty | Usar `EmptyState`, icono neutro y texto breve. |

---

## 6. Mensajes estándar para el usuario

| Situación | Mensaje |
| --- | --- |
| Operación exitosa | Operación realizada correctamente. |
| Producto creado | Producto creado correctamente. |
| Producto actualizado | Producto actualizado correctamente. |
| Producto eliminado | Producto eliminado correctamente. |
| Error al guardar | No se pudo guardar. Inténtalo nuevamente. |
| Campos obligatorios | Completa los campos obligatorios. |
| Sin resultados | Sin resultados. |
| Cargando información | Cargando información... |
| Stock bajo | Stock bajo. Revisa el inventario. |
| Producto vencido | Producto vencido. |
| Producto próximo a vencer | Producto próximo a vencer. |
| Sesión inválida | Tu sesión no es válida. Inicia sesión nuevamente. |
| Sin permisos | No tienes permisos para realizar esta acción. |

Reglas de redacción:

- Mensajes de éxito terminan en punto.
- Mensajes de error deben indicar una acción posible cuando aplique.
- No usar tecnicismos como `request`, `payload`, `endpoint` o `mutation`.
- No usar mayúsculas completas para mensajes al usuario.
- En login, usar mensaje genérico: `Correo o contraseña incorrectos.`

---

## 7. Reglas de implementación

Reglas obligatorias:

- No crear botones personalizados por módulo.
- No usar colores hardcodeados fuera del sistema de diseño.
- No duplicar componentes compartidos.
- Usar siempre los componentes de `apps/frontend/src/components/ui` cuando existan.
- Usar badges para estados.
- Usar alertas semánticas para errores, advertencias y éxitos.
- Mantener consistencia en formularios, tablas, cards y modales.
- No usar estilos inline salvo valores dinámicos justificados.
- Los componentes React, páginas y layouts que rendericen JSX deben usar extensión `.jsx`.
- La lógica pura debe mantenerse en `.js` para separar UI de utilidades, servicios, constantes, contratos, helpers y archivos barrel.
- No mezclar familias tipográficas.
- No usar categorías administrables en UI para el MVP.
- No implementar funcionalidades fuera del alcance definido en `/docs/project-context.md`.
- Mantener estados `loading`, `empty` y `error` en listados y consultas.
- Usar iconos de `lucide-react` cuando el proyecto los tenga disponibles.
- Las acciones destructivas deben tener confirmación.
- Los módulos deben respetar roles: `ADMINISTRADOR` y `USUARIO`.

---

## 8. Estructura de carpetas recomendada

Estructura sugerida para `apps/frontend`:

```txt
apps/frontend/src
  /app
  /components
    /ui
    /layout
    /feedback
    /data-display
  /features
    /auth
    /dashboard
    /products
    /inventory-movements
    /alerts
    /reports
    /users
  /hooks
  /services
  /types
  /utils
  /styles
```

Uso esperado:

- `/components/ui`: Button, Input, Select, Card, Modal, Badge, Loader.
- `/components/layout`: Sidebar, Navbar, PageHeader, PageContainer.
- `/components/feedback`: Alert, EmptyState, toast si se agrega.
- `/components/data-display`: Table, KPI cards, paginación.
- `/features`: lógica y pantallas por módulo.
- `/services`: llamadas a API.
- `/types`: tipos compartidos.
- `/utils`: helpers puros.
- `/styles`: estilos globales y tokens si aplica.

---

## 9. Aplicación por módulos

### Login

- Usar card centrada `max-w-md p-8`.
- Usar `Input` para correo y contraseña.
- Usar `Button primary` ancho completo.
- Mostrar errores con `Alert error`.
- Mensaje de error genérico: `Correo o contraseña incorrectos.`

### Dashboard

- Usar `PageContainer` y `PageHeader`.
- Usar cards KPI con valores grandes.
- Usar colores semánticos para stock bajo, vencidos y próximos a vencer.
- Loading con skeletons.
- Empty state si no hay datos disponibles.

### Productos

- Usar `SearchInput` para nombre o SKU.
- Usar `Select` para categoría.
- Usar `Table` para listado.
- Usar `Badge` para estados de stock o vencimiento.
- Usar `Modal` para crear, editar o confirmar eliminación.
- Eliminar solo con rol `ADMINISTRADOR` y confirmación.

### Movimientos de inventario

- Usar formularios consistentes con `Input`, `Select` y `Button`.
- Entradas con color `success`.
- Salidas con color `danger`.
- Validar cantidades y mostrar errores debajo del campo.
- Historial en `Table`.

### Alertas

- Usar `Badge` para tipo de alerta.
- Usar `Alert` para mensajes destacados.
- Stock bajo: `danger`.
- Producto vencido: `danger`.
- Próximo a vencer: `warning`.

### Reportes

- Usar `PageHeader`, filtros en toolbar y tablas.
- Usar cards para resúmenes.
- Mantener estados loading, empty y error.
- No implementar reportes financieros avanzados en el MVP.

### Usuarios

- Solo visible para `ADMINISTRADOR`.
- Usar `Table` para listado.
- Usar `Badge` para rol y estado.
- Usar `Modal` para crear o editar.
- No permitir modificar correo después de crear usuario.

---

## 10. Checklist para pull request

Antes de subir cambios, validar:

- [ ] Usa componentes compartidos existentes.
- [ ] Respeta colores del sistema de diseño.
- [ ] Respeta tipografías definidas.
- [ ] Respeta espaciados estándar.
- [ ] Usa mensajes estándar.
- [ ] Tiene estados loading, empty y error.
- [ ] No duplica estilos ni componentes.
- [ ] No usa colores hardcodeados.
- [ ] Usa badges para estados.
- [ ] Usa alertas semánticas.
- [ ] Mantiene consistencia en formularios, tablas, cards y modales.
- [ ] Respeta roles y alcance del MVP.
- [ ] No rompe otros módulos.
- [ ] La pantalla funciona en mobile y desktop.
- [ ] Los listados con más de 10 registros consideran paginación.

---

## 11. Riesgos si no se sigue el sistema de diseño

No seguir este sistema puede causar:

- Frontend inconsistente entre módulos.
- Duplicación de botones, inputs, tablas y modales.
- Mayor dificultad de mantenimiento.
- Conflictos entre ramas por estilos repetidos.
- Pantallas con estilos diferentes para acciones iguales.
- Más tiempo en revisión de pull requests.
- Errores visuales en estados loading, empty y error.
- Experiencia de usuario menos clara.
- Mayor riesgo de romper módulos al refactorizar.
