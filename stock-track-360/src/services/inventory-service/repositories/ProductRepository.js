import { Product, InventoryMovement } from "../models/Product.js";

/**
 * Repositorio en memoria para productos
 * En una implementación real, esto sería una capa de BD
 */
export class ProductRepository {
  constructor() {
    this.products = new Map(); // id -> Product
    this.skuIndex = new Map(); // sku -> id (para validar unicidad)
    this.idCounter = 1;
  }

  async create(productData) {
    // Validar SKU único
    if (this.skuIndex.has(productData.sku.toLowerCase())) {
      throw new Error("El SKU ya existe");
    }

    const id = this.idCounter++;
    const now = new Date().toISOString();

    const product = new Product({
      id,
      sku: productData.sku,
      name: productData.name,
      categoryId: productData.categoryId,
      currentStock: productData.currentStock || 0,
      minimumStock: productData.minimumStock,
      expiryDate: productData.expiryDate || null,
      createdAt: now,
      updatedAt: now,
    });

    this.products.set(id, product);
    this.skuIndex.set(productData.sku.toLowerCase(), id);
    return product;
  }

  async findById(id) {
    return this.products.get(id) || null;
  }

  async findBySku(sku) {
    const id = this.skuIndex.get(sku.toLowerCase());
    return id ? this.products.get(id) : null;
  }

  async findAll(filters = {}) {
    let results = Array.from(this.products.values());

    if (filters.categoryId) {
      results = results.filter((p) => p.categoryId === filters.categoryId);
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      results = results.filter(
        (p) => p.name.toLowerCase().includes(search) || p.sku.toLowerCase().includes(search)
      );
    }

    return results;
  }

  async update(id, updateData) {
    const product = this.products.get(id);
    if (!product) return null;

    // Si se intenta cambiar SKU, validar unicidad
    if (updateData.sku && updateData.sku !== product.sku) {
      throw new Error("El SKU no puede ser modificado después de creado");
    }

    product.name = updateData.name || product.name;
    product.categoryId = updateData.categoryId || product.categoryId;
    product.minimumStock = updateData.minimumStock ?? product.minimumStock;
    product.expiryDate = updateData.expiryDate ?? product.expiryDate;
    product.updatedAt = new Date().toISOString();

    return product;
  }

  async delete(id) {
    const product = this.products.get(id);
    if (!product) return false;

    this.products.delete(id);
    this.skuIndex.delete(product.sku.toLowerCase());
    return true;
  }

  // Métodos para actualizar stock (llamado desde movimientos)
  async updateStock(productId, newStock) {
    const product = this.products.get(productId);
    if (!product) throw new Error("Producto no encontrado");

    if (newStock < 0) throw new Error("El stock no puede ser negativo");

    product.currentStock = newStock;
    product.updatedAt = new Date().toISOString();
    return product;
  }

  getProductCount() {
    return this.products.size;
  }
}

/**
 * Repositorio en memoria para movimientos
 */
export class MovementRepository {
  constructor() {
    this.movements = new Map(); // id -> InventoryMovement
    this.idCounter = 1;
  }

  async create(movementData) {
    const id = this.idCounter++;
    const now = new Date().toISOString();

    const movement = new InventoryMovement({
      id,
      productId: movementData.productId,
      movementType: movementData.movementType,
      quantity: movementData.quantity,
      userId: movementData.userId,
      notes: movementData.notes || null,
      createdAt: now,
    });

    this.movements.set(id, movement);
    return movement;
  }

  async findById(id) {
    return this.movements.get(id) || null;
  }

  async findByProductId(productId, limit = 10, offset = 0) {
    const results = Array.from(this.movements.values())
      .filter((m) => m.productId === productId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(offset, offset + limit);

    return results;
  }

  async findAll(filters = {}, limit = 10, offset = 0) {
    let results = Array.from(this.movements.values());

    if (filters.productId) {
      results = results.filter((m) => m.productId === filters.productId);
    }

    if (filters.movementType) {
      results = results.filter((m) => m.movementType === filters.movementType);
    }

    if (filters.userId) {
      results = results.filter((m) => m.userId === filters.userId);
    }

    results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return {
      data: results.slice(offset, offset + limit),
      total: results.length,
    };
  }

  getMovementCount() {
    return this.movements.size;
  }

  getTotalByType(movementType) {
    return Array.from(this.movements.values()).filter(
      (m) => m.movementType === movementType
    ).length;
  }
}

// Singleton instances
export const productRepository = new ProductRepository();
export const movementRepository = new MovementRepository();
