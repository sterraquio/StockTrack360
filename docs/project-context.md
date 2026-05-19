# StockTrack360 — Documento maestro del proyecto

**Ruta sugerida en el repositorio:** `/docs/project-context.md`  
**Uso principal:** fuente de verdad para Codex, el equipo de desarrollo y la planeación del trabajo en Trello.  
**Tipo de producto:** MVP académico de aplicación web para gestión de inventario.  
**Equipo:** 3 integrantes.

---

## 0. Regla principal de este documento

Este archivo debe usarse como contexto principal antes de crear, modificar o refactorizar código del proyecto **StockTrack360**.

Cuando exista diferencia entre documentos previos, este documento consolida la decisión final para el MVP. Las funcionalidades que no estén descritas aquí no deben implementarse sin aprobación del equipo.

---

## 1. Descripción general del proyecto

**StockTrack360** es una aplicación web de gestión de inventario orientada a pequeños y medianos negocios de Colombia, como tiendas, panaderías, minimarkets, negocios de productos de consumo, papelerías, ferreterías pequeñas u otros comercios que necesitan controlar sus productos de forma centralizada.

El sistema permite administrar usuarios, productos, categorías, existencias, entradas y salidas de inventario, alertas operativas, dashboard e informes básicos. El objetivo del MVP es entregar una primera versión funcional, clara y mantenible, no una plataforma empresarial completa.

StockTrack360 se desarrollará como una aplicación web accesible desde navegador moderno. La arquitectura será **modular con enfoque hacia microservicios**, organizada en un **monorepo**. Para esta primera versión, los módulos estarán separados lógicamente por dominio, pero no se desplegarán como microservicios completamente independientes.

---

## 2. Problema

Muchos pequeños y medianos negocios gestionan su inventario de forma manual, en hojas de cálculo desordenadas o con procesos poco estandarizados. Esto genera problemas como:

- Dificultad para saber cuántas unidades hay disponibles de cada producto.
- Pérdida de control sobre entradas y salidas.
- Productos agotados sin detección oportuna.
- Productos vencidos o próximos a vencer sin seguimiento.
- Falta de historial de movimientos.
- Poca visibilidad para tomar decisiones básicas sobre reposición o rotación.
- Riesgo de errores por depender de registros manuales.

StockTrack360 busca resolver este problema mediante una plataforma web sencilla, centralizada y orientada al control operativo básico del inventario.

---

## 3. Objetivo general

Desarrollar una aplicación web de gestión de inventario para pequeños y medianos negocios de Colombia, que permita administrar productos, usuarios, existencias, movimientos, alertas y reportes básicos, mediante una arquitectura modular con enfoque hacia microservicios y control de acceso por roles.

---

## 4. Objetivos específicos

1. Implementar autenticación de usuarios mediante credenciales y token JWT.
2. Aplicar control de acceso basado en roles desde el backend.
3. Permitir la gestión de usuarios por parte del administrador.
4. Permitir el registro, edición, consulta y eliminación controlada de productos.
5. Clasificar productos mediante categorías predefinidas.
6. Permitir la consulta general del inventario con búsqueda y filtros.
7. Registrar entradas y salidas de inventario actualizando automáticamente el stock.
8. Mantener historial de movimientos con usuario responsable, fecha, tipo y cantidad.
9. Generar alertas de stock bajo según mínimo configurable.
10. Identificar productos vencidos y próximos a vencer en rangos de 7 y 30 días.
11. Mostrar un dashboard con indicadores principales del inventario.
12. Generar reportes básicos de stock bajo, vencimientos y productos con más salidas.
13. Mantener una estructura modular, clara y mantenible para facilitar el trabajo de tres integrantes.
14. Documentar el proyecto de forma suficiente para que Codex pueda trabajar sin inventar alcance.

---

## 5. Alcance del MVP

### 5.1 Funcionalidades que sí van en el MVP

El MVP de StockTrack360 incluye:

- Inicio de sesión con correo y contraseña.
- Generación de token JWT con información del usuario y su rol.
- Cierre de sesión.
- Restricción de rutas y acciones según rol.
- Gestión de usuarios por parte del administrador:
  - Registrar usuarios.
  - Consultar usuarios.
  - Editar nombre, rol y estado.
  - Bloquear o inactivar usuarios mediante estado.
- Gestión de productos:
  - Registrar producto.
  - Consultar producto.
  - Editar producto.
  - Eliminar producto solo si tiene stock igual a 0.
- Uso de categorías predefinidas.
- Inventario general:
  - Listado de productos.
  - Cantidad disponible.
  - Fecha de vencimiento o `N/A`.
  - Búsqueda por nombre y SKU.
  - Filtro por categoría.
  - Combinación de búsqueda y filtro.
  - Paginación para listados con más de 10 registros.
- Movimientos de inventario:
  - Registrar entradas.
  - Registrar salidas.
  - Validar cantidades.
  - Actualizar stock automáticamente.
  - Consultar historial de movimientos.
- Alertas:
  - Stock bajo.
  - Productos vencidos.
  - Productos próximos a vencer en 7 días.
  - Productos próximos a vencer en 30 días.
- Dashboard:
  - Total de productos.
  - Total de productos con stock bajo.
  - Total de productos vencidos.
  - Total de productos próximos a vencer.
  - Total de movimientos por periodo.
  - Productos con mayor número de movimientos.
- Reportes básicos en pantalla:
  - Productos con stock bajo.
  - Productos vencidos o próximos a vencer.
  - Productos con más salidas.
- Consulta integrada de producto con stock disponible.
- Degradación controlada si un módulo dependiente no responde.
- Estructura modular en monorepo.
- Prácticas básicas de DevOps:
  - Git.
  - README.
  - Ramas o control de cambios.
  - Evidencias de avances.
  - Despliegue sencillo si el equipo lo define.

### 5.2 Funcionalidades que no van en el MVP

No se deben implementar en esta versión:

- Facturación electrónica.
- Integración contable.
- Pasarelas de pago.
- Gestión avanzada de compras a proveedores.
- Gestión avanzada de ventas.
- Aplicación móvil nativa.
- Inteligencia artificial para predicción de demanda.
- Manejo avanzado de múltiples bodegas o sucursales.
- Lectores de código de barras.
- Integración con e-commerce.
- Analítica avanzada.
- Reportes financieros complejos.
- Creación, edición o eliminación de categorías por parte de usuarios.
- Microservicios con despliegues independientes.
- Sistema de permisos altamente granular.
- Inventario por lote avanzado.
- Trazabilidad contable o fiscal.

---

## 6. Restricciones

### 6.1 Restricciones funcionales

- Solo el administrador puede gestionar usuarios.
- Solo el administrador puede eliminar productos.
- No se puede eliminar un producto con stock mayor a 0.
- El SKU de un producto no se puede repetir.
- El SKU no se puede modificar después de crear el producto.
- El correo de usuario no se puede repetir.
- El correo de usuario no se puede modificar después de crear el usuario.
- La cantidad de una entrada debe ser un entero mayor a 0.
- La cantidad de una salida debe ser un entero mayor a 0.
- Una salida no puede superar el stock disponible.
- Si un producto no tiene fecha de vencimiento, debe mostrarse `N/A`.
- Si un producto no tiene stock mínimo configurado, no debe generar alerta de stock bajo.
- Las categorías son predefinidas y no se administran desde la interfaz en el MVP.

