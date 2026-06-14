import { supabase } from "./supabaseClient.repository.js";
import { ApiError, errorCodes } from "../utils/apiError.js";

const categorySelect = "id, name, requires_expiration_date";

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

export const toCategory = (row) =>
  row
    ? {
        id: row.id,
        name: row.name,
        requiresExpirationDate: row.requires_expiration_date,
      }
    : null;

export const listCategories = async () => {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("categories")
    .select(categorySelect)
    .order("name", { ascending: true });

  if (error) {
    throw dbUnavailable("No se pudo listar categorias.", error);
  }

  return { items: (data ?? []).map(toCategory) };
};

export const findCategoryById = async (id) => {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("categories")
    .select(categorySelect)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw dbUnavailable("No se pudo consultar la categoria.", error);
  }

  return toCategory(data);
};

export const findCategoryByName = async (name) => {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("categories")
    .select(categorySelect)
    .ilike("name", name)
    .limit(1);

  if (error) {
    throw dbUnavailable("No se pudo consultar la categoria.", error);
  }

  return toCategory(data?.[0] ?? null);
};

export const createCategory = async ({ name, requiresExpirationDate }) => {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("categories")
    .insert({
      name,
      requires_expiration_date: requiresExpirationDate,
    })
    .select(categorySelect)
    .single();

  if (isUniqueViolation(error)) {
    throw new ApiError(
      409,
      errorCodes.categoryAlreadyExists,
      "Ya existe una categoria con ese nombre.",
    );
  }

  if (error) {
    throw dbUnavailable("No se pudo crear la categoria.", error);
  }

  return toCategory(data);
};
