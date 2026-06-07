import { productRepository, movementRepository } from "@/services/inventory-service/repositories/ProductRepository.js";
import { alertRepository } from "../repositories/AlertRepository.js";
import { ALERT_TYPES, MOVEMENT_TYPES } from "@/services/shared/constants.js";
import { checkExpirationStatus } from "@/services/shared/utils/helpers.js";

export class AlertsUseCases {
  /**
   * Generar alerta de stock bajo
   */
  static async generateLowStockAlerts() {
    const products = await productRepository.findAll();
    const alerts = [];

    for (const product of products) {
      if (product.isLowStock()) {
        // Verificar si ya existe una alerta activa
        const existingAlerts = await alertRepository.findByProductId(product.id);
        const hasLowStockAlert = existingAlerts.some(
          (a) => a.alertType === ALERT_TYPES.LOW_STOCK
        );

        if (!hasLowStockAlert) {
          const alert = await alertRepository.create({
            productId: product.id,
            productName: product.name,
            productSku: product.sku,
            alertType: ALERT_TYPES.LOW_STOCK,
            severity: "warning",
            message: `Stock bajo para ${product.name}`,
            details: {
              currentStock: product.currentStock,
              minimumStock: product.minimumStock,
            },
          });
          alerts.push(alert);
        }
      }
    }

    return alerts;
  }

  /**
   * Generar alertas de vencimiento
   */
  static async generateExpirationAlerts() {
    const products = await productRepository.findAll();
    const alerts = [];

    for (const product of products) {
      if (!product.expiryDate) continue;

      const expirationStatus = checkExpirationStatus(product.expiryDate);

      if (expirationStatus) {
        // Verificar si ya existe alerta
        const existingAlerts = await alertRepository.findByProductId(product.id);

        let alertType;
        let message;
        let severity;

        if (expirationStatus === "expired") {
          alertType = ALERT_TYPES.EXPIRED;
          message = `Producto vencido: ${product.name}`;
          severity = "critical";
        } else if (expirationStatus === "expiring_7_days") {
          alertType = ALERT_TYPES.EXPIRING_7_DAYS;
          message = `${product.name} vence en 7 días`;
          severity = "critical";
        } else if (expirationStatus === "expiring_30_days") {
          alertType = ALERT_TYPES.EXPIRING_30_DAYS;
          message = `${product.name} vence en 30 días`;
          severity = "warning";
        }

        const hasAlert = existingAlerts.some((a) => a.alertType === alertType);

        if (!hasAlert) {
          const alert = await alertRepository.create({
            productId: product.id,
            productName: product.name,
            productSku: product.sku,
            alertType,
            severity,
            message,
            details: {
              expiryDate: product.expiryDate,
            },
          });
          alerts.push(alert);
        }
      }
    }

    return alerts;
  }

  /**
   * Obtener todas las alertas activas
   */
  static async getActiveAlerts(alertType = null) {
    if (alertType) {
      return await alertRepository.findByType(alertType);
    }
    return await alertRepository.findAllActive();
  }

  /**
   * Obtener alertas con paginación
   */
  static async getAlerts(filters = {}, limit = 20, offset = 0) {
    return await alertRepository.findAll(filters, limit, offset);
  }

  /**
   * Resolver una alerta
   */
  static async resolveAlert(alertId) {
    const alert = await alertRepository.resolve(alertId);
    if (!alert) {
      throw { statusCode: 404, message: "Alerta no encontrada" };
    }
    return alert;
  }
}

