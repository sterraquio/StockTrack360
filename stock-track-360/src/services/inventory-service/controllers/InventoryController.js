import { InventoryUseCases } from "../usecases/InventoryUseCases.js";
import { createSuccessResponse } from "@/services/shared/utils/helpers.js";

export class InventoryController {
  /**
   * POST /api/products
   * Crear un nuevo producto
   */
  static async createProduct(req, res) {
    try {
      if (req.method !== "POST") {
        return res.status(405).json({ message: "Método no permitido" });
      }

      const product = await InventoryUseCases.createProduct(req.body);
      return res.status(201).json(createSuccessResponse(product, "Producto creado exitosamente"));
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        message: error.message,
        errors: error.errors,
      });
    }
  }

  /**
   * GET /api/products
   * Listar productos con filtros
   */
  static async listProducts(req, res) {
    try {
      if (req.method !== "GET") {
        return res.status(405).json({ message: "Método no permitido" });
      }

      const filters = {
        categoryId: req.query.categoryId ? parseInt(req.query.categoryId) : undefined,
        search: req.query.search,
      };

      const products = await InventoryUseCases.listProducts(filters);
      return res.status(200).json(
        createSuccessResponse(products, "Productos obtenidos exitosamente")
      );
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * GET /api/products/:id
   * Obtener producto por ID
   */
  static async getProduct(req, res) {
    try {
      if (req.method !== "GET") {
        return res.status(405).json({ message: "Método no permitido" });
      }

      const productId = parseInt(req.query.id);
      const product = await InventoryUseCases.getProductById(productId);
      return res.status(200).json(createSuccessResponse(product));
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({ message: error.message });
    }
  }

  /**
   * PATCH /api/products/:id
   * Actualizar producto
   */
  static async updateProduct(req, res) {
    try {
      if (req.method !== "PATCH") {
        return res.status(405).json({ message: "Método no permitido" });
      }

      const productId = parseInt(req.query.id);
      const product = await InventoryUseCases.updateProduct(productId, req.body);
      return res.status(200).json(createSuccessResponse(product, "Producto actualizado"));
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        message: error.message,
        errors: error.errors,
      });
    }
  }

  /**
   * DELETE /api/products/:id
   * Eliminar producto
   */
  static async deleteProduct(req, res) {
    try {
      if (req.method !== "DELETE") {
        return res.status(405).json({ message: "Método no permitido" });
      }

      const productId = parseInt(req.query.id);
      const result = await InventoryUseCases.deleteProduct(productId);
      return res.status(200).json(createSuccessResponse(result));
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({ message: error.message });
    }
  }

  /**
   * POST /api/inventory-movements/entries
   * Registrar entrada
   */
  static async recordEntry(req, res) {
    try {
      if (req.method !== "POST") {
        return res.status(405).json({ message: "Método no permitido" });
      }

      const result = await InventoryUseCases.recordEntry(req.body);
      return res.status(201).json(createSuccessResponse(result, "Entrada registrada"));
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        message: error.message,
        errors: error.errors,
        details: error.details,
      });
    }
  }

  /**
   * POST /api/inventory-movements/exits
   * Registrar salida
   */
  static async recordExit(req, res) {
    try {
      if (req.method !== "POST") {
        return res.status(405).json({ message: "Método no permitido" });
      }

      const result = await InventoryUseCases.recordExit(req.body);
      return res.status(201).json(createSuccessResponse(result, "Salida registrada"));
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        message: error.message,
        errors: error.errors,
        details: error.details,
      });
    }
  }

  /**
   * GET /api/inventory-movements
   * Obtener historial de movimientos
   */
  static async listMovements(req, res) {
    try {
      if (req.method !== "GET") {
        return res.status(405).json({ message: "Método no permitido" });
      }

      const filters = {
        productId: req.query.productId ? parseInt(req.query.productId) : undefined,
        movementType: req.query.movementType,
        userId: req.query.userId,
      };

      const limit = parseInt(req.query.limit) || 20;
      const offset = parseInt(req.query.offset) || 0;

      const result = await InventoryUseCases.getAllMovements(filters, limit, offset);
      return res.status(200).json(createSuccessResponse(result));
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * GET /api/inventory/stats
   * Obtener estadísticas de inventario
   */
  static async getStats(req, res) {
    try {
      if (req.method !== "GET") {
        return res.status(405).json({ message: "Método no permitido" });
      }

      const stats = await InventoryUseCases.getInventoryStats();
      return res.status(200).json(createSuccessResponse(stats));
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
