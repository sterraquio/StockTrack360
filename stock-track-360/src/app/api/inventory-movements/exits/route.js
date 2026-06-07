import { InventoryUseCases } from "@/services/inventory-service/usecases/InventoryUseCases.js";
import { createSuccessResponse } from "@/services/shared/utils/helpers.js";

export async function POST(req) {
  try {
    const body = await req.json();
    body.movementType = "exit";

    const result = await InventoryUseCases.recordExit(body);
    return Response.json(createSuccessResponse(result, "Salida registrada exitosamente"), {
      status: 201,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return Response.json(
      {
        message: error.message,
        errors: error.errors,
        details: error.details,
      },
      { status: statusCode }
    );
  }
}
