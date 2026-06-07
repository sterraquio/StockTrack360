import { AlertsUseCases } from "@/services/reporting-alerts-service/usecases/AlertsUseCases.js";
import { createSuccessResponse } from "@/services/shared/utils/helpers.js";

export async function GET(req) {
  try {
    const alerts = await AlertsUseCases.generateLowStockAlerts();
    return Response.json(createSuccessResponse(alerts));
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
