# Guía de Diseño Frontend - StockTrack360

## 1. Paleta de colores

Esta guia toma como fuente oficial el estilo ya implementado en las pantallas actuales de StockTrack360. Usar colores de Tailwind cuando sea posible para mantener consistencia entre modulos.

| Uso | Tailwind | Hex | Regla de uso |
| --- | --- | --- | --- |
| Color primario | `blue-600` | `#2563eb` | Acciones principales, enlaces activos, foco principal e indicadores activos. |
| Primario hover | `blue-700` | `#1d4ed8` | Hover de botones primarios. |
| Color secundario | `slate-900` | `#0f172a` | Acciones fuertes de confirmacion operacional, sidebar y texto de alta jerarquia. |
| Fondo de app | `slate-50` | `#f8fafc` | Fondo general de pantallas autenticadas y login. |
| Superficie/card | `white` | `#ffffff` | Cards, tablas, formularios, modales y toolbars. |
| Texto principal | `slate-900` | `#0f172a` | Titulos de pagina y nombres principales. |
| Texto principal suave | `slate-800` | `#1e293b` | Titulos internos, encabezados de cards y valores KPI. |
| Texto secundario | `slate-500` | `#64748b` | Descripciones, metadatos, labels secundarios y fechas. |
| Error/peligro | `red-600` / `red-700` | `#dc2626` / `#b91c1c` | Eliminacion, stock critico, errores y salidas de inventario. |
| Exito | `emerald-600` / `emerald-700` | `#059669` / `#047857` | Entradas de inventario, operaciones exitosas y estados positivos. |
| Advertencia | `amber-500` / `amber-600` / `amber-700` | `#f59e0b` / `#d97706` / `#b45309` | Productos proximos a vencer y advertencias no bloqueantes. |
| Bordes suaves | `slate-100` | `#f1f5f9` | Separadores internos y bordes de cards ligeras. |
| Bordes estandar | `slate-200` | `#e2e8f0` | Tablas, cards, toolbars, formularios y divisores. |
| Bordes input | `slate-300` | `#cbd5e1` | Inputs, selects y controles editables. |
| Deshabilitado | `slate-300` / `opacity-50` | `#cbd5e1` | Elementos sin interaccion. Usar tambien `cursor-not-allowed`. |

Colores de fondo semantico:

- Primario suave: `blue-50` / `#eff6ff`.
- Error suave: `red-50` o `red-100` / `#fef2f2` o `#fee2e2`.
- Exito suave: `emerald-50` o `emerald-100` / `#ecfdf5` o `#d1fae5`.
- Advertencia suave: `amber-50` o `amber-100` / `#fffbeb` o `#fef3c7`.
- Neutro suave: `slate-50` o `slate-100` / `#f8fafc` o `#f1f5f9`.

## 2. Tipografia

Usar la fuente sans por defecto del stack actual de Tailwind. No mezclar familias tipograficas dentro de la aplicacion. Usar `font-mono` solo para codigos como SKU, identificadores y valores tecnicos.

| Elemento | Clase recomendada | Uso |
| --- | --- | --- |
| Titulo de pagina | `text-3xl font-bold text-slate-900 tracking-tight` | Encabezado principal de cada modulo. |
| Titulo de login/marca | `text-2xl font-bold text-slate-800 tracking-tight` | Nombre del producto en login o marca destacada. |
| Titulo de seccion/card | `text-lg font-bold text-slate-800 tracking-tight` | Cards, formularios, tablas y bloques internos. |
| Subtitulo/descripion de pagina | `text-slate-500 mt-1` | Texto bajo el titulo de pagina. |
| Texto normal | `text-sm text-slate-700` o `text-base text-slate-700` | Formularios, parrafos cortos y contenido de tabla. |
| Texto pequeno | `text-xs text-slate-500` | Badges, metadatos, ayudas y encabezados compactos. |
| Label | `text-sm font-semibold text-slate-700` | Campos de formulario. |
| Boton | `text-sm font-medium` o `font-semibold` | Acciones. Usar `font-semibold` para CTAs principales. |
| Tabla header | `text-xs font-semibold text-slate-500 uppercase tracking-wider` | Encabezados de columnas. |
| Valores KPI | `text-3xl font-bold text-slate-800` | Numeros destacados del dashboard. |

