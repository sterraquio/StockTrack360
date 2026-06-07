/**
 * Modelo de Producto
 * Propiedades:
 * - id: Identificador único
 * - sku: Código único del producto (no reutilizable)
 * - name: Nombre del producto
 * - categoryId: ID de la categoría predefinida
 * - currentStock: Cantidad actual disponible
 * - minimumStock: Cantidad mínima para alerta
 * - expiryDate: Fecha de vencimiento (opcional)
 * - createdAt: Fecha de creación
 * - updatedAt: Última actualización
 */
export class Product {
  constructor(data) {
    this.id = data.id;
    this.sku = data.sku;
    this.name = data.name;
    this.categoryId = data.categoryId;
    this.currentStock = data.currentStock || 0;
    this.minimumStock = data.minimumStock;
    this.expiryDate = data.expiryDate || null;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  isLowStock() {
    return this.minimumStock && this.currentStock <= this.minimumStock;
  }

  canDelete() {
    return this.currentStock === 0;
  }
}

/**
 * Modelo de Movimiento de Inventario
 * Propiedades:
 * - id: Identificador único
 * - productId: ID del producto
 * - movementType: 'entry' o 'exit'
 * - quantity: Cantidad movida
 * - userId: Usuario que realizó el movimiento
 * - notes: Notas adicionales (opcional)
 * - createdAt: Fecha del movimiento
 */
export class InventoryMovement {
  constructor(data) {
    this.id = data.id;
    this.productId = data.productId;
    this.movementType = data.movementType; // 'entry' o 'exit'
    this.quantity = data.quantity;
    this.userId = data.userId;
    this.notes = data.notes || null;
    this.createdAt = data.createdAt;
  }

  isEntry() {
    return this.movementType === "entry";
  }

  isExit() {
    return this.movementType === "exit";
  }
}

/**
 * Vista de Producto con Stock
 * Combinación de datos de producto e inventario
 */
export class ProductWithStock {
  constructor(product, stock) {
    this.product = product;
    this.currentStock = stock;
  }
}
