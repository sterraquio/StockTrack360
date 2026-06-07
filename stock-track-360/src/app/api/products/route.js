import { InventoryUseCases } from "@/services/inventory-service/usecases/InventoryUseCases.js";
import { createSuccessResponse } from "@/services/shared/utils/helpers.js";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const filters = {
      categoryId: searchParams.get("categoryId")
        ? parseInt(searchParams.get("categoryId"))
        : undefined,
      search: searchParams.get("search"),
    };

    const products = await InventoryUseCases.listProducts(filters);
    return Response.json(createSuccessResponse(products, "Productos obtenidos exitosamente"));
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const product = await InventoryUseCases.createProduct(body);
    return Response.json(createSuccessResponse(product, "Producto creado exitosamente"), {
      status: 201,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return Response.json(
      {
        message: error.message,
        errors: error.errors,
      },
      { status: statusCode }
    );
  }
}