### 6.2 Restricciones técnicas

- El sistema debe funcionar desde navegador web moderno.
- No existe versión móvil nativa en el MVP.
- El backend debe validar permisos; no basta con ocultar botones en el frontend.
- El sistema debe usar autenticación basada en JWT.
- El JWT debe permitir identificar al usuario y su rol.
- Las operaciones de entrada y salida deben ser atómicas.
- Si falla la actualización del stock, el movimiento no debe quedar guardado.
- Los listados con más de 10 registros deben estar paginados.
- Las búsquedas y filtros deben responder en menos de 2 segundos con hasta 1000 productos en entorno de prueba.
- Si un módulo dependiente no responde, la aplicación debe mostrar información disponible y mensaje informativo, sin fallar completamente.
- La arquitectura debe mantenerse modular.
- El proyecto debe evitar complejidad innecesaria para el tamaño del equipo y el alcance académico.

---

## 7. Usuarios objetivo

StockTrack360 está dirigido a pequeños y medianos negocios que necesitan una herramienta sencilla para controlar inventario.

Usuarios potenciales:

- Administradores de tiendas.
- Encargados de inventario.
- Empleados autorizados para registrar entradas y salidas.
- Personal que necesita consultar existencias.
- Pequeños negocios de alimentos, bebidas, aseo, salud, cosméticos, papelería, ferretería, ropa u otras categorías.

---

## 8. Roles del sistema

### 8.1 Roles persistidos en el sistema

Para evitar contradicciones en el MVP, los roles persistidos en la base de datos y en el JWT serán:

| Rol | Descripción | Permisos principales |
|---|---|---|
| `ADMINISTRADOR` | Usuario con mayor nivel de acceso. Responsable de configuración y administración general. | Gestionar usuarios, gestionar productos, eliminar productos, registrar movimientos, consultar inventario, ver alertas, dashboard y reportes. |
| `USUARIO` | Usuario operativo o encargado de inventario. | Registrar entradas y salidas, consultar productos, consultar inventario, revisar alertas, historial, dashboard y reportes básicos. No gestiona usuarios ni elimina productos. |

### 8.2 Actores lógicos de la documentación

Los casos de uso también manejan actores lógicos. Estos no necesariamente son valores separados en la base de datos:

| Actor lógico | Significado |
|---|---|
| Usuario registrado | Cualquier usuario con credenciales válidas que inicia sesión. |
| Usuario autorizado | Usuario con permisos para operaciones de inventario. En el MVP se representa con `ADMINISTRADOR` o `USUARIO`. |
| Administrador | Actor con todos los privilegios. Equivale al rol `ADMINISTRADOR`. |

### 8.3 Decisión para Codex

Codex debe implementar únicamente los roles `ADMINISTRADOR` y `USUARIO`, salvo que el equipo solicite formalmente agregar otro rol.

No crear un rol adicional como `CONSULTA` en esta versión, porque no está definido como rol persistido en la ERS actual. Si más adelante se requiere, se agregará como ampliación controlada del alcance.

---

## 9. Requerimientos funcionales

### 9.1 Épica 1 — Autenticación y control de acceso

| Código | Requerimiento | Descripción |
|---|---|---|
| RF-01 | Inicio de sesión | El sistema debe permitir iniciar sesión con correo y contraseña válidos. |
| RF-02 | Generación de token | El sistema debe validar credenciales y generar un JWT con el rol del usuario. |
| RF-03 | Registro de usuarios | El administrador debe poder registrar nuevos usuarios. |
| RF-04 | Asignación obligatoria de rol | Al crear usuario se debe asignar un rol permitido: `ADMINISTRADOR` o `USUARIO`. |

### 9.2 Épica 2 — Gestión de usuarios

| Código | Requerimiento | Descripción |
|---|---|---|
| RF-05 | Validación de correo único | No se permite registrar dos usuarios con el mismo correo. |
| RF-06 | Consulta de usuarios | El administrador puede consultar usuarios con nombre, correo, rol y estado. |
| RF-07 | Edición de usuarios | El administrador puede editar nombre, rol y estado. |
| RF-08 | Restricción de edición de correo | El correo no puede modificarse después de creado. |

### 9.3 Épica 3 — Gestión de productos

| Código | Requerimiento | Descripción |
|---|---|---|
| RF-09 | Registro de productos | Registrar producto con nombre, categoría, SKU, fecha de vencimiento opcional y stock mínimo opcional. |
| RF-10 | Validación de SKU único | No se permite repetir SKU. |
| RF-11 | Stock inicial por defecto | Todo producto nuevo inicia con stock disponible en 0. |
| RF-12 | Fecha de vencimiento opcional | Si no se registra fecha de vencimiento, se guarda vacía y se muestra `N/A`. |
| RF-13 | Edición de productos | Permite editar nombre, categoría, fecha de vencimiento y stock mínimo, excepto SKU. |
| RF-14 | Consulta de producto | Permite consultar nombre, SKU, categoría, fecha de vencimiento, stock mínimo y cantidad disponible. |
| RF-15 | Eliminación de productos | El administrador puede eliminar productos previa confirmación. |
| RF-16 | Restricción de eliminación con stock | No se puede eliminar un producto con stock mayor a 0. |

### 9.4 Épica 4 — Visualización, búsqueda y filtrado del inventario

| Código | Requerimiento | Descripción |
|---|---|---|
| RF-17 | Visualización de inventario general | Mostrar nombre, SKU, categoría, cantidad disponible y fecha de vencimiento o `N/A`. |
| RF-18 | Búsqueda de productos | Buscar por coincidencia parcial en nombre y coincidencia exacta en SKU. |
| RF-19 | Filtro por categoría | Filtrar productos por categoría predefinida. |
| RF-20 | Combinación de búsqueda y filtros | Combinar búsqueda por texto y filtro por categoría. |
| RF-21 | Mensaje sin resultados | Mostrar mensaje cuando no existan productos coincidentes. |

### 9.5 Épica 5 — Movimientos de inventario

| Código | Requerimiento | Descripción |
|---|---|---|
| RF-22 | Registro de entradas | Registrar entradas para un producto seleccionado. |
| RF-23 | Validación de cantidad de entrada | La cantidad de entrada debe ser un entero mayor a 0. |
| RF-24 | Incremento automático de stock | Al registrar entrada, incrementar automáticamente el stock. |
| RF-25 | Registro de salidas | Registrar salidas para un producto seleccionado. |
| RF-26 | Validación de cantidad de salida | La cantidad de salida debe ser un entero mayor a 0. |
| RF-27 | Validación de stock disponible | La salida no puede superar el stock disponible. |
| RF-28 | Descuento automático de stock | Al registrar salida, descontar automáticamente del stock. |
| RF-29 | Consulta de historial | Consultar historial de movimientos. |
| RF-30 | Datos del historial | Mostrar fecha, hora, producto, tipo, cantidad y usuario responsable. |
| RF-31 | Ordenamiento de movimientos | Mostrar movimientos del más reciente al más antiguo. |

