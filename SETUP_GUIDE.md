# 🚀 Guía de Ejecución - StockTrack360

## 📋 Resumen

Se ha implementado exitosamente:
- **inventory-service**: Gestión completa de productos, inventario y movimientos
- **reporting-alerts-service**: Alertas, dashboard y reportes

## 🛠️ Requisitos

- Node.js 18+
- npm o pnpm
- Git

## 📦 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/sterraquio/StockTrack360.git
cd StockTrack360
```

### 2. Instalar dependencias

```bash
cd stock-track-360
npm install
```

## 🚀 Ejecutar la aplicación

### Modo Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api

### Modo Producción

```bash
npm run build
npm start
```

## 🧪 Testear los Endpoints

### 1. Crear un Producto

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "PROD001",
    "name": "Arroz 1kg",
    "categoryId": 1,
    "currentStock": 100,
    "minimumStock": 20,
    "expiryDate": "2027-12-31"
  }'
```

### 2. Listar Productos

```bash
curl http://localhost:3000/api/products
```

### 3. Registrar Entrada de Inventario

```bash
curl -X POST http://localhost:3000/api/inventory-movements/entries \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "quantity": 50,
    "userId": "admin-001",
    "notes": "Compra proveedor"
  }'
```

### 4. Registrar Salida de Inventario

```bash
curl -X POST http://localhost:3000/api/inventory-movements/exits \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "quantity": 10,
    "userId": "user-002",
    "notes": "Venta"
  }'
```

### 5. Obtener Alertas

```bash
curl http://localhost:3000/api/alerts/low-stock
curl http://localhost:3000/api/alerts/expired
curl http://localhost:3000/api/alerts/expiring
```

### 6. Obtener Dashboard

```bash
curl http://localhost:3000/api/dashboard
```

### 7. Obtener Reportes

```bash
curl http://localhost:3000/api/reports/low-stock
curl http://localhost:3000/api/reports/expiration
curl http://localhost:3000/api/reports/top-exits
```

## 📚 Documentación de la API

Consulta `MICROSERVICES.md` para:
- Estructura completa de servicios
- Descripción detallada de cada endpoint
- Ejemplos de uso
- Notas de seguridad para MVP

## ✅ Features Implementados

### Inventory Service
- ✅ CRUD de productos
- ✅ Validación de SKU único
- ✅ Gestión de categorías predefinidas
- ✅ Registro de entradas y salidas
- ✅ Validación de stock (no puede ser negativo)
- ✅ Historial de movimientos
- ✅ Búsqueda y filtros

### Reporting-Alerts Service
- ✅ Alertas de stock bajo
- ✅ Alertas de productos vencidos
- ✅ Alertas de productos próximos a vencer (7 y 30 días)
- ✅ Dashboard con indicadores principales
- ✅ Reporte de stock bajo
- ✅ Reporte de vencimientos
- ✅ Reporte de productos con más salidas

## 🔀 Control de Versiones

### Rama de desarrollo
```bash
git checkout agents/microservices-devops-setup-guide
```

### Cambios en pre-main
```bash
git push origin agents/microservices-devops-setup-guide:pre-main
```

## 📁 Estructura de Archivos Creados

```
stock-track-360/
├── MICROSERVICES.md                    # Documentación técnica
├── src/
│   ├── services/
│   │   ├── shared/                     # Código compartido
│   │   ├── inventory-service/          # Servicio de inventario
│   │   └── reporting-alerts-service/   # Servicio de alertas y reportes
│   └── app/
│       └── api/                        # Endpoints REST
```

## 🔐 Notas Importantes (MVP)

- **Sin autenticación**: Los endpoints no validan JWT (será agregado en siguiente fase)
- **Sin persistencia BD**: Los datos se guardan en memoria y se pierden al reiniciar
- **No hay control de roles**: No se valida ADMINISTRADOR vs USUARIO
- **Para producción**: Integrar con PostgreSQL/Supabase y agregar autenticación

## 🆘 Solución de Problemas

### La app no inicia
```bash
# Limpia node_modules e instala de nuevo
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Error 409 Conflict en crear producto
El SKU ya existe. Usa uno diferente:
```bash
"sku": "UNIQUE_SKU_$(date +%s)"
```

### Error 400 en movimientos
Verifica que:
- `productId` existe
- `quantity` es un número entero positivo
- El producto tiene suficiente stock (para salidas)

## 📞 Contacto

Para preguntas sobre la implementación, consulta la documentación en `MICROSERVICES.md`