Pesos permitidos:

- `font-normal`: texto de lectura y placeholders.
- `font-medium`: labels suaves, navegacion y botones secundarios.
- `font-semibold`: botones, labels importantes, filas de tabla.
- `font-bold`: titulos, KPIs y badges criticos.

## 3. Sistema de espaciado

Usar escala Tailwind. No crear valores arbitrarios salvo que ya existan en el componente base.

| Contexto | Clase recomendada | Regla |
| --- | --- | --- |
| Layout principal | `p-8` | Padding del area de contenido en desktop. |
| Separacion vertical de pantalla | `space-y-6` | Separacion estandar entre bloques. |
| Pantallas con formularios + tabla | `space-y-8` | Usar cuando haya bloques operativos amplios. |
| Header de pagina | `mb-8` o `gap-4` | Separar titulo del contenido. |
| Grid de dashboard | `gap-6` | Separacion entre cards KPI y graficos. |
| Cards | `p-6` | Padding interno estandar. |
| Card de login | `p-8` | Login requiere mas aire visual. |
| Toolbar | `p-4 gap-4` | Barra de busqueda/filtros. |
| Formularios | `space-y-5` o `gap-6` | Vertical en login, horizontal responsivo en operaciones. |
| Inputs/selects | `px-3/px-4 py-2.5` | Altura consistente aproximada de 42-46px. |
| Botones | `px-5 py-2.5` | Boton normal con icono o texto. |
| CTA ancho completo | `w-full py-3 px-4` | Login y acciones principales de formulario. |
| Tabla | `px-6 py-4` | Celdas de tabla. |
| Sidebar | `w-64`, items `px-4 py-3` | Navegacion lateral fija. |

Contenedores:

- Contenido autenticado: `main` con `ml-64 p-8 h-screen overflow-y-auto`.
- Sidebar desktop: ancho fijo `w-64`, alto `h-screen`, posicion `fixed`.
- Login: card `w-full max-w-md`.
- Tabla: contenedor `bg-white rounded-xl/rounded-2xl border border-slate-200 overflow-hidden`.
- Formulario operacional: `bg-white p-6 rounded-2xl border border-slate-200 shadow-sm`.

## 4. Componentes reutilizables

### Boton primario

- Uso: accion principal de una pantalla o bloque, por ejemplo "Anadir Producto" o "Iniciar Sesion".
- Estilo: `bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm`.
- Tamano: `px-5 py-2.5`; en login usar `w-full py-3`.
- Iconos: usar `lucide-react` a la izquierda con `size={20}` cuando ayude a reconocer la accion.
- Regla: maximo un boton primario por bloque visual.

### Boton secundario

- Uso: accion complementaria, ver detalles, cancelar, limpiar filtros.
- Estilo recomendado: `bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg`.
- Variante textual permitida: `text-blue-600 hover:text-blue-700 hover:bg-blue-50`.
- No debe competir visualmente con el primario.

### Boton de peligro/eliminar

- Uso: eliminar, salida irreversible o accion destructiva.
- Estilo lleno: `bg-red-600 hover:bg-red-700 text-white`.
- Estilo icono en tabla: `text-red-600 hover:text-red-900 hover:bg-red-50 p-2 rounded-lg`.
- Siempre debe tener confirmacion si la accion elimina datos.

### Input de texto

- Estilo: `w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white`.
- Texto: `text-sm text-slate-700 placeholder-slate-400`.
- Focus: `focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`.
- Labels arriba del input con `mb-1` o `mb-2`.

### Select

- Estilo: `w-full pl-3 pr-10 py-2.5 border border-slate-300 rounded-lg bg-white`.
- Uso: filtros, categorias, roles y estados.
- Si tiene icono externo de filtro, ubicarlo a la izquierda del select con `gap-2`.

### Campo de busqueda

