import { ReportsUseCases } from "@/services/reporting-alerts-service/usecases/AlertsUseCases.js";
import { createSuccessResponse } from "@/services/shared/utils/helpers.js";

export async function GET(req) {
  try {
    const report = await ReportsUseCases.generateTopMovementsReport();
    return Response.json(createSuccessResponse(report));
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
