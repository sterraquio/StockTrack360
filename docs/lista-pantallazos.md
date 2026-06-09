# 📸 LISTA DE PANTALLAZOS REQUERIDOS
## StockTrack360 - Orden de Presentación

---

## 🎬 ORDEN DE PANTALLAZOS EN LA DEMO

### 1️⃣ **HOMEPAGE/INICIO** (5 segundos)
**Descripción:** Pantalla inicial de la aplicación
- **Qué capturar:** Logo, navegación principal, mensaje de bienvenida
- **Ruta:** `http://localhost:3000`
- **Archivo:** `Screenshot_01_homepage.png`
- **Nota presentador:** "Esta es la pantalla principal de nuestro sistema"

---

### 2️⃣ **CREAR PRODUCTO** (15 segundos)
**Descripción:** Formulario de creación de nuevo producto
- **Qué capturar:**
  - Formulario completo visible
  - Campos: SKU, Nombre, Categoría, Stock Actual, Stock Mínimo, Fecha Vencimiento
  - Botón Submit

- **Datos de Ejemplo:**
  - SKU: `ARROZ001`
  - Nombre: `Arroz Premium 1kg`
  - Categoría: `Alimentos` (dropdown)
  - Stock Actual: `100`
  - Stock Mínimo: `20`
  - Vencimiento: `2027-12-31`

- **Ruta:** `POST /api/products` (via curl)
- **Archivo:** `Screenshot_02_crear_producto_form.png`
- **Nota presentador:** "Creamos un nuevo producto con todos los datos requeridos"

---

### 3️⃣ **PRODUCTO CREADO** (10 segundos)
**Descripción:** Confirmación de producto creado exitosamente
- **Qué capturar:**
  - Mensaje de éxito
  - ID del producto
  - Todos los datos ingresados
  - Respuesta JSON si es API

- **Archivo:** `Screenshot_03_producto_creado_success.png`
- **Nota presentador:** "El producto se creó exitosamente con ID 1"

---

### 4️⃣ **LISTADO DE PRODUCTOS** (10 segundos)
**Descripción:** Tabla con todos los productos
- **Qué capturar:**
  - Tabla de productos
  - Columnas: ID, SKU, Nombre, Categoría, Stock Actual, Stock Mínimo, Vencimiento
  - Paginación (si aplica)
  - Acciones (editar, eliminar)

- **Ruta:** `GET /api/products` o página de inventario
- **Archivo:** `Screenshot_04_listado_productos.png`
- **Nota presentador:** "Aquí podemos ver todos los productos registrados con su información"

---

### 5️⃣ **REGISTRAR ENTRADA** (20 segundos)
**Descripción:** Formulario para registrar entrada de inventario
- **Qué capturar:**
  - Formulario de entrada
  - Campos: Producto (dropdown), Cantidad, Usuario, Notas
  - Botón Submit

- **Datos de Ejemplo:**
  - Producto: `ARROZ001` (Arroz Premium 1kg)
  - Cantidad: `50`
  - Usuario: `admin-001`
  - Notas: `Compra a proveedor Central`

- **Archivo:** `Screenshot_05_registrar_entrada_form.png`
- **Nota presentador:** "Registramos una entrada de 50 unidades"

---

### 6️⃣ **ENTRADA REGISTRADA** (10 segundos)
**Descripción:** Confirmación de entrada registrada
- **Qué capturar:**
  - Mensaje de éxito
  - Stock actualizado (100 → 150)
  - Confirmación de movimiento

- **Archivo:** `Screenshot_06_entrada_registrada_success.png`
- **Nota presentador:** "El stock se actualizó automáticamente a 150 unidades"

---

### 7️⃣ **REGISTRAR SALIDA** (20 segundos)
**Descripción:** Formulario para registrar salida de inventario
- **Qué capturar:**
  - Formulario de salida
  - Campos: Producto (dropdown), Cantidad, Usuario, Notas
  - Botón Submit

- **Datos de Ejemplo:**
  - Producto: `ARROZ001` (Arroz Premium 1kg)
  - Cantidad: `10`
  - Usuario: `user-002`
  - Notas: `Venta cliente X`

- **Archivo:** `Screenshot_07_registrar_salida_form.png`
- **Nota presentador:** "Ahora registramos una salida de 10 unidades"

---

