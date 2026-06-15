import { ApiError, errorCodes } from "../utils/apiError.js";
import { supabase } from "./supabaseClient.repository.js";

const appTimeZone = "America/Bogota";
const millisecondsPerDay = 86_400_000;
const batchSize = 1000;

const productReportSelect = `
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

const movementProductSelect = `
  id,
  product_id,
  type,
  quantity,
  created_at,
  product:products (
    id,
    name,
    sku,
    category:categories (
      name
    )
  )
`;

const movementPeriodSelect = `
  id,
  type,
  quantity,
  created_at
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

const getCategoryName = (row) => {
  const category = Array.isArray(row?.category) ? row.category[0] : row?.category;

  return category?.name ?? "N/A";
};

const getProductCategoryName = (movement) => getCategoryName(movement?.product);

const getPagination = ({ page, pageSize, totalItems }) => ({
  page,
  pageSize,
  totalItems,
  totalPages: totalItems > 0 ? Math.ceil(totalItems / pageSize) : 0,
});

const paginateItems = (items, { page, pageSize }) => {
  const start = (page - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    pagination: getPagination({ page, pageSize, totalItems: items.length }),
  };
};

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

const dateStart = (date) => `${date}T00:00:00.000Z`;
const dateEnd = (date) => `${date}T23:59:59.999Z`;

const applyDateRange = (query, { from, to }) => {
  let scopedQuery = query;

  if (from) {
    scopedQuery = scopedQuery.gte("created_at", dateStart(from));
  }

  if (to) {
    scopedQuery = scopedQuery.lte("created_at", dateEnd(to));
  }

  return scopedQuery;
};

const fetchLowStockCandidates = async (client) => {
  const products = [];
  let from = 0;

  while (true) {
    const to = from + batchSize - 1;
    const { data, error } = await client
      .from("products")
      .select(productReportSelect)
      .not("minimum_stock", "is", null)
      .order("available_stock", { ascending: true })
      .order("name", { ascending: true })
      .range(from, to);

    if (error) {
      throw dbUnavailable("No se pudo listar productos con stock bajo.", error);
    }

    const rows = data ?? [];
    products.push(...rows);

    if (rows.length < batchSize) {
      return products;
    }

    from += batchSize;
  }
};

const fetchMovementRows = async ({ filters = {}, select, type } = {}) => {
  const client = ensureSupabase();
  const movements = [];
  let from = 0;

  while (true) {
    const to = from + batchSize - 1;
    let query = client.from("inventory_movements").select(select);

    if (type) {
      query = query.eq("type", type);
    }

    const { data, error } = await applyDateRange(query, filters)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      throw dbUnavailable("No se pudo listar movimientos.", error);
    }

    const rows = data ?? [];
    movements.push(...rows);

    if (rows.length < batchSize) {
      return movements;
    }

    from += batchSize;
  }
};

const toLowStockAlert = (row) => ({
  productId: row.id,
  name: row.name,
  sku: row.sku,
  categoryName: getCategoryName(row),
  availableStock: row.available_stock,
  minimumStock: row.minimum_stock,
});

const toExpirationReportItem = (row, today) => {
  const daysUntilExpiration = daysBetween(today, row.expiration_date);

  return {
    productId: row.id,
    name: row.name,
    sku: row.sku,
    categoryName: getCategoryName(row),
    availableStock: row.available_stock,
    expirationDate: row.expiration_date,
    daysUntilExpiration,
    status: daysUntilExpiration <= 0 ? "EXPIRED" : "EXPIRING_SOON",
  };
};

const sortExpirationReportItems = (first, second) => {
  const firstRank = first.status === "EXPIRED" ? 0 : 1;
  const secondRank = second.status === "EXPIRED" ? 0 : 1;

  if (firstRank !== secondRank) {
    return firstRank - secondRank;
  }

  const distance =
    Math.abs(first.daysUntilExpiration) - Math.abs(second.daysUntilExpiration);

  if (distance !== 0) {
    return distance;
  }

  return first.name.localeCompare(second.name, "es");
};

