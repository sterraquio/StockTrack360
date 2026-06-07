import { productRepository, movementRepository } from "../repositories/ProductRepository.js";
import {
  validateCreateProduct,
  validateUpdateProduct,
  validateMovement,
} from "../validators/ProductValidator.js";
import { MOVEMENT_TYPES } from "@/services/shared/constants.js";

export class InventoryUseCases {
  /**
   * Crear un nuevo producto
   */
  static async createProduct(productData) {
    const validation = validateCreateProduct(productData);
    if (!validation.isValid) {
      throw { statusCode: 400, message: "Validación fallida", errors: validation.errors };
    }

    try {
      const product = await productRepository.create(productData);
      return product;
    } catch (error) {
      if (error.message.includes("SKU ya existe")) {
        throw { statusCode: 409, message: "El SKU ya existe en el sistema" };
      }
      throw { statusCode: 500, message: error.message };
    }
  }

  /**
   * Obtener producto por ID
   */
  static async getProductById(productId) {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw { statusCode: 404, message: "Producto no encontrado" };
    }
    return product;
  }

  /**
   * Obtener producto por SKU
   */
  static async getProductBySku(sku) {
    const product = await productRepository.findBySku(sku);
    if (!product) {
      throw { statusCode: 404, message: "Producto no encontrado" };
    }
    return product;
  }

  /**
   * Listar todos los productos con filtros opcionales
   */
  static async listProducts(filters = {}) {
    const products = await productRepository.findAll(filters);
    return products;
  }

  /**
   * Actualizar producto
   */
  static async updateProduct(productId, updateData) {
    const validation = validateUpdateProduct(updateData);
    if (!validation.isValid) {
      throw { statusCode: 400, message: "Validación fallida", errors: validation.errors };
    }

    const product = await productRepository.update(productId, updateData);
    if (!product) {
      throw { statusCode: 404, message: "Producto no encontrado" };
    }
    return product;
  }

  /**
   * Eliminar producto (solo si stock es 0)
   */
  static async deleteProduct(productId) {
    const product = await this.getProductById(productId);

    if (!product.canDelete()) {
      throw {
        statusCode: 400,
        message: "No se puede eliminar producto con stock disponible",
      };
    }

    const deleted = await productRepository.delete(productId);
    if (!deleted) {
      throw { statusCode: 500, message: "Error al eliminar producto" };
    }
    return { message: "Producto eliminado exitosamente" };
  }

  /**
   * Registrar entrada de inventario
   */
  static async recordEntry(entryData) {
    const validation = validateMovement(entryData);
    if (!validation.isValid) {
      throw { statusCode: 400, message: "Validación fallida", errors: validation.errors };
    }

    const product = await this.getProductById(entryData.productId);

    // Actualizar stock
    const newStock = product.currentStock + entryData.quantity;
    await productRepository.updateStock(entryData.productId, newStock);

    // Registrar movimiento
    const movement = await movementRepository.create({
      productId: entryData.productId,
      movementType: MOVEMENT_TYPES.ENTRY,
      quantity: entryData.quantity,
      userId: entryData.userId,
      notes: entryData.notes,
    });

    return {
      movement,
      product: await this.getProductById(entryData.productId),
    };
  }

  /**
   * Registrar salida de inventario
   * Validar que no deje stock negativo
   */
  static async recordExit(exitData) {
    const validation = validateMovement(exitData);
    if (!validation.isValid) {
      throw { statusCode: 400, message: "Validación fallida", errors: validation.errors };
    }

    const product = await this.getProductById(exitData.productId);

    // Validar stock suficiente
    if (product.currentStock < exitData.quantity) {
      throw {
        statusCode: 400,
        message: "Stock insuficiente para registrar salida",
        details: {
          disponible: product.currentStock,
          solicitado: exitData.quantity,
        },
      };
    }

    // Actualizar stock
    const newStock = product.currentStock - exitData.quantity;
    await productRepository.updateStock(exitData.productId, newStock);

    // Registrar movimiento
    const movement = await movementRepository.create({
      productId: exitData.productId,
      movementType: MOVEMENT_TYPES.EXIT,
      quantity: exitData.quantity,
      userId: exitData.userId,
      notes: exitData.notes,
    });

    return {
      movement,
      product: await this.getProductById(exitData.productId),
    };
  }

  /**
   * Obtener historial de movimientos de un producto
   */
  static async getProductMovements(productId, limit = 20, offset = 0) {
    const product = await this.getProductById(productId);
    const movements = await movementRepository.findByProductId(productId, limit, offset);
    return {
      product,
      movements,
    };
  }

  /**
   * Obtener todos los movimientos con filtros
   */
  static async getAllMovements(filters = {}, limit = 20, offset = 0) {
    return await movementRepository.findAll(filters, limit, offset);
  }

  /**
   * Obtener estadísticas de inventario
   */
  static async getInventoryStats() {
    const products = await productRepository.findAll();

    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.currentStock, 0);
    const lowStockProducts = products.filter((p) => p.isLowStock()).length;

    return {
      totalProducts,
      totalStock,
      lowStockProducts,
    };
  }
}