### 9.6 Épica 6 — Alertas de inventario

| Código | Requerimiento | Descripción |
|---|---|---|
| RF-32 | Consulta integrada de catálogo y stock | Integrar información de producto y stock en una sola respuesta. |
| RF-33 | Respuesta ante stock no disponible | Si el stock no está disponible, mostrar catálogo y texto `Stock temporalmente no disponible`. |
| RF-34 | Configuración de stock mínimo | Permitir stock mínimo por producto. Si queda vacío, no genera alerta. |
| RF-35 | Generación de alertas de stock bajo | Generar alerta cuando cantidad disponible sea igual o menor al stock mínimo. |
| RF-36 | Detección de productos vencidos | Listar productos con fecha de vencimiento anterior o igual a la fecha actual. |
| RF-37 | Detección próximos a vencer — 7 días | Identificar productos que vencen en los próximos 7 días. |
| RF-38 | Detección próximos a vencer — 30 días | Identificar productos que vencen en los próximos 30 días. |

### 9.7 Épica 7 — Dashboard e indicadores

| Código | Requerimiento | Descripción |
|---|---|---|
| RF-39 | Total de productos | Mostrar total de productos registrados. |
| RF-40 | Productos con stock bajo | Mostrar total de productos en stock bajo. |
| RF-41 | Productos vencidos o por vencer | Mostrar total de productos vencidos y próximos a vencer. |
| RF-42 | Total de movimientos por periodo | Mostrar total de movimientos en un periodo determinado. |
| RF-43 | Productos con más movimientos | Mostrar productos con mayor número de movimientos. |

### 9.8 Épica 8 — Reportes básicos

| Código | Requerimiento | Descripción |
|---|---|---|
| RF-44 | Reporte de stock bajo | Listar productos con cantidad disponible igual o menor al stock mínimo. |
| RF-45 | Reporte de vencidos o próximos a vencer | Listar productos vencidos y próximos a vencer en rangos de 7 y 30 días. |
| RF-46 | Reporte de productos con más salidas | Listar productos con mayor número de salidas, ordenados de mayor a menor. |

---

## 10. Requerimientos no funcionales

| Código | Descripción |
|---|---|
| RNF-01 | Aplicar RBAC para restringir funcionalidades según rol. La validación debe realizarse en backend. |
| RNF-02 | Mostrar mensajes genéricos durante autenticación para no revelar si falló correo, contraseña o estado. |
| RNF-03 | Garantizar unicidad de correo y SKU. |
| RNF-04 | Preservar inmutabilidad de correo y SKU una vez creados. |
| RNF-05 | La interfaz debe mostrar todos los campos definidos sin ocultarlos ni reemplazarlos por texto incompleto en la resolución mínima soportada. |
| RNF-06 | Los listados con más de 10 registros deben estar paginados. |
| RNF-07 | Resaltar visualmente en rojo las cantidades iguales a 0 en el inventario general. |
| RNF-08 | Las búsquedas y filtros deben responder en menos de 2 segundos con hasta 1000 productos en entorno de prueba. |
| RNF-09 | Las entradas y salidas deben ser atómicas: si falla la actualización de stock, no se guarda el movimiento. |
| RNF-10 | Ante fallo de un módulo dependiente, la aplicación debe degradarse de forma controlada sin fallar completamente. |

---

## 11. Historias de usuario

### 11.1 Épica 1 — Autenticación y control de acceso

#### HU-01 — Iniciar sesión en el sistema

**Como** usuario registrado,  
**quiero** iniciar sesión con mi correo electrónico y contraseña,  
**para** acceder a las funcionalidades permitidas según mi rol.

- Prioridad: Alta
- Complejidad: Media
- Relacionado con: RF-01, RF-02, RNF-01, RNF-02

#### HU-02 — Cerrar sesión en el sistema

**Como** usuario autenticado,  
**quiero** cerrar mi sesión,  
**para** evitar que otras personas usen el sistema con mi cuenta.

- Prioridad: Alta
- Complejidad: Baja
- Relacionado con: RF-01, RNF-01

#### HU-03 — Restringir funcionalidades según el rol

**Como** administrador del sistema,  
**quiero** que las funcionalidades estén restringidas según el rol de cada usuario,  
**para** evitar accesos no autorizados a operaciones sensibles.

- Prioridad: Alta
- Complejidad: Media
- Relacionado con: RF-04, RNF-01

### 11.2 Épica 2 — Gestión de usuarios

#### HU-04 — Registrar usuarios

**Como** administrador,  
**quiero** registrar nuevos usuarios en el sistema,  
**para** permitir que otras personas autorizadas accedan a la aplicación.

- Prioridad: Alta
- Complejidad: Media
- Relacionado con: RF-03, RF-04, RF-05, RNF-03

#### HU-05 — Consultar usuarios registrados

**Como** administrador,  
**quiero** consultar la lista de usuarios registrados,  
**para** revisar quiénes tienen acceso al sistema y qué rol tiene cada uno.

- Prioridad: Media
- Complejidad: Baja
- Relacionado con: RF-06, RNF-05, RNF-06

#### HU-06 — Editar usuarios

**Como** administrador,  
**quiero** editar la información básica de un usuario,  
**para** mantener actualizados sus datos y permisos de acceso.

- Prioridad: Media
- Complejidad: Media
- Relacionado con: RF-07, RF-08, RNF-04

### 11.3 Épica 3 — Gestión de productos

#### HU-07 — Registrar productos

**Como** administrador o usuario autorizado,  
**quiero** registrar productos con sus datos principales,  
**para** incorporarlos al inventario del negocio.

- Prioridad: Alta
- Complejidad: Media
- Relacionado con: RF-09, RF-10, RF-11, RF-12, RF-34, RNF-03

#### HU-08 — Usar categorías predefinidas

**Como** usuario del sistema,  
**quiero** seleccionar categorías predefinidas al registrar o filtrar productos,  
**para** clasificar el inventario de forma organizada desde la primera versión.

- Prioridad: Alta
- Complejidad: Baja
- Relacionado con: RF-09, RF-19

#### HU-09 — Editar productos

**Como** administrador o usuario autorizado,  
**quiero** editar la información de un producto,  
**para** corregir o actualizar sus datos cuando sea necesario.

- Prioridad: Alta
- Complejidad: Media
- Relacionado con: RF-13, RNF-04

#### HU-10 — Consultar productos

**Como** usuario del sistema,  
**quiero** consultar los productos registrados,  
**para** conocer sus datos principales y disponibilidad.

- Prioridad: Alta
- Complejidad: Baja
- Relacionado con: RF-14, RF-17, RNF-05

#### HU-11 — Eliminar productos

**Como** administrador,  
**quiero** eliminar productos del sistema cuando ya no deban mantenerse registrados,  
**para** depurar el catálogo de productos.

- Prioridad: Media
- Complejidad: Media
- Relacionado con: RF-15, RF-16

### 11.4 Épica 4 — Visualización, búsqueda y filtrado del inventario

#### HU-12 — Visualizar inventario general