### 8️⃣ **SALIDA REGISTRADA** (10 segundos)
**Descripción:** Confirmación de salida registrada
- **Qué capturar:**
  - Mensaje de éxito
  - Stock actualizado (150 → 140)
  - Confirmación de movimiento

- **Archivo:** `Screenshot_08_salida_registrada_success.png`
- **Nota presentador:** "El stock se redujo a 140 unidades y quedó registrado"

---

### 9️⃣ **HISTORIAL DE MOVIMIENTOS** (15 segundos)
**Descripción:** Lista de todos los movimientos (entradas/salidas)
- **Qué capturar:**
  - Tabla de movimientos
  - Columnas: ID, Producto, Tipo (Entrada/Salida), Cantidad, Usuario, Fecha, Notas
  - Ambos movimientos registrados (entrada de 50, salida de 10)

- **Ruta:** `GET /api/inventory-movements` o página de historial
- **Archivo:** `Screenshot_09_historial_movimientos.png`
- **Nota presentador:** "Este es el historial completo de movimientos con auditoría de usuario y fecha"

---

### 🔟 **ALERTAS - STOCK BAJO** (10 segundos)
**Descripción:** Sección de alertas
- **Qué capturar:**
  - Lista de alertas activas
  - Tipo de alerta: Stock Bajo
  - Producto: ARROZ001
  - Stock actual: 140
  - Stock mínimo: 20
  - Severidad: "Información"

- **Ruta:** `GET /api/alerts/low-stock` o página de alertas
- **Archivo:** `Screenshot_10_alertas_stock_bajo.png`
- **Nota presentador:** "El sistema genera alertas automáticas cuando el stock se acerca al mínimo"

---

### 1️⃣1️⃣ **ALERTAS - VENCIMIENTOS** (10 segundos)
**Descripción:** Alertas de productos vencidos o próximos a vencer
- **Qué capturar:**
  - Lista de alertas de vencimiento
  - Información del producto
  - Fecha de vencimiento
  - Estado: (Vencido / Próximo a vencer)

- **Ruta:** `GET /api/alerts/expired` o `GET /api/alerts/expiring`
- **Archivo:** `Screenshot_11_alertas_vencimiento.png`
- **Nota presentador:** "También alertamos sobre productos vencidos o próximos a vencer"

---

### 1️⃣2️⃣ **DASHBOARD** (30 segundos - El más importante)
**Descripción:** Panel de control con indicadores principales
- **Qué capturar:**
  - Total de productos: 1
  - Total de stock: 140
  - Productos con stock bajo: 0
  - Productos vencidos: 0
  - Productos próximos a vencer: 0
  - Alertas activas: 0
  - Movimientos últimos 30 días: 2
  - Top 5 productos con más salidas: (ARROZ001 con 1 salida)

- **Ruta:** `GET /api/dashboard` o página del dashboard
- **Archivo:** `Screenshot_12_dashboard_kpis.png`
- **Nota presentador:** "Este es nuestro dashboard ejecutivo con 8 indicadores clave. Muestra en tiempo real el estado del inventario"

---

### 1️⃣3️⃣ **REPORTE - STOCK BAJO** (10 segundos)
**Descripción:** Reporte de productos con stock bajo
- **Qué capturar:**
  - Tabla con productos
  - Stock actual vs mínimo
  - Resumen: "Total: 0 productos"

- **Ruta:** `GET /api/reports/low-stock`
- **Archivo:** `Screenshot_13_reporte_stock_bajo.png`
- **Nota presentador:** "Aquí podemos generar reportes ejecutivos"

---

### 1️⃣4️⃣ **REPORTE - VENCIMIENTOS** (10 segundos)
**Descripción:** Reporte de vencimientos
- **Qué capturar:**
  - Tabla de productos vencidos/próximos a vencer
  - Resumen: Vencidos/Próximos a vencer

- **Ruta:** `GET /api/reports/expiration`
- **Archivo:** `Screenshot_14_reporte_vencimientos.png`
- **Nota presentador:** "Reporte de vencimientos para control de rotación"

---

### 1️⃣5️⃣ **REPORTE - TOP PRODUCTOS** (10 segundos)
**Descripción:** Reporte de productos con más salidas
- **Qué capturar:**
  - Top 10 productos por salidas
  - Cantidad de salidas
  - Stock actual

- **Ruta:** `GET /api/reports/top-exits`
- **Archivo:** `Screenshot_15_reporte_top_productos.png`
- **Nota presentador:** "Y aquí los productos con mayor rotación"

