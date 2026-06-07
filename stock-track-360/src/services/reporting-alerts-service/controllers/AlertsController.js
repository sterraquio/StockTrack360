import { AlertsUseCases, ReportsUseCases, DashboardUseCases } from "../usecases/AlertsUseCases.js";
import { createSuccessResponse } from "@/services/shared/utils/helpers.js";

export class AlertsController {
  /**
   * GET /api/alerts/low-stock
   * Obtener alertas de stock bajo
   */
  static async getLowStockAlerts(req, res) {
    try {
      if (req.method !== "GET") {
        return res.status(405).json({ message: "Método no permitido" });
      }

      const alerts = await AlertsUseCases.generateLowStockAlerts();
      return res.status(200).json(createSuccessResponse(alerts));
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * GET /api/alerts/expired
   * Obtener alertas de productos vencidos
   */
  static async getExpiredAlerts(req, res) {
    try {
      if (req.method !== "GET") {
        return res.status(405).json({ message: "Método no permitido" });
      }

      const alerts = await AlertsUseCases.generateExpirationAlerts();
      const expiredOnly = alerts.filter((a) => a.alertType === "expired");
      return res.status(200).json(createSuccessResponse(expiredOnly));
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * GET /api/alerts/expiring
   * Obtener alertas de productos próximos a vencer
   */
  static async getExpiringAlerts(req, res) {
    try {
      if (req.method !== "GET") {
        return res.status(405).json({ message: "Método no permitido" });
      }

      const alerts = await AlertsUseCases.generateExpirationAlerts();
      const expiringOnly = alerts.filter(
        (a) => a.alertType === "expiring_7_days" || a.alertType === "expiring_30_days"
      );
      return res.status(200).json(createSuccessResponse(expiringOnly));
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * GET /api/alerts
   * Obtener todas las alertas con filtros
   */
  static async getAllAlerts(req, res) {
    try {
      if (req.method !== "GET") {
        return res.status(405).json({ message: "Método no permitido" });
      }

      const filters = {
        alertType: req.query.alertType,
        resolved: req.query.resolved === "true",
      };

      const limit = parseInt(req.query.limit) || 20;
      const offset = parseInt(req.query.offset) || 0;

      // Primero generar alertas
      await AlertsUseCases.generateLowStockAlerts();
      await AlertsUseCases.generateExpirationAlerts();

      const result = await AlertsUseCases.getAlerts(filters, limit, offset);
      return res.status(200).json(createSuccessResponse(result));
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * PATCH /api/alerts/:id/resolve
   * Resolver una alerta
   */
  static async resolveAlert(req, res) {
    try {
      if (req.method !== "PATCH") {
        return res.status(405).json({ message: "Método no permitido" });
      }

      const alertId = parseInt(req.query.id);
      const alert = await AlertsUseCases.resolveAlert(alertId);
      return res.status(200).json(createSuccessResponse(alert, "Alerta resuelta"));
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({ message: error.message });
    }
  }
}

export class ReportsController {
  /**
   * GET /api/reports/low-stock
   * Generar reporte de stock bajo
   */
  static async getLowStockReport(req, res) {
    try {
      if (req.method !== "GET") {
        return res.status(405).json({ message: "Método no permitido" });
      }

      const report = await ReportsUseCases.generateLowStockReport();
      return res.status(200).json(createSuccessResponse(report));
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * GET /api/reports/expiration
   * Generar reporte de vencimientos
   */
  static async getExpirationReport(req, res) {
    try {
      if (req.method !== "GET") {
        return res.status(405).json({ message: "Método no permitido" });
      }

      const report = await ReportsUseCases.generateExpirationReport();
      return res.status(200).json(createSuccessResponse(report));
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * GET /api/reports/top-exits
   * Generar reporte de productos con más salidas
   */
  static async getTopExitsReport(req, res) {
    try {
      if (req.method !== "GET") {
        return res.status(405).json({ message: "Método no permitido" });
      }

      const report = await ReportsUseCases.generateTopMovementsReport();
      return res.status(200).json(createSuccessResponse(report));
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export class DashboardController {
  /**
   * GET /api/dashboard
   * Obtener datos del dashboard
   */
  static async getDashboard(req, res) {
    try {
      if (req.method !== "GET") {
        return res.status(405).json({ message: "Método no permitido" });
      }

      const data = await DashboardUseCases.getDashboardData();
      return res.status(200).json(createSuccessResponse(data));
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
