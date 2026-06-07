import { InventoryUseCases } from "@/services/inventory-service/usecases/InventoryUseCases.js";
import { createSuccessResponse } from "@/services/shared/utils/helpers.js";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const filters = {
      productId: searchParams.get("productId") ? parseInt(searchParams.get("productId")) : undefined,
      movementType: searchParams.get("movementType"),
      userId: searchParams.get("userId"),
    };

    const limit = parseInt(searchParams.get("limit")) || 20;
    const offset = parseInt(searchParams.get("offset")) || 0;

    const result = await InventoryUseCases.getAllMovements(filters, limit, offset);
    return Response.json(createSuccessResponse(result));
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