export class ReportsUseCases {
  /**
   * Generar reporte de stock bajo
   */
  static async generateLowStockReport() {
    const products = await productRepository.findAll();
    const lowStockProducts = products.filter((p) => p.isLowStock());

    return {
      type: "low_stock",
      title: "Reporte de Stock Bajo",
      description: "Productos con stock por debajo del mínimo configurado",
      data: lowStockProducts.map((p) => ({
        id: p.id,
        sku: p.sku,
        name: p.name,
        currentStock: p.currentStock,
        minimumStock: p.minimumStock,
      })),
      summary: {
        total: lowStockProducts.length,
      },
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Generar reporte de vencimientos
   */
  static async generateExpirationReport() {
    const products = await productRepository.findAll();
    const expirationData = [];

    for (const product of products) {
      if (!product.expiryDate) continue;

      const status = checkExpirationStatus(product.expiryDate);
      if (status) {
        expirationData.push({
          id: product.id,
          sku: product.sku,
          name: product.name,
          expiryDate: product.expiryDate,
          status: status === "expired" ? "Vencido" : "Próximo a vencer",
          currentStock: product.currentStock,
        });
      }
    }

    return {
      type: "expiration",
      title: "Reporte de Vencimientos",
      description: "Productos vencidos o próximos a vencer",
      data: expirationData,
      summary: {
        total: expirationData.length,
        expired: expirationData.filter((p) => p.status === "Vencido").length,
        expiring: expirationData.filter((p) => p.status === "Próximo a vencer").length,
      },
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Generar reporte de productos con más movimientos
   */
  static async generateTopMovementsReport() {
    const movements = Array.from(
      new Map(
        (await movementRepository.findAll({}, 1000, 0)).data.map((m) => [m.id, m])
      ).values()
    );

    const productMovementCount = {};

    for (const movement of movements) {
      if (!productMovementCount[movement.productId]) {
        productMovementCount[movement.productId] = 0;
      }
      if (movement.movementType === MOVEMENT_TYPES.EXIT) {
        productMovementCount[movement.productId]++;
      }
    }

    const topProducts = [];
    for (const [productId, count] of Object.entries(productMovementCount)) {
      const product = await productRepository.findById(parseInt(productId));
      if (product) {
        topProducts.push({
          id: product.id,
          sku: product.sku,
          name: product.name,
          totalExits: count,
          currentStock: product.currentStock,
        });
      }
    }

    topProducts.sort((a, b) => b.totalExits - a.totalExits);

    return {
      type: "top_exits",
      title: "Reporte de Productos con Más Movimientos",
      description: "Productos con mayor número de salidas",
      data: topProducts.slice(0, 10),
      summary: {
        total: topProducts.length,
        topProduct: topProducts[0] || null,
      },
      generatedAt: new Date().toISOString(),
    };
  }
}

export class DashboardUseCases {
  /**
   * Obtener datos del dashboard
   */
  static async getDashboardData() {
    const products = await productRepository.findAll();

    // Contar productos por estado
    const lowStockCount = products.filter((p) => p.isLowStock()).length;
    const expiredAndExpiringCount = products.filter((p) => {
      const status = checkExpirationStatus(p.expiryDate);
      return status && status !== "expiring_30_days";
    }).length;
    const expiringCount = products.filter((p) => {
      const status = checkExpirationStatus(p.expiryDate);
      return status === "expiring_7_days" || status === "expiring_30_days";
    }).length;

    // Alertas activas
    const activeAlerts = await alertRepository.findAllActive();

    // Movimientos en últimos 30 días
    const allMovements = await movementRepository.findAll({}, 10000, 0);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentMovements = allMovements.data.filter(
      (m) => new Date(m.createdAt) >= thirtyDaysAgo
    );

    // Productos con más salidas (últimos 30 días)
    const exitMovements = recentMovements.filter((m) => m.movementType === MOVEMENT_TYPES.EXIT);
    const topExits = {};

    for (const movement of exitMovements) {
      if (!topExits[movement.productId]) {
        topExits[movement.productId] = 0;
      }
      topExits[movement.productId]++;
    }

    const topMovingProducts = [];
    for (const [productId, count] of Object.entries(topExits)) {
      const product = await productRepository.findById(parseInt(productId));
      if (product) {
        topMovingProducts.push({
          id: product.id,
          name: product.name,
          sku: product.sku,
          exitCount: count,
        });
      }
    }

    topMovingProducts.sort((a, b) => b.exitCount - a.exitCount);

    return {
      totalProducts: products.length,
      totalStock: products.reduce((sum, p) => sum + p.currentStock, 0),
      lowStockCount,
      expiredCount: expiredAndExpiringCount - expiringCount,
      expiringCount,
      activeAlertCount: activeAlerts.length,
      movementsLast30Days: recentMovements.length,
      topMovingProducts: topMovingProducts.slice(0, 5),
      generatedAt: new Date().toISOString(),
    };
  }
}
