# StockTrack360 - Microservicios: Inventory & Reporting-Alerts

## 📋 Resumen

Este documento describe los dos microservicios modulares implementados para StockTrack360:

1. **inventory-service**: Gestión de productos, categorías, inventario y movimientos
2. **reporting-alerts-service**: Alertas, dashboard y reportes

## 🏗️ Arquitectura

### Estructura de Directorios

```
src/
├── services/
│   ├── shared/
│   │   ├── constants.js          # Categorías, tipos, alertas
│   │   └── utils/
│   │       └── helpers.js        # Funciones utilitarias
│   │
│   ├── inventory-service/
│   │   ├── models/              # Clases de dominio (Product, Movement)
│   │   ├── repositories/        # Acceso a datos (en memoria para MVP)
│   │   ├── usecases/            # Lógica de negocio
│   │   ├── validators/          # Validaciones de datos
│   │   └── controllers/         # Manejadores (deprecated en favor de rutas Next.js)
│   │
│   └── reporting-alerts-service/
│       ├── models/              # Clases de dominio (Alert, Report, Dashboard)
│       ├── repositories/        # Acceso a datos
│       ├── usecases/            # Lógica de negocio
│       └── controllers/         # Manejadores (deprecated)
│
└── app/
    └── api/
        ├── products/                # CRUD de productos
        ├── inventory-movements/     # Entradas, salidas y historial
        ├── alerts/                  # Alertas por tipo
        ├── dashboard/               # Dashboard
        └── reports/                 # Reportes por tipo
```

## 🔄 Inventory Service

### Responsabilidades

- **Productos**: CRUD con SKU único no reutilizable
- **Categorías**: Lista predefinida de categorías
- **Inventario**: Gestión de stock disponible
- **Movimientos**: Registro de entradas y salidas
- **Validaciones**: Stock no negativo, cantidad positiva

### Endpoints API

#### Productos
- `GET /api/products` - Listar productos con filtros (búsqueda, categoría)
- `POST /api/products` - Crear producto
- `GET /api/products/[id]` - Obtener producto
- `PATCH /api/products/[id]` - Actualizar producto
- `DELETE /api/products/[id]` - Eliminar (solo si stock = 0)

#### Movimientos
- `POST /api/inventory-movements/entries` - Registrar entrada
- `POST /api/inventory-movements/exits` - Registrar salida
- `GET /api/inventory-movements` - Listar movimientos con filtros

### Ejemplo: Crear Producto

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "PROD001",
    "name": "Arroz 1kg",
    "categoryId": 1,
    "currentStock": 100,
    "minimumStock": 20,
    "expiryDate": "2026-12-31"
  }'
```

### Ejemplo: Registrar Entrada

```bash
curl -X POST http://localhost:3000/api/inventory-movements/entries \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "quantity": 50,
    "userId": "user-123",
    "notes": "Entrada de compra a proveedor X"
  }'
```

### Ejemplo: Registrar Salida

```bash
curl -X POST http://localhost:3000/api/inventory-movements/exits \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "quantity": 10,
    "userId": "user-456",
    "notes": "Venta cliente Y"
  }'
```

## 📊 Reporting-Alerts Service

### Responsabilidades

- **Alertas**: Stock bajo, vencidos, próximos a vencer (7 y 30 días)
- **Dashboard**: Indicadores principales del inventario
- **Reportes**: Stock bajo, vencimientos, productos con más salidas

### Endpoints API

#### Alertas
- `GET /api/alerts` - Listar todas las alertas activas
- `GET /api/alerts/low-stock` - Alertas de stock bajo
- `GET /api/alerts/expired` - Productos vencidos
- `GET /api/alerts/expiring` - Productos próximos a vencer

#### Dashboard
- `GET /api/dashboard` - Datos completos del dashboard

#### Reportes
- `GET /api/reports/low-stock` - Reporte de stock bajo
- `GET /api/reports/expiration` - Reporte de vencimientos
- `GET /api/reports/top-exits` - Productos con más salidas

### Ejemplo: Obtener Dashboard

```bash
curl http://localhost:3000/api/dashboard
```

Respuesta:
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": {
    "totalProducts": 50,
    "totalStock": 5000,
    "lowStockCount": 5,
    "expiredCount": 2,
    "expiringCount": 8,
    "activeAlertCount": 15,
    "movementsLast30Days": 120,
    "topMovingProducts": [
      {
        "id": 1,
        "name": "Arroz 1kg",
        "sku": "PROD001",
        "exitCount": 45
      }
    ],
    "generatedAt": "2026-06-07T14:21:11.254Z"
  }
}
```

### Ejemplo: Obtener Reporte de Stock Bajo

```bash
curl http://localhost:3000/api/reports/low-stock
```

## 📦 Categorías Predefinidas

El sistema incluye 10 categorías predefinidas:

1. Alimentos
2. Bebidas
3. Productos de Limpieza
4. Productos de Higiene
5. Salud
6. Cosméticos
7. Papelería
8. Ferretería
9. Ropa
10. Electrónica

## ✅ Validaciones Implementadas

### Productos
- ✓ SKU debe ser único y no reutilizable
- ✓ SKU no se puede cambiar después de creado
- ✓ Nombre es requerido
- ✓ Categoría debe ser válida
- ✓ Stock mínimo debe ser entero no negativo
- ✓ Fecha vencimiento no puede ser en el pasado

### Movimientos
- ✓ Cantidad debe ser entero positivo
- ✓ Salida no puede generar stock negativo
- ✓ Producto debe existir

## 🗄️ Almacenamiento (MVP)

Para el MVP, los datos se almacenan **en memoria** (Map de JavaScript).
La arquitectura permite fácilmente cambiar a PostgreSQL/Supabase sin modificar la lógica de negocio.

### Cómo integrar con BD real:

1. Reemplazar `ProductRepository` con clase que use Supabase
2. Reemplazar `MovementRepository` con clase que use Supabase
3. Reemplazar `AlertRepository` con clase que use Supabase
4. El resto del código (usecases, controllers) permanece igual

## 🚀 Cómo Ejecutar

### Instalar dependencias
```bash
cd stock-track-360
pnpm install
```

### Ejecutar en desarrollo
```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

### Testear endpoints con curl
```bash
# Crear producto
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"sku":"TEST1","name":"Test","categoryId":1,"currentStock":100}'

# Listar productos
curl http://localhost:3000/api/products

# Obtener dashboard
curl http://localhost:3000/api/dashboard
```

## 🔒 Notas de Seguridad (MVP)

En esta versión MVP:
- **No hay autenticación implementada** (será agregada en siguiente fase)
- **No hay validación de JWT** en los endpoints
- **No hay control de roles** (admin vs usuario)
- Los datos se guardan en memoria y se pierden al reiniciar

Para producción:
- Integrar JWT (middleware Next.js)
- Validar roles del usuario
- Conectar BD persistente (PostgreSQL/Supabase)
- Implementar rate limiting
- Agregar logging

## 📝 Próximos Pasos

1. Integración con autenticación JWT
2. Control de acceso basado en roles
3. Conectar PostgreSQL/Supabase para persistencia
4. Agregar tests unitarios e integración
5. Implementar paginación robusta
6. Agregar logging y monitoring
7. Documentar con OpenAPI/Swagger