---

### 1️⃣6️⃣ **CÓDIGO - ESTRUCTURA SERVICIOS** (10 segundos)
**Descripción:** Vista de la estructura del código
- **Qué capturar:**
  - Árbol de directorios en VS Code
  - Servicios: inventory-service, reporting-alerts-service
  - Capas: models, repositories, usecases, validators, controllers

- **Archivo:** `Screenshot_16_estructura_codigo.png`
- **Nota presentador:** "Nuestra arquitectura está dividida en dos microservicios modulares"

---

### 1️⃣7️⃣ **CÓDIGO - EJEMPLO USECASE** (10 segundos)
**Descripción:** Código de lógica de negocio
- **Qué capturar:**
  - Archivo InventoryUseCases.js
  - Método recordExit mostrando validación de stock
  - Prevención de stock negativo

- **Archivo:** `Screenshot_17_codigo_validacion.png`
- **Nota presentador:** "Aquí pueden ver la validación que previene stock negativo"

---

### 1️⃣8️⃣ **GIT - LOG DE COMMITS** (5 segundos)
**Descripción:** Historial de commits en Git
- **Qué capturar:**
  - `git log --oneline`
  - Commits semánticos
  - Mensajes descriptivos

- **Archivo:** `Screenshot_18_git_commits.png`
- **Nota presentador:** "Todos nuestros cambios están versionados con commits descriptivos"

---

### 1️⃣9️⃣ **TERMINAL - TESTS** (10 segundos)
**Descripción:** Ejecución de tests o validación
- **Qué capturar:**
  - Tests ejecutándose exitosamente
  - O curl de endpoints funcionando
  - Respuestas JSON correctas

- **Archivo:** `Screenshot_19_terminal_tests.png`
- **Nota presentador:** "Todos los endpoints fueron validados y funcionan correctamente"

---

### 2️⃣0️⃣ **DOCUMENTACIÓN** (5 segundos)
**Descripción:** Documentación del proyecto
- **Qué capturar:**
  - MICROSERVICES.md en VS Code
  - pipeline-diagram.md
  - README.md

- **Archivo:** `Screenshot_20_documentacion.png`
- **Nota presentador:** "Hemos documentado completamente el proyecto"

---

## 📋 CHECKLIST DE CAPTURAS

- [ ] Screenshot_01_homepage.png
- [ ] Screenshot_02_crear_producto_form.png
- [ ] Screenshot_03_producto_creado_success.png
- [ ] Screenshot_04_listado_productos.png
- [ ] Screenshot_05_registrar_entrada_form.png
- [ ] Screenshot_06_entrada_registrada_success.png
- [ ] Screenshot_07_registrar_salida_form.png
- [ ] Screenshot_08_salida_registrada_success.png
- [ ] Screenshot_09_historial_movimientos.png
- [ ] Screenshot_10_alertas_stock_bajo.png
- [ ] Screenshot_11_alertas_vencimiento.png
- [ ] Screenshot_12_dashboard_kpis.png ⭐ (MÁS IMPORTANTE)
- [ ] Screenshot_13_reporte_stock_bajo.png
- [ ] Screenshot_14_reporte_vencimientos.png
- [ ] Screenshot_15_reporte_top_productos.png
- [ ] Screenshot_16_estructura_codigo.png
- [ ] Screenshot_17_codigo_validacion.png
- [ ] Screenshot_18_git_commits.png
- [ ] Screenshot_19_terminal_tests.png
- [ ] Screenshot_20_documentacion.png

---

## 🎥 RECOMENDACIONES

1. **Capturar sin ventanas del chat** - Solo la app
2. **Usar resolución 1920x1080** - Se ve mejor
3. **Guardar en carpeta** `docs/screenshots/`
4. **Usar nombres consistentes** - Como la lista arriba
5. **Capturar con cursor visible** - Muestra interacción
6. **Resaltar datos importantes** - Usar flechas o rectángulos

---

## ⏱️ TIMING SUGERIDO

- Introducción: 30 seg
- Crear producto: 30 seg
- Registrar entrada: 15 seg
- Registrar salida: 15 seg
- Historial: 10 seg
- Alertas: 15 seg
- Dashboard: 30 seg ⭐
- Reportes: 30 seg
- Código: 15 seg
- Git: 10 seg
- Total: ~3-4 minutos

