import { supabase } from "./supabaseClient.repository.js";
import { ApiError, errorCodes } from "../utils/apiError.js";

const userSelect = "id, name, email, role, status, created_at, updated_at";
const userWithPasswordSelect = `${userSelect}, password_hash`;

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

const toUser = (row) =>
  row
    ? {
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }
    : null;

const toUserWithPassword = (row) =>
  row
    ? {
        ...toUser(row),
        passwordHash: row.password_hash,
      }
    : null;

const dbUnavailable = (message, error) =>
  new ApiError(503, errorCodes.serviceUnavailable, message, {
    dbCode: error?.code ?? null,
  });

const isUniqueViolation = (error) => error?.code === "23505";

const sanitizeSearch = (search) =>
  search.replace(/[(),]/g, " ").replace(/\s+/g, " ").trim();

export const findUserByEmail = async (email) => {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("users")
    .select(userWithPasswordSelect)
    .eq("email", email)
    .maybeSingle();

  if (error) {
    throw dbUnavailable("No se pudo consultar el usuario.", error);
  }

  return toUserWithPassword(data);
};

export const findUserById = async (id) => {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("users")
    .select(userSelect)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw dbUnavailable("No se pudo consultar el usuario.", error);
  }

  return toUser(data);
};

export const listUsers = async ({ search, role, status, page, pageSize }) => {
  const client = ensureSupabase();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  let query = client.from("users").select(userSelect, { count: "exact" });

  if (search) {
    const safeSearch = sanitizeSearch(search);

    if (safeSearch) {
      const pattern = `%${safeSearch}%`;
      query = query.or(`name.ilike.${pattern},email.ilike.${pattern}`);
    }
  }

  if (role) {
    query = query.eq("role", role);
  }

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw dbUnavailable("No se pudo listar usuarios.", error);
  }

  const totalItems = count ?? 0;

  return {
    items: (data ?? []).map(toUser),
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages: totalItems > 0 ? Math.ceil(totalItems / pageSize) : 0,
    },
  };
};

export const createUser = async ({ name, email, passwordHash, role, status }) => {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("users")
    .insert({
      name,
      email,
      password_hash: passwordHash,
      role,
      status,
    })
    .select(userSelect)
    .single();

  if (isUniqueViolation(error)) {
    throw new ApiError(
      409,
      errorCodes.emailAlreadyExists,
      "Ya existe un usuario con ese correo.",
    );
  }

  if (error) {
    throw dbUnavailable("No se pudo crear el usuario.", error);
  }

  return toUser(data);
};

export const updateUser = async (id, updates) => {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("users")
    .update(updates)
    .eq("id", id)
    .select(userSelect)
    .maybeSingle();

  if (error) {
    throw dbUnavailable("No se pudo actualizar el usuario.", error);
  }

  return toUser(data);
};