- Estilo: input con icono `Search` absoluto a la izquierda.
- Clases base: contenedor `relative`, icono `absolute inset-y-0 left-0 pl-3`, input `pl-10 pr-3 py-2.5`.
- Placeholder: indicar el criterio exacto, por ejemplo "Buscar por nombre o SKU...".

### Tabla

- Contenedor: `bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden`.
- Scroll horizontal: envolver en `overflow-x-auto`.
- Header: `bg-slate-50` o `bg-white`, texto uppercase `text-xs`.
- Filas: `hover:bg-slate-50 transition-colors`.
- Separadores: `divide-y divide-slate-200` o `divide-slate-100`.
- Acciones: icon buttons alineados a la derecha o centro, no texto largo.
- Paginacion: footer con `border-t border-slate-200 px-4 py-3`.

### Card

- Estilo: `bg-white rounded-2xl border border-slate-100/200 shadow-sm p-6`.
- Uso: KPIs, graficos, formularios, listas compactas y resumenes.
- Iconos en cards: contenedor `p-3 rounded-xl` con color semantico suave.
- Hover solo en cards clicables: `hover:bg-slate-50/50` o `hover:shadow-md`.

### Modal

- Usar Dialog/Radix existente.
- Overlay: negro con opacidad, `bg-black/50`.
- Contenido: `bg-white rounded-lg border p-6 shadow-lg max-w-lg`.
- Titulo: `text-lg font-semibold text-slate-900`.
- Footer: botones alineados a la derecha en desktop, apilados en mobile.
- Cerrar con icono `X`, escape y click fuera si no hay perdida de datos.

### Alertas

- Estructura: icono + titulo + mensaje corto.
- Error: `bg-red-50 border-red-200 text-red-700`.
- Advertencia: `bg-amber-50 border-amber-200 text-amber-700`.
- Exito: `bg-emerald-50 border-emerald-200 text-emerald-700`.
- Info: `bg-blue-50 border-blue-200 text-blue-700`.
- No usar parrafos largos. Una alerta debe decir que paso y que hacer.

### Badge o etiqueta de estado

- Base: `inline-flex items-center gap-1.5 px-2.5/px-3 py-1 rounded-full text-xs font-bold border`.
- Stock bajo: `bg-red-100 text-red-700 border-red-200`.
- Proximo a vencer: `bg-amber-100 text-amber-700 border-amber-200`.
- Entrada/exito: `bg-emerald-100 text-emerald-800 border-emerald-200`.
- Neutro/categoria: `bg-slate-100 text-slate-800`.

### Navbar

La app actual usa sidebar como navegacion principal. Si se agrega navbar superior:

- Fondo blanco, borde inferior `border-slate-200`, altura minima 64px.
- Debe contener titulo contextual, buscador global o acciones de usuario.
- No duplicar los enlaces principales del sidebar.

### Sidebar

- Estilo: `w-64 bg-slate-900 text-slate-300 h-screen fixed`.
- Marca: `text-2xl font-bold text-white`, icono `Boxes` en `text-blue-500`.
- Item normal: `flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white`.
- Item activo: `bg-blue-600 text-white`.
- Logout: al final con `mt-auto`, color base `text-slate-400`.

### Loader

- Para pantallas o bloques pequenos: spinner circular `border-slate-200 border-t-blue-600`.
- Para tablas/cards: preferir skeletons en `bg-slate-100 animate-pulse`.
- Texto de apoyo: "Cargando informacion..." en `text-sm text-slate-500`.

### Empty state

- Contenedor: card blanca centrada con `p-8 text-center`.
- Icono: `lucide-react` en `text-slate-400`, fondo `bg-slate-100`, caja `rounded-xl`.
- Titulo: `text-lg font-bold text-slate-800`.
- Descripcion: `text-sm text-slate-500`.
- Accion: boton primario solo si hay una siguiente accion clara.

## 5. Estados visuales