**Como** usuario del sistema,  
**quiero** visualizar un listado general del inventario,  
**para** conocer las existencias actuales de los productos.

- Prioridad: Alta
- Complejidad: Media
- Relacionado con: RF-17, RNF-05, RNF-06, RNF-07

#### HU-13 — Buscar productos

**Como** usuario del sistema,  
**quiero** buscar productos por nombre o SKU,  
**para** encontrarlos rápidamente dentro del inventario.

- Prioridad: Alta
- Complejidad: Media
- Relacionado con: RF-18, RF-21, RNF-08

#### HU-14 — Filtrar productos por categoría

**Como** usuario del sistema,  
**quiero** filtrar productos por categoría,  
**para** consultar grupos específicos de productos dentro del inventario.

- Prioridad: Media
- Complejidad: Baja
- Relacionado con: RF-19, RF-20, RNF-08

### 11.5 Épica 5 — Movimientos de inventario

#### HU-15 — Registrar entrada de inventario

**Como** administrador o usuario autorizado,  
**quiero** registrar entradas de productos,  
**para** aumentar el stock cuando ingresen nuevas unidades al negocio.

- Prioridad: Alta
- Complejidad: Media
- Relacionado con: RF-22, RF-23, RF-24, RNF-09

#### HU-16 — Registrar salida de inventario

**Como** administrador o usuario autorizado,  
**quiero** registrar salidas de productos,  
**para** reflejar disminuciones del stock cuando se retiren unidades del inventario.

- Prioridad: Alta
- Complejidad: Media
- Relacionado con: RF-25, RF-26, RF-27, RF-28, RNF-09

#### HU-17 — Consultar historial de movimientos

**Como** administrador o usuario autorizado,  
**quiero** consultar el historial de movimientos de inventario,  
**para** hacer seguimiento a las entradas y salidas registradas.

- Prioridad: Alta
- Complejidad: Media
- Relacionado con: RF-29, RF-30, RF-31, RNF-05

### 11.6 Épica 6 — Alertas de inventario

#### HU-18 — Consultar alertas de stock bajo

**Como** usuario del sistema,  
**quiero** visualizar los productos con stock bajo,  
**para** identificar qué productos necesitan reposición.

- Prioridad: Alta
- Complejidad: Media
- Relacionado con: RF-34, RF-35

#### HU-19 — Consultar productos vencidos

**Como** usuario del sistema,  
**quiero** visualizar los productos vencidos,  
**para** tomar decisiones sobre su retiro o revisión.

- Prioridad: Media
- Complejidad: Media
- Relacionado con: RF-36

#### HU-20 — Consultar productos próximos a vencer

**Como** usuario del sistema,  
**quiero** visualizar los productos próximos a vencer en 7 y 30 días,  
**para** tomar decisiones anticipadas sobre su uso, venta o reposición.

- Prioridad: Media
- Complejidad: Media
- Relacionado con: RF-37, RF-38

### 11.7 Épica 7 — Dashboard e indicadores

#### HU-21 — Visualizar dashboard general del inventario

**Como** usuario autenticado,  
**quiero** visualizar un dashboard con indicadores principales del inventario,  
**para** conocer rápidamente el estado general del negocio.

- Prioridad: Media
- Complejidad: Alta
- Relacionado con: RF-39, RF-40, RF-41, RF-42, RF-43

### 11.8 Épica 8 — Reportes básicos

#### HU-22 — Consultar reporte de productos con stock bajo

**Como** usuario autenticado,  
**quiero** consultar un reporte de productos con stock bajo,  
**para** apoyar decisiones de reposición.

- Prioridad: Media
- Complejidad: Baja
- Relacionado con: RF-44

#### HU-23 — Consultar reporte de productos vencidos o próximos a vencer

**Como** usuario autenticado,  
**quiero** consultar un reporte de productos vencidos o próximos a vencer,  
**para** revisar productos que requieren atención prioritaria.

- Prioridad: Media
- Complejidad: Media
- Relacionado con: RF-45

#### HU-24 — Consultar reporte de productos con más salidas

**Como** administrador,  
**quiero** consultar los productos con más salidas registradas,  
**para** identificar productos con mayor rotación operativa.

- Prioridad: Media
- Complejidad: Media
- Relacionado con: RF-46

### 11.9 Épica 9 — Consulta integrada entre módulos

#### HU-25 — Consultar productos junto con su stock disponible

**Como** usuario del sistema,  
**quiero** consultar la información del producto junto con su disponibilidad en inventario,  
**para** obtener una vista unificada sin revisar módulos separados.

- Prioridad: Alta
- Complejidad: Alta
- Relacionado con: RF-32, RF-33, RNF-10

---

## 12. Criterios de aceptación consolidados

| HU | Criterios de aceptación |
|---|---|
| HU-01 | Permite ingresar correo y contraseña. Si son correctos, permite acceso e identifica rol. Si son incorrectos, muestra `Usuario o contraseña incorrectos` sin revelar el motivo. |
| HU-02 | Muestra opción de cerrar sesión. Al cerrar, impide acceso a rutas protegidas y redirige al login. |
| HU-03 | Reconoce rol autenticado. Restringe funciones administrativas. Valida permisos desde backend. Muestra `Acceso denegado` si no hay permiso. |
| HU-04 | Solo administrador registra usuarios. Solicita nombre, correo, contraseña, rol y estado. Valida rol, duplicados y campos obligatorios. |
| HU-05 | Muestra tabla de usuarios con nombre, correo, rol y estado. Si hay más de 10, pagina. Solo administrador accede. |
| HU-06 | Permite editar nombre, rol y estado. No permite editar correo. Valida campos obligatorios. Muestra confirmación. |
| HU-07 | Registra nombre, categoría, SKU, fecha de vencimiento opcional y stock mínimo opcional. SKU único. Stock inicial 0. Muestra confirmación. |
| HU-08 | Carga categorías predefinidas en formularios y filtros. No permite crear, editar ni eliminar categorías en el MVP. |
| HU-09 | Permite editar nombre, categoría, fecha de vencimiento y stock mínimo. No permite editar SKU. Valida campos obligatorios. |
| HU-10 | Muestra nombre, SKU, categoría, fecha de vencimiento, stock mínimo y cantidad disponible. Si no hay vencimiento, muestra `N/A`. |
| HU-11 | Solo administrador elimina. Solicita confirmación. No elimina si stock > 0. Elimina si stock = 0 y se confirma. |
| HU-12 | Muestra inventario con nombre, SKU, categoría, cantidad disponible y vencimiento. Resalta cantidad 0 en rojo. Pagina si supera 10 registros. |
| HU-13 | Busca por nombre parcial y SKU exacto. Muestra mensaje si no hay resultados. Responde en menos de 2 segundos con hasta 1000 productos. |
| HU-14 | Filtra por categoría predefinida. Permite combinar filtro con búsqueda. Muestra mensaje si no hay resultados. |
| HU-15 | Registra entrada con producto y cantidad entera > 0. Aumenta stock. Guarda movimiento con fecha, hora, producto, cantidad, tipo y usuario. Si falla stock, no guarda movimiento. |
| HU-16 | Registra salida con cantidad entera > 0. Valida stock suficiente. Disminuye stock. Si falla stock, no guarda movimiento. |
| HU-17 | Lista movimientos con fecha, hora, producto, tipo, cantidad y usuario. Ordena del más reciente al más antiguo. Pagina si supera 10. |
| HU-18 | Identifica productos con stock disponible <= stock mínimo. Ignora productos sin stock mínimo. Muestra nombre, SKU, categoría, cantidad y stock mínimo. |
| HU-19 | Identifica productos con vencimiento anterior o igual a la fecha actual. Ignora productos sin vencimiento. |
| HU-20 | Identifica productos que vencen en próximos 7 y 30 días. Ignora productos sin vencimiento. |
| HU-21 | Dashboard muestra totales de productos, stock bajo, vencidos, próximos a vencer, movimientos por periodo y productos con más movimientos. |
| HU-22 | Reporte muestra productos con stock bajo: nombre, SKU, categoría, cantidad disponible y stock mínimo. |
| HU-23 | Reporte muestra productos vencidos y próximos a vencer en 7 y 30 días con nombre, SKU, categoría, cantidad y vencimiento. |
| HU-24 | Reporte muestra producto, SKU, categoría y cantidad total de salidas, ordenados de mayor a menor. |
| HU-25 | Muestra producto con stock integrado. Si inventario no responde, muestra datos de catálogo y `Stock temporalmente no disponible`. No debe fallar completamente. |