const toReportItem = ({ productId, product, value, label, metadata = {} }) => ({
  id: productId,
  productId,
  name: product?.name ?? "Producto no encontrado",
  sku: product?.sku ?? "N/A",
  categoryName: getProductCategoryName({ product }),
  value,
  label,
  metadata,
});

const groupMovementsByProduct = (movements, valueBuilder) => {
  const grouped = new Map();

  movements.forEach((movement) => {
    const current = grouped.get(movement.product_id) ?? {
      productId: movement.product_id,
      product: movement.product,
      movementCount: 0,
      totalQuantity: 0,
    };

    current.movementCount += 1;
    current.totalQuantity += Number(movement.quantity ?? 0);
    grouped.set(movement.product_id, current);
  });

  return [...grouped.values()]
    .map((item) => valueBuilder(item))
    .sort((first, second) => {
      const valueDiff = Number(second.value ?? 0) - Number(first.value ?? 0);

      if (valueDiff !== 0) {
        return valueDiff;
      }

      return first.name.localeCompare(second.name, "es");
    });
};

const getDatePartsInTimeZone = (value) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: appTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(value));

  return Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
};

const getDateStringInTimeZone = (value) => {
  const parts = getDatePartsInTimeZone(value);

  return `${parts.year}-${parts.month}-${parts.day}`;
};

const getWeekPeriod = (dateString) => {
  const date = new Date(`${dateString}T00:00:00.000Z`);
  const day = date.getUTCDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;
  date.setUTCDate(date.getUTCDate() - daysFromMonday);

  return date.toISOString().slice(0, 10);
};

const getPeriod = (createdAt, groupBy) => {
  const dateString = getDateStringInTimeZone(createdAt);

  if (groupBy === "month") {
    return dateString.slice(0, 7);
  }

  if (groupBy === "week") {
    return getWeekPeriod(dateString);
  }

  return dateString;
};

const countProducts = async (client) => {
  const { error, count } = await client
    .from("products")
    .select("id", { count: "exact", head: true });

  if (error) {
    throw dbUnavailable("No se pudo contar productos.", error);
  }

  return count ?? 0;
};

const countExpiredProducts = async (client, today) => {
  const { error, count } = await client
    .from("products")
    .select("id", { count: "exact", head: true })
    .not("expiration_date", "is", null)
    .lte("expiration_date", today);

  if (error) {
    throw dbUnavailable("No se pudo contar productos vencidos.", error);
  }

  return count ?? 0;
};

const countExpiringSoonProducts = async (client, today, days) => {
  const { error, count } = await client
    .from("products")
    .select("id", { count: "exact", head: true })
    .not("expiration_date", "is", null)
    .gt("expiration_date", today)
    .lte("expiration_date", addDays(today, days));

  if (error) {
    throw dbUnavailable("No se pudo contar productos proximos a vencer.", error);
  }

  return count ?? 0;
};

const countMovements = async (client, filters) => {
  const { error, count } = await applyDateRange(
    client
      .from("inventory_movements")
      .select("id", { count: "exact", head: true }),
    filters,
  );

  if (error) {
    throw dbUnavailable("No se pudo contar movimientos.", error);
  }

  return count ?? 0;
};

const runDashboardMetric = async (key, fallback, getValue) => {
  try {
    return {
      failed: false,
      key,
      value: await getValue(),
    };
  } catch (error) {
    return {
      code: error.code ?? errorCodes.internalError,
      failed: true,
      key,
      message: error.message,
      value: fallback,
    };
  }
};

export const countLowStockProducts = async () => {
  const client = ensureSupabase();
  const products = await fetchLowStockCandidates(client);

  return products.filter(
    (product) =>
      product.minimum_stock !== null &&
      product.available_stock <= product.minimum_stock,
  ).length;
};

export const listLowStockReport = async ({ page, pageSize }) => {
  const client = ensureSupabase();
  const products = await fetchLowStockCandidates(client);
  const items = products
    .filter(
      (product) =>
        product.minimum_stock !== null &&
        product.available_stock <= product.minimum_stock,
    )
    .map(toLowStockAlert);

  return paginateItems(items, { page, pageSize });
};