| Estado | Regla visual |
| --- | --- |
| Normal | Usar color base del componente, borde visible y contraste claro. |
| Hover | Cambiar fondo o color en 1 nivel: `blue-600` a `blue-700`, `white` a `slate-50`, `slate-900` a `slate-800`. |
| Focus | Usar `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none`. En inputs tambien `focus:border-blue-500`. |
| Disabled | Usar `opacity-50`, `cursor-not-allowed`, sin hover activo ni click. |
| Error | Borde `border-red-300`, ring `focus:ring-red-500`, texto de ayuda `text-red-600`. |
| Success | Borde o badge `emerald`, mensaje corto y no invasivo. |
| Loading | Deshabilitar accion, conservar tamano del componente y mostrar spinner o texto "Cargando...". |

Reglas por componente:

- Botones en loading mantienen ancho y alto para evitar saltos visuales.
- Inputs con error muestran mensaje debajo en `text-xs text-red-600 mt-1`.
- Tablas en loading muestran skeletons por fila, no una pantalla vacia abrupta.
- Cards clicables usan hover sutil; cards informativas no necesitan hover.

## 6. Mensajes estandar

Usar estos textos sin variaciones innecesarias:

| Situacion | Mensaje |
| --- | --- |
| Producto creado correctamente | Producto creado correctamente. |
| Producto actualizado | Producto actualizado correctamente. |
| Producto eliminado | Producto eliminado correctamente. |
| Error al guardar | No se pudo guardar. Intentalo nuevamente. |
| Campos obligatorios | Completa los campos obligatorios. |
| Stock bajo | Stock bajo. Revisa el inventario. |
| Producto vencido | Producto vencido. |
| Producto proximo a vencer | Producto proximo a vencer. |
| Sin resultados | Sin resultados. |
| Cargando informacion | Cargando informacion... |

Reglas de redaccion:

- Mensajes de exito terminan en punto.
- Mensajes de error indican accion posible cuando aplique.
- Evitar tecnicismos como "request", "payload", "endpoint" o "mutation".
- No usar mayusculas completas para mensajes al usuario.

## 7. Animaciones

Usar animaciones moderadas. La app debe sentirse estable y operativa, no decorativa.

| Interaccion | Animacion |
| --- | --- |
| Abrir modales | Fade del overlay + zoom suave del contenido, `duration-200`. |
| Cerrar modales | Fade out + zoom out leve, `duration-150/200`. |
| Cambiar de pagina | Fade corto del contenido, maximo `duration-200`. |
| Mostrar alertas | Fade in + slide vertical pequeno, `duration-200/300`. |
| Hover en botones | Transicion de color/sombra, `transition-colors` o `transition-all`, `duration-150`. |
| Hover en cards clicables | Sombra leve o fondo `slate-50`, `duration-150/200`. |
| Cargar tablas/datos | Skeleton `animate-pulse`; no usar spinners grandes dentro de tablas. |

No usar rebotes, rotaciones decorativas, gradientes animados ni transiciones largas.

## 8. Reglas de consistencia

- Usar boton primario para la accion mas importante del bloque: crear, guardar, iniciar sesion o confirmar.
- Usar boton secundario para acciones complementarias: cancelar, limpiar, ver detalles, volver o exportar cuando no sea accion principal.
- Usar boton de peligro solo para eliminar, cancelar procesos irreversibles o confirmar salidas destructivas.
- Cada pagina debe iniciar con `h1` y una descripcion corta en `text-slate-500`.
- Los titulos de pagina usan `text-3xl font-bold text-slate-900 tracking-tight`.
- Los formularios van dentro de cards blancas con labels arriba, controles alineados y errores debajo del campo.
- Los formularios largos deben agruparse por secciones con titulos `text-lg font-bold`.
- Las tablas siempre van dentro de contenedor blanco con borde, header claro, filas con hover y acciones con iconos.
- Los estados semanticos se muestran con badge de color: rojo para riesgo/error, ambar para advertencia, emerald para exito, slate para neutro.
- Las alertas deben incluir icono, color semantico y mensaje breve.
- Los iconos deben venir de `lucide-react`; no crear SVG manuales para iconos comunes.
- Mantener radios consistentes: `rounded-lg` para controles, `rounded-xl/rounded-2xl` para cards y paneles grandes.
- Evitar mezclar `slate`, `gray` y `zinc`; usar `slate` como escala neutral oficial.
- No introducir paletas nuevas por modulo. Si un modulo necesita estado nuevo, mapearlo primero a azul, rojo, ambar, emerald o slate.