---

## 13. Priorización MoSCoW

### Must Have — Obligatorio para el MVP

- Inicio de sesión.
- JWT con rol.
- Control de acceso por rol desde backend.
- Gestión básica de usuarios.
- Registro, consulta y edición de productos.
- SKU único e inmutable.
- Correo único e inmutable.
- Categorías predefinidas.
- Inventario general.
- Búsqueda por nombre y SKU.
- Filtro por categoría.
- Registro de entradas.
- Registro de salidas.
- Validación de stock disponible.
- Actualización automática de stock.
- Historial de movimientos.
- Alerta de stock bajo.
- Productos vencidos.
- Productos próximos a vencer.
- Consulta integrada producto + stock.
- Paginación en listados mayores a 10 registros.
- Restricciones transaccionales básicas de inventario.

### Should Have — Importante, pero puede ajustarse si el tiempo es limitado

- Dashboard general.
- Reporte de stock bajo.
- Reporte de vencidos y próximos a vencer.
- Reporte de productos con más salidas.
- Indicadores por periodo.
- Productos con más movimientos.
- Mensajes informativos cuando no hay datos.
- Degradación controlada ante fallo parcial de módulo dependiente.

### Could Have — Deseable si el equipo avanza bien

- Mejoras visuales del dashboard.
- Filtros adicionales por fecha en historial o reportes.
- Exportación básica a CSV.
- Validaciones visuales más detalladas.
- Skeleton loaders.
- Estados vacíos más elaborados.
- Búsqueda con debounce.

### Won't Have — Fuera del MVP

- Facturación electrónica.
- Integración contable.
- Pasarela de pagos.
- Aplicación móvil nativa.
- IA para predicción de demanda.
- Múltiples bodegas o sucursales.
- Lectores de código de barras.
- E-commerce.
- Reportes financieros complejos.
- Gestión avanzada de compras.
- Gestión avanzada de ventas.
- CRUD de categorías desde la interfaz.
- Microservicios independientes con despliegues separados.

---

## 14. Módulos del sistema

| Módulo | Responsabilidad |
|---|---|
| Autenticación | Login, logout, generación y validación de JWT, protección de rutas. |
| Usuarios | CRUD administrativo de usuarios, roles y estados. |
| Categorías | Consulta de categorías predefinidas. No incluye CRUD en MVP. |
| Productos | Registro, edición, consulta y eliminación controlada de productos. |
| Inventario | Consulta de stock disponible y estado general del inventario. |
| Movimientos | Registro de entradas y salidas, historial y actualización transaccional de stock. |
| Alertas | Stock bajo, vencidos, próximos a vencer 7/30 días. |
| Dashboard | Indicadores principales del inventario. |
| Reportes | Listados de stock bajo, vencimiento y productos con más salidas. |
| Frontend | Vistas, componentes reutilizables, formularios, tablas y consumo de API. |
| API Gateway lógico | Punto central de acceso a endpoints/módulos. En el MVP puede ser la capa de rutas API del backend. |
| Base de datos | Persistencia relacional de usuarios, categorías, productos y movimientos. |

---

## 15. Arquitectura propuesta

### 15.1 Estilo arquitectónico

La arquitectura oficial para el MVP será:

**Arquitectura modular con enfoque hacia microservicios, organizada en monorepo.**

Esto significa:

- El proyecto estará en un único repositorio.
- Los módulos se separan por dominio.
- No se deben mezclar responsabilidades.
- No se implementan microservicios independientes en despliegues separados para esta versión.
- La separación modular debe permitir evolucionar en el futuro hacia servicios independientes.

### 15.2 Estilos complementarios

| Estilo | Aplicación |
|---|---|
| Arquitectura por capas | Separar presentación, rutas/controladores, lógica de negocio y acceso a datos. |
| Cliente-servidor | El navegador consume servicios del backend. |
| Enfoque hacia microservicios | Los módulos se organizan por dominio y podrán evolucionar luego. |

### 15.3 Tecnologías base

| Capa | Tecnología |
|---|---|
| Frontend | React + JavaScript |
| Estilos frontend | Tailwind CSS si ya está definido en el repositorio del equipo. No introducir otra librería de UI sin aprobación. |
| Backend | Next.js + JavaScript |
| Base de datos | PostgreSQL con Supabase |
| Autenticación | JWT |
| Diseño/prototipo | Figma |
| Documentación | README en Git + `/docs` |
| Control de versiones | Git |

### 15.4 Estructura modular sugerida

La estructura exacta puede variar según el repositorio, pero Codex debe conservar una organización parecida a esta:

```txt
/docs
  project-context.md
  frontend-guidelines.md
  requirements.md
  user-stories.md
  architecture.md

/src
  /app
    /login
    /dashboard
    /products
    /inventory
    /movements
    /alerts
    /reports

  /components
    /ui
    /layout
    /forms
    /tables
    /feedback

  /modules
    /auth
    /users
    /categories
    /products
    /inventory
    /movements
    /alerts
    /dashboard
    /reports

  /lib
    supabaseClient.js
    auth.js
    permissions.js
    validators.js

  /services
    authService.js
    userService.js
    productService.js
    inventoryService.js
    movementService.js
    alertService.js
    reportService.js

  /api
    /auth
    /users
    /products
    /inventory
    /movements
    /alerts
    /dashboard
    /reports
```

### 15.5 Regla de arquitectura para Codex

Codex no debe convertir el proyecto en una infraestructura distribuida compleja. Debe mantener módulos claros dentro del monorepo y usar una capa API centralizada que actúe como API Gateway lógico.

---

## 16. Entidades principales

### 16.1 Usuario

Representa una persona que puede acceder al sistema.

