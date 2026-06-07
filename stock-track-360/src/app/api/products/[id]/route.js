import { InventoryUseCases } from "@/services/inventory-service/usecases/InventoryUseCases.js";
import { createSuccessResponse } from "@/services/shared/utils/helpers.js";

export async function GET(req, { params }) {
  try {
    const id = parseInt(params.id);

    if (!id) {
      return Response.json({ message: "ID es requerido" }, { status: 400 });
    }

    const product = await InventoryUseCases.getProductById(id);
    return Response.json(createSuccessResponse(product));
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return Response.json({ message: error.message }, { status: statusCode });
  }
}

export async function PATCH(req, { params }) {
  try {
    const id = parseInt(params.id);
    const body = await req.json();

    if (!id) {
      return Response.json({ message: "ID es requerido" }, { status: 400 });
    }

    const product = await InventoryUseCases.updateProduct(id, body);
    return Response.json(createSuccessResponse(product, "Producto actualizado"));
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

export async function DELETE(req, { params }) {
  try {
    const id = parseInt(params.id);

    if (!id) {
      return Response.json({ message: "ID es requerido" }, { status: 400 });
    }

    const result = await InventoryUseCases.deleteProduct(id);
    return Response.json(createSuccessResponse(result));
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return Response.json({ message: error.message }, { status: statusCode });
  }
}
