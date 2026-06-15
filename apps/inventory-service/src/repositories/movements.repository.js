import { supabase } from "./supabaseClient.repository.js";
import { ApiError, errorCodes } from "../utils/apiError.js";

const movementSelect = `
  id,
  product_id,
  user_id,
  type,
  quantity,
  created_at,
  product:products (
    id,
    name,
    sku
  ),
  user:users (
    id,
    name
  )
`;

const ensureSupabase = () => {
  if (!supabase) {
    throw new ApiError(
      503,
      errorCodes.serviceUnavailable,
      "Conexion Supabase no configurada.",
    );
  }

  return supabase;
};

const dbUnavailable = (message, error) =>
  new ApiError(503, errorCodes.serviceUnavailable, message, {
    dbCode: error?.code ?? null,
  });

const movementDateStart = (date) => `${date}T00:00:00.000Z`;
const movementDateEnd = (date) => `${date}T23:59:59.999Z`;

export const toMovement = (row) =>
  row
    ? {
        id: row.id,
        productId: row.product_id,
        productName: row.product_name ?? row.product?.name ?? "",
        sku: row.sku ?? row.product?.sku ?? "",
        userId: row.user_id,
        userName: row.user_name ?? row.user?.name ?? "",
        type: row.type,
        quantity: row.quantity,
        createdAt: row.created_at,
      }
    : null;

const mapMovementRpcError = (error) => {
  if (!error) {
    return null;
  }

  const rpcCode = String(error.message || "").trim().toUpperCase();

  if (rpcCode === "PRODUCT_NOT_FOUND") {
    return new ApiError(
      404,
      errorCodes.productNotFound,
      "Producto no encontrado.",
    );
  }

  if (rpcCode === "INSUFFICIENT_STOCK") {
    return new ApiError(
      409,
      errorCodes.insufficientStock,
      "La salida no puede superar el stock disponible.",
    );
  }

  if (
    rpcCode === "INVALID_MOVEMENT_TYPE" ||
    rpcCode === "INVALID_MOVEMENT_QUANTITY"
  ) {
    return new ApiError(
      400,
      errorCodes.validationError,
      "Datos de movimiento invalidos.",
      {
        dbCode: error.code ?? null,
      },
    );
  }

  if (rpcCode === "USER_NOT_FOUND_OR_INACTIVE") {
    return new ApiError(
      403,
      errorCodes.forbidden,
      "No tienes permisos para realizar esta accion.",
    );
  }

  return dbUnavailable("No se pudo registrar el movimiento.", error);
};

export const listMovements = async ({
  productId,
  type,
  from: fromDate,
  to: toDate,
  page,
  pageSize,
}) => {
  const client = ensureSupabase();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  let query = client
    .from("inventory_movements")
    .select(movementSelect, { count: "exact" });

  if (productId) {
    query = query.eq("product_id", productId);
  }

  if (type) {
    query = query.eq("type", type);
  }

  if (fromDate) {
    query = query.gte("created_at", movementDateStart(fromDate));
  }

  if (toDate) {
    query = query.lte("created_at", movementDateEnd(toDate));
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw dbUnavailable("No se pudo listar movimientos.", error);
  }

  const totalItems = count ?? 0;

  return {
    items: (data ?? []).map(toMovement),
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages: totalItems > 0 ? Math.ceil(totalItems / pageSize) : 0,
    },
  };
};

export const registerMovement = async ({ productId, userId, type, quantity }) => {
  const client = ensureSupabase();
  const { data, error } = await client.rpc("register_inventory_movement", {
    p_product_id: productId,
    p_user_id: userId,
    p_type: type,
    p_quantity: quantity,
  });

  if (error) {
    throw mapMovementRpcError(error);
  }

  const movement = Array.isArray(data) ? data[0] : data;

  if (!movement) {
    throw new ApiError(
      503,
      errorCodes.serviceUnavailable,
      "No se pudo registrar el movimiento.",
    );
  }

  return toMovement(movement);
};