export const listExpiringProductsReport = async ({ days, page, pageSize }) => {
  const client = ensureSupabase();
  const today = getTodayDateString();
  const until = addDays(today, days);
  const products = [];
  let from = 0;

  while (true) {
    const to = from + batchSize - 1;
    const { data, error } = await client
      .from("products")
      .select(productReportSelect)
      .not("expiration_date", "is", null)
      .lte("expiration_date", until)
      .order("expiration_date", { ascending: true })
      .order("name", { ascending: true })
      .range(from, to);

    if (error) {
      throw dbUnavailable("No se pudo listar reporte de vencimientos.", error);
    }

    const rows = data ?? [];
    products.push(...rows);

    if (rows.length < batchSize) {
      break;
    }

    from += batchSize;
  }

  const items = products
    .map((product) => toExpirationReportItem(product, today))
    .sort(sortExpirationReportItems);

  return paginateItems(items, { page, pageSize });
};

export const listTopExitProductsReport = async ({ from, to, limit }) => {
  const movements = await fetchMovementRows({
    filters: { from, to },
    select: movementProductSelect,
    type: "SALIDA",
  });

  const items = groupMovementsByProduct(movements, (item) =>
    toReportItem({
      label: "Salidas",
      metadata: {
        movementCount: item.movementCount,
      },
      product: item.product,
      productId: item.productId,
      value: item.totalQuantity,
    }),
  );

  return { items: items.slice(0, limit) };
};

export const listMovementsByPeriodReport = async ({ from, to, groupBy }) => {
  const movements = await fetchMovementRows({
    filters: { from, to },
    select: movementPeriodSelect,
  });
  const grouped = new Map();

  movements.forEach((movement) => {
    const period = getPeriod(movement.created_at, groupBy);
    const current = grouped.get(period) ?? {
      entries: 0,
      exits: 0,
      period,
    };
    const quantity = Number(movement.quantity ?? 0);

    if (movement.type === "ENTRADA") {
      current.entries += quantity;
    }

    if (movement.type === "SALIDA") {
      current.exits += quantity;
    }

    grouped.set(period, current);
  });

  return {
    items: [...grouped.values()].sort((first, second) =>
      first.period.localeCompare(second.period),
    ),
  };
};

export const listTopMovedProducts = async ({ from, to, limit }) => {
  const movements = await fetchMovementRows({
    filters: { from, to },
    select: movementProductSelect,
  });

  const items = groupMovementsByProduct(movements, (item) =>
    toReportItem({
      label: "Movimientos",
      metadata: {
        totalQuantity: item.totalQuantity,
      },
      product: item.product,
      productId: item.productId,
      value: item.movementCount,
    }),
  );

  return items.slice(0, limit);
};

export const getDashboardSummary = async ({ from, to }) => {
  const client = ensureSupabase();
  const today = getTodayDateString();
  const filters = { from, to };
  const metricResults = await Promise.all([
    runDashboardMetric("totalProducts", 0, () => countProducts(client)),
    runDashboardMetric("lowStockProducts", 0, countLowStockProducts),
    runDashboardMetric("expiredProducts", 0, () =>
      countExpiredProducts(client, today),
    ),
    runDashboardMetric("expiringSoonProducts", 0, () =>
      countExpiringSoonProducts(client, today, 30),
    ),
    runDashboardMetric("movementsInPeriod", 0, () =>
      countMovements(client, filters),
    ),
    runDashboardMetric("topMovedProducts", [], () =>
      listTopMovedProducts({ ...filters, limit: 5 }),
    ),
  ]);
  const failedMetrics = metricResults.filter((metric) => metric.failed);

  if (failedMetrics.length === metricResults.length) {
    throw new ApiError(
      503,
      errorCodes.serviceUnavailable,
      "No se pudo generar el dashboard.",
      { metrics: failedMetrics },
    );
  }

  const summary = Object.fromEntries(
    metricResults.map((metric) => [metric.key, metric.value]),
  );

  if (failedMetrics.length > 0) {
    summary.metadata = {
      partial: true,
      warnings: failedMetrics.map(({ code, key, message }) => ({
        code,
        key,
        message,
      })),
    };
  }

  return summary;
};
