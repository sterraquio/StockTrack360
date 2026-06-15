import { supabase } from "./supabaseClient.repository.js";
import { ApiError, errorCodes } from "../utils/apiError.js";

const appTimeZone = "America/Bogota";
const millisecondsPerDay = 86_400_000;
const lowStockBatchSize = 1000;

const productAlertSelect = `
  id,
  name,
  sku,
  expiration_date,
  minimum_stock,
  available_stock,
  category:categories (
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

const getTodayDateString = () => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: appTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const dateParts = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
};

const addDays = (dateString, days) => {
  const date = new Date(`${dateString}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);

  return date.toISOString().slice(0, 10);
};

const daysBetween = (fromDate, toDate) =>
  Math.round(
    (Date.parse(`${toDate}T00:00:00.000Z`) -
      Date.parse(`${fromDate}T00:00:00.000Z`)) /
      millisecondsPerDay,
  );

const getCategoryName = (row) => {
  const category = Array.isArray(row.category) ? row.category[0] : row.category;

  return category?.name ?? "N/A";
};

const getPagination = ({ page, pageSize, totalItems }) => ({
  page,
  pageSize,
  totalItems,
  totalPages: totalItems > 0 ? Math.ceil(totalItems / pageSize) : 0,
});

const paginateItems = (items, { page, pageSize }) => {
  const start = (page - 1) * pageSize;
  const paginatedItems = items.slice(start, start + pageSize);

  return {
    items: paginatedItems,
    pagination: getPagination({
      page,
      pageSize,
      totalItems: items.length,
    }),
  };
};

const toLowStockAlert = (row) => ({
  productId: row.id,
  name: row.name,
  sku: row.sku,
  categoryName: getCategoryName(row),
  availableStock: row.available_stock,
  minimumStock: row.minimum_stock,
});

const toExpirationAlert = (row, today, status) => ({
  productId: row.id,
  name: row.name,
  sku: row.sku,
  categoryName: getCategoryName(row),
  expirationDate: row.expiration_date,
  daysUntilExpiration: daysBetween(today, row.expiration_date),
  status,
});

const fetchLowStockCandidates = async (client) => {
  const products = [];
  let from = 0;

  while (true) {
    const to = from + lowStockBatchSize - 1;
    const { data, error } = await client
      .from("products")
      .select(productAlertSelect)
      .not("minimum_stock", "is", null)
      .order("available_stock", { ascending: true })
      .order("name", { ascending: true })
      .range(from, to);

    if (error) {
      throw dbUnavailable("No se pudo listar alertas de stock bajo.", error);
    }

    const batch = data ?? [];
    products.push(...batch);

    if (batch.length < lowStockBatchSize) {
      return products;
    }

    from += lowStockBatchSize;
  }
};

export const listLowStockAlerts = async ({ page, pageSize }) => {
  const client = ensureSupabase();
  const products = await fetchLowStockCandidates(client);
  const alerts = products
    .filter(
      (product) =>
        product.minimum_stock !== null &&
        product.available_stock <= product.minimum_stock,
    )
    .map(toLowStockAlert);

  return paginateItems(alerts, { page, pageSize });
};

export const listExpiredAlerts = async ({ page, pageSize }) => {
  const client = ensureSupabase();
  const today = getTodayDateString();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, error, count } = await client
    .from("products")
    .select(productAlertSelect, { count: "exact" })
    .not("expiration_date", "is", null)
    .lte("expiration_date", today)
    .order("expiration_date", { ascending: true })
    .order("name", { ascending: true })
    .range(from, to);

  if (error) {
    throw dbUnavailable("No se pudo listar alertas de vencidos.", error);
  }

  const totalItems = count ?? 0;

  return {
    items: (data ?? []).map((row) => toExpirationAlert(row, today, "EXPIRED")),
    pagination: getPagination({ page, pageSize, totalItems }),
  };
};

export const listExpiringSoonAlerts = async ({ days, page, pageSize }) => {
  const client = ensureSupabase();
  const today = getTodayDateString();
  const until = addDays(today, days);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, error, count } = await client
    .from("products")
    .select(productAlertSelect, { count: "exact" })
    .not("expiration_date", "is", null)
    .gt("expiration_date", today)
    .lte("expiration_date", until)
    .order("expiration_date", { ascending: true })
    .order("name", { ascending: true })
    .range(from, to);

  if (error) {
    throw dbUnavailable("No se pudo listar alertas de proximos vencimientos.", error);
  }

  const totalItems = count ?? 0;

  return {
    items: (data ?? []).map((row) =>
      toExpirationAlert(row, today, "EXPIRING_SOON"),
    ),
    pagination: getPagination({ page, pageSize, totalItems }),
  };
};
