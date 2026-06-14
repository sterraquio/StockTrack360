import { supabase } from "./supabaseClient.repository.js";
import { toCategory } from "./categories.repository.js";
import { ApiError, errorCodes } from "../utils/apiError.js";

const productSelect = `
  id,
  name,
  sku,
  expiration_date,
  minimum_stock,
  available_stock,
  created_at,
  updated_at,
  category:categories (
    id,
    name,
    requires_expiration_date
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

const isUniqueViolation = (error) => error?.code === "23505";
const isForeignKeyViolation = (error) => error?.code === "23503";

export const toProduct = (row) =>
  row
    ? {
        id: row.id,
        name: row.name,
        sku: row.sku,
        category: toCategory(row.category),
        expirationDate: row.expiration_date,
        minimumStock: row.minimum_stock,
        availableStock: row.available_stock,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }
    : null;

export const findProductBySku = async (sku) => {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("products")
    .select(productSelect)
    .eq("sku", sku)
    .maybeSingle();

  if (error) {
    throw dbUnavailable("No se pudo consultar el producto.", error);
  }

  return toProduct(data);
};

export const findProductById = async (id) => {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("products")
    .select(productSelect)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw dbUnavailable("No se pudo consultar el producto.", error);
  }

  return toProduct(data);
};

export const listProducts = async ({ search, sku, categoryId, page, pageSize }) => {
  const client = ensureSupabase();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  let query = client.from("products").select(productSelect, { count: "exact" });

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  if (sku) {
    query = query.eq("sku", sku);
  }

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data, error, count } = await query
    .order("name", { ascending: true })
    .range(from, to);

  if (error) {
    throw dbUnavailable("No se pudo listar productos.", error);
  }

  const totalItems = count ?? 0;

  return {
    items: (data ?? []).map(toProduct),
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages: totalItems > 0 ? Math.ceil(totalItems / pageSize) : 0,
    },
  };
};

export const createProduct = async (payload) => {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("products")
    .insert({
      name: payload.name,
      sku: payload.sku,
      category_id: payload.categoryId,
      expiration_date: payload.expirationDate,
      minimum_stock: payload.minimumStock,
      available_stock: 0,
    })
    .select(productSelect)
    .single();

  if (isUniqueViolation(error)) {
    throw new ApiError(
      409,
      errorCodes.skuAlreadyExists,
      "Ya existe un producto con ese SKU.",
    );
  }

  if (isForeignKeyViolation(error)) {
    throw new ApiError(
      404,
      errorCodes.categoryNotFound,
      "Categoria no encontrada.",
    );
  }

  if (error) {
    throw dbUnavailable("No se pudo crear el producto.", error);
  }

  return toProduct(data);
};

export const updateProduct = async (id, updates) => {
  const client = ensureSupabase();
  const dbUpdates = {};

  if (Object.prototype.hasOwnProperty.call(updates, "name")) {
    dbUpdates.name = updates.name;
  }

  if (Object.prototype.hasOwnProperty.call(updates, "categoryId")) {
    dbUpdates.category_id = updates.categoryId;
  }

  if (Object.prototype.hasOwnProperty.call(updates, "expirationDate")) {
    dbUpdates.expiration_date = updates.expirationDate;
  }

  if (Object.prototype.hasOwnProperty.call(updates, "minimumStock")) {
    dbUpdates.minimum_stock = updates.minimumStock;
  }

  const { data, error } = await client
    .from("products")
    .update(dbUpdates)
    .eq("id", id)
    .select(productSelect)
    .maybeSingle();

  if (isForeignKeyViolation(error)) {
    throw new ApiError(
      404,
      errorCodes.categoryNotFound,
      "Categoria no encontrada.",
    );
  }

  if (error) {
    throw dbUnavailable("No se pudo actualizar el producto.", error);
  }

  return toProduct(data);
};

export const deleteProductById = async (id) => {
  const client = ensureSupabase();
  const { error } = await client.from("products").delete().eq("id", id);

  if (isForeignKeyViolation(error)) {
    throw new ApiError(
      409,
      errorCodes.productHasStock,
      "No se puede eliminar el producto porque tiene registros asociados.",
    );
  }

  if (error) {
    throw dbUnavailable("No se pudo eliminar el producto.", error);
  }
};
