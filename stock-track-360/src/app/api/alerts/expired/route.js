import { AlertsUseCases } from "@/services/reporting-alerts-service/usecases/AlertsUseCases.js";
import { createSuccessResponse } from "@/services/shared/utils/helpers.js";

export async function GET(req) {
  try {
    const alerts = await AlertsUseCases.generateExpirationAlerts();
    const expiredOnly = alerts.filter((a) => a.alertType === "expired");
    return Response.json(createSuccessResponse(expiredOnly));
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
