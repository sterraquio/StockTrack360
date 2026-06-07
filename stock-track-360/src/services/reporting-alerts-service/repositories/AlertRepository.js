import { Alert } from "../models/Alert.js";

/**
 * Repositorio en memoria para alertas
 */
export class AlertRepository {
  constructor() {
    this.alerts = new Map();
    this.idCounter = 1;
  }

  async create(alertData) {
    const id = this.idCounter++;
    const alert = new Alert({
      id,
      ...alertData,
      createdAt: new Date().toISOString(),
    });

    this.alerts.set(id, alert);
    return alert;
  }

  async findById(id) {
    return this.alerts.get(id) || null;
  }

  async findByProductId(productId) {
    return Array.from(this.alerts.values()).filter(
      (a) => a.productId === productId && !a.isResolved
    );
  }

  async findByType(alertType) {
    return Array.from(this.alerts.values()).filter(
      (a) => a.alertType === alertType && !a.isResolved
    );
  }

  async findAllActive() {
    return Array.from(this.alerts.values()).filter((a) => !a.isResolved);
  }

  async findAll(filters = {}, limit = 20, offset = 0) {
    let results = Array.from(this.alerts.values());

    if (filters.alertType) {
      results = results.filter((a) => a.alertType === filters.alertType);
    }

    if (filters.resolved !== undefined) {
      results = results.filter((a) => a.isResolved === filters.resolved);
    }

    results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return {
      data: results.slice(offset, offset + limit),
      total: results.length,
    };
  }

  async resolve(alertId) {
    const alert = this.alerts.get(alertId);
    if (!alert) return null;

    alert.isResolved = true;
    alert.resolvedAt = new Date().toISOString();
    return alert;
  }

  async deleteResolved() {
    let count = 0;
    for (const [id, alert] of this.alerts.entries()) {
      if (alert.isResolved) {
        this.alerts.delete(id);
        count++;
      }
    }
    return count;
  }

  getActiveAlertCount() {
    return Array.from(this.alerts.values()).filter((a) => !a.isResolved).length;
  }

  getAlertCountByType(alertType) {
    return Array.from(this.alerts.values()).filter(
      (a) => a.alertType === alertType && !a.isResolved
    ).length;
  }
}

export const alertRepository = new AlertRepository();
