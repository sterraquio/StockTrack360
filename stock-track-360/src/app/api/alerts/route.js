import {
  AlertsUseCases,
  ReportsUseCases,
  DashboardUseCases,
} from "@/services/reporting-alerts-service/usecases/AlertsUseCases.js";
import { createSuccessResponse } from "@/services/shared/utils/helpers.js";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    // Generar alertas
    await AlertsUseCases.generateLowStockAlerts();
    await AlertsUseCases.generateExpirationAlerts();

    const filters = {
      alertType: searchParams.get("alertType"),
      resolved: searchParams.get("resolved") === "true",
    };

    const limit = parseInt(searchParams.get("limit")) || 20;
    const offset = parseInt(searchParams.get("offset")) || 0;

    const result = await AlertsUseCases.getAlerts(filters, limit, offset);
    return Response.json(createSuccessResponse(result));
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