| Campo | Tipo sugerido | Reglas |
|---|---|---|
| id | UUID / serial | PK |
| nombre | string | Obligatorio |
| correo | string | Único, obligatorio, inmutable |
| contraseña | string hash | Obligatorio. Nunca guardar texto plano. |
| rol | enum | `ADMINISTRADOR` o `USUARIO` |
| estado | enum/boolean | Activo / Inactivo |

### 16.2 Categoría

Representa una clasificación predefinida de productos.

| Campo | Tipo sugerido | Reglas |
|---|---|---|
| id | UUID / serial | PK |
| nombre | string | Único, obligatorio |

Categorías iniciales sugeridas:

| Categoría | Vencimiento típico |
|---|---|
| Alimentos y bebidas | Sí |
| Aseo y limpieza | Sí |
| Salud y medicamentos | Sí |
| Cosméticos y cuidado personal | Sí |
| Papelería y oficina | No |
| Ferretería y herramientas | No |
| Ropa y accesorios | No |
| Otros | Opcional |

### 16.3 Producto

Representa un producto administrado en el inventario.

| Campo | Tipo sugerido | Reglas |
|---|---|---|
| id | UUID / serial | PK |
| categoria_id | FK | Obligatorio |
| nombre | string | Obligatorio |
| sku | string | Único, obligatorio, inmutable |
| fecha_vencimiento | date/null | Opcional. Si es null, mostrar `N/A`. |
| stock_minimo | integer/null | Opcional. Si es null, no genera alerta. |
| stock_disponible | integer | Inicia en 0. No debe ser negativo. |

### 16.4 MovimientoInventario

Representa una entrada o salida de inventario.

| Campo | Tipo sugerido | Reglas |
|---|---|---|
| id | UUID / serial | PK |
| producto_id | FK | Obligatorio |
| usuario_id | FK | Obligatorio |
| tipo | enum | `ENTRADA` o `SALIDA` |
| cantidad | integer | Obligatorio, entero > 0 |
| fecha_hora | timestamp | Obligatorio, generado por sistema |

### 16.5 Alertas

Las alertas no necesitan ser una tabla persistida en el MVP. Pueden calcularse dinámicamente con consultas sobre productos e inventario.

Tipos:

- Stock bajo.
- Producto vencido.
- Producto próximo a vencer en 7 días.
- Producto próximo a vencer en 30 días.

### 16.6 Reportes

Los reportes pueden calcularse dinámicamente a partir de productos y movimientos.

Tipos:

- Stock bajo.
- Vencidos o próximos a vencer.
- Productos con más salidas.

---

## 17. Reglas de negocio

1. Todo usuario debe tener un rol válido.
2. El rol debe incluirse en el token JWT.
3. El backend debe validar permisos en cada acción protegida.
4. El frontend puede ocultar opciones, pero eso no reemplaza la validación del backend.
5. El correo de usuario es único.
6. El correo de usuario no se edita.
7. El SKU es único.
8. El SKU no se edita.
9. Todo producto nuevo inicia con `stock_disponible = 0`.
10. Si un producto no tiene fecha de vencimiento, se muestra `N/A`.
11. Si un producto no tiene stock mínimo, no genera alerta de stock bajo.
12. Un producto con stock mayor a 0 no puede eliminarse.
13. La eliminación de producto requiere confirmación.
14. Una entrada debe tener cantidad entera mayor a 0.
15. Una salida debe tener cantidad entera mayor a 0.
16. Una salida no puede superar el stock disponible.
17. El stock disponible nunca debe quedar negativo.
18. Toda entrada aumenta el stock.
19. Toda salida disminuye el stock.
20. Todo movimiento debe guardar usuario responsable.
21. Todo movimiento debe guardar fecha y hora.
22. Los movimientos se muestran del más reciente al más antiguo.
23. Los listados con más de 10 registros deben paginarse.
24. Las cantidades iguales a 0 deben resaltarse visualmente en el inventario.
25. La búsqueda por nombre acepta coincidencia parcial.
26. La búsqueda por SKU exige coincidencia exacta.
27. La búsqueda y filtro deben poder combinarse.
28. Si no hay resultados, se muestra mensaje claro.
29. Si un módulo dependiente falla, se debe mostrar información disponible y mensaje informativo.
30. Las categorías no se crean, editan ni eliminan desde la interfaz en el MVP.

---

## 18. Alertas de bajo stock y vencimiento

### 18.1 Alerta de stock bajo

Condición:

```txt
stock_minimo IS NOT NULL
AND stock_disponible <= stock_minimo
```

Comportamiento:

- Mostrar nombre, SKU, categoría, cantidad disponible y stock mínimo.
- Si no hay productos en stock bajo, mostrar mensaje informativo.
- Si `stock_minimo` está vacío, el producto no genera alerta.
- Esta alerta debe aparecer en:
  - Sección de alertas.
  - Dashboard.
  - Reporte de stock bajo.
  - Inventario general si el diseño lo permite.

### 18.2 Producto vencido

Condición:

```txt
fecha_vencimiento IS NOT NULL
AND fecha_vencimiento <= fecha_actual
```

Comportamiento:

- Mostrar nombre, SKU, categoría, cantidad disponible y fecha de vencimiento.
- Si no hay productos vencidos, mostrar mensaje informativo.
- Los productos sin fecha de vencimiento no aparecen en este listado.

### 18.3 Producto próximo a vencer en 7 días

Condición sugerida:

```txt
fecha_vencimiento IS NOT NULL
AND fecha_vencimiento > fecha_actual
AND fecha_vencimiento <= fecha_actual + 7 días
```

Comportamiento:

- Mostrar productos que requieren atención inmediata.
- Mostrar nombre, SKU, categoría, cantidad disponible y fecha de vencimiento.

### 18.4 Producto próximo a vencer en 30 días

Condición sugerida:

```txt
fecha_vencimiento IS NOT NULL
AND fecha_vencimiento > fecha_actual
AND fecha_vencimiento <= fecha_actual + 30 días
```

Comportamiento:

- Mostrar productos que requieren seguimiento preventivo.
- Para evitar duplicados visuales, la interfaz puede separar:
  - Próximos 7 días.
  - Entre 8 y 30 días.
- Si el reporte se define como “próximos 30 días”, puede incluir todos los productos dentro del rango de 1 a 30 días.

---

## 19. Reportes

### 19.1 Reporte de productos con stock bajo

Debe mostrar:

- Nombre del producto.
- SKU.
- Categoría.
- Cantidad disponible.
- Stock mínimo.

Orden sugerido:

1. Menor cantidad disponible.
2. Nombre del producto.

### 19.2 Reporte de productos vencidos o próximos a vencer

Debe mostrar:

- Nombre del producto.
- SKU.
- Categoría.
- Cantidad disponible.
- Fecha de vencimiento.
- Estado:
  - Vencido.
  - Próximo a vencer en 7 días.
  - Próximo a vencer en 30 días.

Orden sugerido:

1. Vencidos primero.
2. Fecha de vencimiento más cercana.
3. Nombre del producto.

### 19.3 Reporte de productos con más salidas

Debe mostrar:

- Nombre del producto.
- SKU.
- Categoría.
- Cantidad total de salidas.