## 9. Aplicacion por modulos

### Login

- Pantalla centrada con `min-h-screen bg-slate-50 flex items-center justify-center p-4`.
- Card `w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100`.
- Marca arriba: icono en `bg-blue-100 text-blue-600 rounded-xl`, titulo `StockTrack360`.
- Formulario vertical con `space-y-5`.
- Inputs con labels arriba y placeholders claros.
- CTA principal ancho completo: `w-full bg-blue-600 hover:bg-blue-700 text-white py-3`.
- Enlace secundario en `text-blue-600 hover:text-blue-800`.

### Dashboard

- Header con titulo "Panel de Control" y descripcion.
- KPIs en grid `grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`.
- Cada KPI usa card blanca, icono semantico y valor `text-3xl font-bold`.
- Graficos en card grande `lg:col-span-2`, con bordes suaves y tooltips redondeados.
- Listas compactas en card, filas con hover sutil y badges para valores criticos.

### Productos

- Header responsive con titulo/descripion y boton primario "Anadir Producto".
- Toolbar blanca con buscador por nombre/SKU y select de categoria.
- Tabla como vista principal, con columnas alineadas segun dato:
  - Texto a la izquierda.
  - Numeros a la derecha.
  - Estados y acciones centrados.
- SKU en `font-mono text-slate-500`.
- Stock bajo en `text-red-600` o badge rojo.
- Acciones de editar/eliminar como icon buttons.

### Movimientos de inventario

- Formulario operacional arriba en card blanca.
- Selector de tipo como control segmentado:
  - Entrada activa en emerald.
  - Salida activa en rojo.
- Busqueda por SKU con icono `Search`.
- Cantidad centrada y con `font-semibold`.
- Boton de confirmacion fuerte; usar azul para guardar general o `slate-900` para confirmar movimiento operacional.
- Historial abajo en tabla con badges de entrada/salida.

### Alertas

- Header puede incluir icono de alerta en caja semantica.
- Tabs con borde inferior, icono y contador.
- Tab activo de stock bajo en azul o rojo segun contexto; vencimientos en ambar.
- Contenedor principal blanco con `rounded-2xl border border-slate-200`.
- Stock bajo usa rojo para datos criticos y CTA textual azul para orden de compra.
- Proximo a vencer usa ambar, y rojo si faltan 7 dias o menos.

### Reportes

- Mantener estructura de dashboard: header, filtros arriba, resultados abajo.
- Filtros en toolbar blanca: rango de fechas, categoria, usuario o tipo.
- Graficos en cards blancas con titulos `text-lg font-bold`.
- Tablas de detalle con el mismo patron de Productos.
- Exportar debe ser boton secundario salvo que sea la accion principal de la pantalla.

### Usuarios

- Header con titulo "Usuarios" y descripcion breve.
- Boton primario para crear usuario.
- Tabla con avatar/inicial, nombre, correo, rol, estado y acciones.
- Roles como badges neutros o azules.
- Estado activo en emerald, inactivo en slate, bloqueado/error en rojo.
- Acciones de editar, desactivar y eliminar con icon buttons.
- Formularios de usuario en modal o card, labels arriba y validacion debajo de cada campo.

## 10. Checklist para desarrolladores

Antes de entregar un modulo, verificar:

- La pantalla usa fondo `bg-slate-50` y superficies blancas.
- El header tiene `h1` `text-3xl font-bold text-slate-900 tracking-tight` y descripcion.
- Solo hay un boton primario por bloque principal.
- Inputs, selects y busquedas comparten borde, radio, padding y focus.
- Tablas tienen contenedor blanco, header claro, hover por fila y acciones con iconos.
- Errores, advertencias y exitos usan colores semanticos oficiales.
- Empty, loading y disabled estan implementados.
- El modulo no introduce colores, radios, sombras o tipografias nuevas sin justificar.
- Los mensajes al usuario usan los textos estandar de esta guia.
