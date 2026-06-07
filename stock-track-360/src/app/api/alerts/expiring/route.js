import { AlertsUseCases } from "@/services/reporting-alerts-service/usecases/AlertsUseCases.js";
import { createSuccessResponse } from "@/services/shared/utils/helpers.js";

export async function GET(req) {
  try {
    const alerts = await AlertsUseCases.generateExpirationAlerts();
    const expiringOnly = alerts.filter(
      (a) => a.alertType === "expiring_7_days" || a.alertType === "expiring_30_days"
    );
    return Response.json(createSuccessResponse(expiringOnly));
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