Orden:

- De mayor a menor cantidad total de salidas.

Regla:

- Solo contar movimientos de tipo `SALIDA`.

---

## 20. Guía para el frontend

### 20.1 Principios generales

El frontend debe ser:

- Claro.
- Sencillo.
- Modular.
- Consistente.
- Fácil de mantener por tres integrantes.
- Basado en componentes reutilizables.
- Sin lógica de negocio crítica que solo exista en la interfaz.

### 20.2 Vistas principales

| Vista | Descripción |
|---|---|
| Login | Formulario de correo y contraseña. |
| Dashboard | Indicadores principales del inventario. |
| Usuarios | Gestión administrativa de usuarios. Solo administrador. |
| Productos | Registro, edición, consulta y eliminación controlada. |
| Inventario | Tabla general con búsqueda, filtros, stock y vencimiento. |
| Movimientos | Registro de entradas/salidas e historial. |
| Alertas | Stock bajo, vencidos y próximos a vencer. |
| Reportes | Reportes básicos en pantalla. |
| Acceso denegado | Mensaje cuando el usuario no tiene permiso. |
| No encontrado | Ruta inexistente o recurso no encontrado. |

### 20.3 Componentes compartidos sugeridos

Crear componentes reutilizables antes de construir pantallas completas:

| Componente | Uso |
|---|---|
| `Button` | Acciones principales y secundarias. |
| `Input` | Campos de texto, correo, contraseña, búsqueda. |
| `Select` | Rol, estado, categoría, tipo de movimiento. |
| `Card` | Contenedores para indicadores y secciones. |
| `Table` | Listados de usuarios, productos, inventario, movimientos y reportes. |
| `Modal` | Confirmaciones, edición rápida o formularios si aplica. |
| `Alert` | Mensajes de error, éxito o advertencia. |
| `Badge` | Estados, roles, stock bajo, vencido. |
| `Sidebar` | Navegación principal. |
| `Navbar` | Información de sesión y cierre de sesión. |
| `Loader` | Carga de datos. |
| `EmptyState` | Pantallas sin resultados. |
| `Pagination` | Listados con más de 10 registros. |

### 20.4 Reglas visuales

- Usar la misma estructura de tabla para usuarios, productos, inventario, movimientos y reportes.
- Mostrar estados con badges.
- Resaltar stock igual a 0 en rojo.
- Mostrar `N/A` cuando no exista fecha de vencimiento.
- No ocultar campos importantes en la resolución mínima soportada.
- Evitar textos ambiguos.
- Mostrar mensajes claros cuando no existan resultados.
- Mantener formularios simples y con validación visible.

### 20.5 Validaciones frontend

El frontend debe validar antes de enviar:

- Campos obligatorios.
- Correo con formato válido.
- Contraseña no vacía.
- Rol seleccionado.
- Categoría seleccionada.
- SKU no vacío.
- Cantidad entera mayor a 0.
- Salida no mayor al stock disponible, si el dato está disponible en pantalla.
- Fecha de vencimiento válida si se ingresa.

Importante: estas validaciones no reemplazan la validación del backend.

### 20.6 Consumo de API

Cada módulo debe consumir servicios separados:

- `authService`
- `userService`
- `productService`
- `inventoryService`
- `movementService`
- `alertService`
- `dashboardService`
- `reportService`

No hacer llamadas directas dispersas desde cualquier componente. Centralizar llamadas en servicios o hooks del módulo.

### 20.7 Protección de rutas

- Si el usuario no está autenticado, redirigir a login.
- Si está autenticado pero no tiene permiso, mostrar acceso denegado.
- El menú debe mostrar opciones según rol.
- El backend siempre debe validar permisos.

---

## 21. Distribución del trabajo para 3 integrantes

### Integrante 1 — Autenticación, usuarios y seguridad

Responsabilidades:

- Modelo de usuario.
- Login.
- JWT.
- Middleware o guardas de autenticación.
- Control de permisos por rol.
- Gestión de usuarios.
- Validación de correo único.
- Estado activo/inactivo.
- Protección de rutas administrativas.
- Evidencias de login, usuarios y acceso denegado.

Entregables:

- Login funcional.
- CRUD administrativo de usuarios.
- Restricción por rol.
- Capturas de inicio de sesión y validaciones.

### Integrante 2 — Productos, categorías, inventario y movimientos

Responsabilidades:

- Modelo de categoría.
- Modelo de producto.
- Registro, edición, consulta y eliminación controlada de productos.
- Validación de SKU único.
- Stock inicial en 0.
- Registro de entradas.
- Registro de salidas.
- Actualización automática de stock.
- Historial de movimientos.
- Validaciones transaccionales.

Entregables:

- Gestión de productos.
- Inventario general.
- Entradas y salidas funcionales.
- Historial de movimientos.
- Capturas de CRUD, validaciones y actualización de stock.

### Integrante 3 — Frontend general, alertas, dashboard, reportes e integración

Responsabilidades:

- Layout general.
- Componentes compartidos.
- Tablas, formularios y estados visuales.
- Alertas de stock bajo.
- Alertas de vencimiento.
- Dashboard.
- Reportes.
- Integración visual entre módulos.
- Mensajes de error, loaders, empty states.
- Revisión final de consistencia UI.

Entregables:

- Interfaz consistente.
- Sección de alertas.
- Dashboard.
- Reportes.
- Capturas de vistas principales e integración.

### Responsabilidades compartidas

Los tres integrantes deben:

- Usar el mismo estándar de nombres.
- Actualizar Trello con evidencia.
- Documentar cambios importantes.
- Evitar duplicar componentes.
- Revisar conflictos antes de hacer merge.
- Probar el flujo completo antes de entregar.

---

## 22. Tareas sugeridas para Trello

Estas tareas están agrupadas para no saturar el tablero con demasiadas tarjetas. Cada tarjeta debe incluir descripción corta, técnica usada y evidencia esperada.

### 22.1 Configuración inicial del proyecto

**Descripción:** preparar repositorio, estructura modular, dependencias, README inicial y conexión base con Supabase.  
**Técnica:** configuración de entorno, monorepo modular, documentación inicial.  
**Evidencia:** captura del repositorio, estructura de carpetas, README y aplicación ejecutándose.

### 22.2 Base de datos y modelos principales

**Descripción:** crear tablas o modelos para usuarios, categorías, productos y movimientos.  
**Técnica:** modelado relacional, restricciones de unicidad, llaves foráneas.  
**Evidencia:** capturas de tablas en Supabase o migraciones ejecutadas.

### 22.3 Inicio de sesión y JWT

**Descripción:** implementar login con correo y contraseña, generación de JWT y manejo de sesión.  
**Técnica:** autenticación basada en token.  
**Evidencia:** captura de login exitoso, login fallido y token/sesión activa sin exponer datos sensibles.

### 22.4 Control de acceso por roles

**Descripción:** restringir rutas y acciones según `ADMINISTRADOR` o `USUARIO`.  
**Técnica:** RBAC, middleware, guards o validación backend.  
**Evidencia:** captura de acceso permitido y acceso denegado.

### 22.5 Gestión de usuarios

