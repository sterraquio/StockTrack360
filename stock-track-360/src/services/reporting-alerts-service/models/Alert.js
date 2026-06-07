/**
 * Modelo de Alerta
 */
export class Alert {
  constructor(data) {
    this.id = data.id;
    this.productId = data.productId;
    this.productName = data.productName;
    this.productSku = data.productSku;
    this.alertType = data.alertType; // low_stock, expired, expiring_7_days, expiring_30_days
    this.severity = data.severity; // critical, warning, info
    this.message = data.message;
    this.details = data.details || {};
    this.createdAt = data.createdAt;
    this.resolvedAt = data.resolvedAt || null;
    this.isResolved = data.isResolved || false;
  }
}

/**
 * Modelo de Reporte
 */
export class Report {
  constructor(data) {
    this.type = data.type; // low_stock, expiration, top_exits
    this.title = data.title;
    this.description = data.description;
    this.data = data.data || [];
    this.generatedAt = data.generatedAt;
    this.summary = data.summary || {};
  }
}

/**
 * Modelo de Dashboard
 */
export class DashboardData {
  constructor(data) {
    this.totalProducts = data.totalProducts || 0;
    this.totalStock = data.totalStock || 0;
    this.lowStockCount = data.lowStockCount || 0;
    this.expiredCount = data.expiredCount || 0;
    this.expiringCount = data.expiringCount || 0;
    this.activeAlerts = data.activeAlerts || 0;
    this.movementsByPeriod = data.movementsByPeriod || {};
    this.topMovingProducts = data.topMovingProducts || [];
    this.generatedAt = data.generatedAt || new Date().toISOString();
  }
}