**Descripción:** permitir al administrador registrar, consultar y editar usuarios.  
**Técnica:** CRUD administrativo con validación de correo único.  
**Evidencia:** capturas de formulario, tabla, edición y validación de correo duplicado.

### 22.6 Gestión de productos y categorías

**Descripción:** registrar, consultar, editar y eliminar productos con categorías predefinidas.  
**Técnica:** CRUD, validación de SKU único, eliminación condicionada por stock.  
**Evidencia:** capturas de creación, edición, listado y bloqueo de eliminación con stock mayor a 0.

### 22.7 Inventario, búsqueda y filtros

**Descripción:** construir inventario general con búsqueda por nombre/SKU y filtro por categoría.  
**Técnica:** consultas filtradas, paginación, estados vacíos.  
**Evidencia:** capturas de búsqueda, filtro, combinación y mensaje sin resultados.

### 22.8 Entradas y salidas de inventario

**Descripción:** registrar movimientos de entrada y salida con actualización automática de stock.  
**Técnica:** transacciones o control atómico de operaciones.  
**Evidencia:** capturas antes/después del stock, error por salida mayor al stock y movimiento registrado.

### 22.9 Historial de movimientos

**Descripción:** mostrar historial ordenado del más reciente al más antiguo.  
**Técnica:** consulta ordenada, paginación, relación producto-usuario.  
**Evidencia:** captura del historial con fecha, producto, tipo, cantidad y usuario.

### 22.10 Alertas de stock y vencimiento

**Descripción:** implementar alertas de stock bajo, vencidos y próximos a vencer en 7/30 días.  
**Técnica:** reglas de negocio calculadas por consulta.  
**Evidencia:** capturas de cada tipo de alerta y mensaje cuando no hay alertas.

### 22.11 Dashboard e indicadores

**Descripción:** mostrar indicadores principales del inventario.  
**Técnica:** agregaciones y tarjetas KPI.  
**Evidencia:** captura del dashboard con totales y productos destacados.

### 22.12 Reportes básicos

**Descripción:** implementar reportes de stock bajo, vencimientos y productos con más salidas.  
**Técnica:** consultas agregadas y listados ordenados.  
**Evidencia:** capturas de los tres reportes.

### 22.13 Integración final y pruebas

**Descripción:** probar flujo completo del sistema con roles, productos, movimientos, alertas y reportes.  
**Técnica:** pruebas manuales guiadas por historias de usuario.  
**Evidencia:** checklist de pruebas, capturas de flujo completo y correcciones realizadas.

### 22.14 Documentación y entrega

**Descripción:** actualizar README, instrucciones de instalación, uso y evidencias.  
**Técnica:** documentación técnica básica.  
**Evidencia:** README actualizado, enlaces a capturas y resumen de funcionalidades terminadas.

---

## 23. Instrucciones específicas para Codex

### 23.1 Antes de modificar código

Codex debe:

1. Leer este documento.
2. Identificar el módulo afectado.
3. Revisar si la funcionalidad está dentro del alcance.
4. No implementar funcionalidades marcadas como fuera del MVP.
5. Mantener la arquitectura modular.
6. No duplicar componentes o servicios existentes.
7. Explicar qué archivos va a modificar cuando sea posible.

### 23.2 Reglas de implementación

Codex debe respetar:

- JavaScript como lenguaje principal.
- React para interfaz.
- Next.js para backend/rutas API si el repositorio está organizado así.
- PostgreSQL con Supabase para persistencia.
- JWT para autenticación.
- RBAC validado desde backend.
- Componentes reutilizables.
- Servicios por módulo.
- Validaciones en frontend y backend.
- Transacciones o control atómico en movimientos de inventario.
- Paginación en listados mayores a 10 registros.
- Mensajes claros de error, éxito y estados vacíos.

### 23.3 Cosas que Codex no debe hacer

Codex no debe:

- Crear funciones fuera del alcance sin autorización.
- Agregar facturación, pagos, e-commerce, IA o múltiples bodegas.
- Crear microservicios independientes con despliegues separados.
- Crear CRUD de categorías en el MVP.
- Guardar contraseñas en texto plano.
- Validar permisos solo en el frontend.
- Permitir editar correo o SKU.
- Permitir stock negativo.
- Registrar movimientos si falla la actualización del stock.
- Cambiar nombres de roles sin actualizar toda la documentación y el código.
- Introducir librerías grandes de UI sin aprobación.
- Mezclar lógica de negocio dentro de componentes visuales si puede estar en servicios/módulos.

### 23.4 Formato esperado de respuesta de Codex

Cuando Codex trabaje sobre una tarea, debe responder con:

```md
## Resumen
Qué se hizo.

## Archivos modificados
- ruta/archivo
- ruta/archivo

## Decisiones técnicas
Explicación breve.

## Cómo probar
Pasos concretos.

## Pendientes o riesgos
Lo que falta revisar.
```

### 23.5 Criterio de finalización de una tarea

Una tarea se considera terminada cuando:

- Cumple la historia de usuario asociada.
- Cumple criterios de aceptación.
- Respeta roles y permisos.
- Tiene validaciones básicas.
- Muestra mensajes adecuados.
- No rompe otros módulos.
- Tiene evidencia para Trello.
- Está documentada si corresponde.

---

## 24. Resumen ejecutivo para nuevos integrantes

StockTrack360 es un MVP web para que pequeños y medianos negocios controlen productos, stock, entradas, salidas, alertas y reportes básicos.

El sistema maneja dos roles persistidos:

- `ADMINISTRADOR`
- `USUARIO`

El MVP sí incluye:

- Login.
- Usuarios.
- Productos.
- Categorías predefinidas.
- Inventario.
- Entradas y salidas.
- Historial.
- Alertas.
- Dashboard.
- Reportes básicos.

El MVP no incluye:

- Facturación.
- Pagos.
- App móvil.
- IA.
- Múltiples bodegas.
- Código de barras.
- CRUD de categorías.
- Microservicios desplegados por separado.

La arquitectura es modular, con enfoque hacia microservicios, dentro de un monorepo. El objetivo es mantener una estructura clara y evolucionable sin aumentar la complejidad inicial.

---

## 25. Glosario

| Término | Significado |
|---|---|
| MVP | Producto mínimo viable. Primera versión funcional. |
| RF | Requerimiento funcional. Describe qué debe hacer el sistema. |
| RNF | Requerimiento no funcional. Describe condiciones de calidad, seguridad o rendimiento. |
| HU | Historia de usuario. Describe una necesidad desde la perspectiva del usuario. |
| SKU | Código único de identificación de producto. En este proyecto equivale al código único del producto. |
| JWT | Token usado para autenticación y autorización. |
| RBAC | Control de acceso basado en roles. |
| API Gateway lógico | Capa central que enruta peticiones hacia los módulos del sistema. |
| Stock mínimo | Cantidad límite configurada para activar alerta de bajo stock. |
| Stock disponible | Cantidad actual disponible de un producto. |
| Entrada | Movimiento que aumenta el stock. |
| Salida | Movimiento que disminuye el stock. |
| Degradación controlada | Respuesta parcial del sistema cuando un módulo falla, sin caída total. |
