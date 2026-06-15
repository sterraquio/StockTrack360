import { parsePositiveInteger, validationError } from "../utils/validation.js";

const allowedExpiringDays = new Set([7, 30]);
const allowedGroupBy = new Set(["day", "week", "month"]);
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

const parseDateParam = (value, fieldName) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (Array.isArray(value)) {
    throw validationError("Parametro de fecha invalido.", {
      field: fieldName,
    });
  }

  if (!datePattern.test(value)) {
    throw validationError("Parametro de fecha invalido.", {
      field: fieldName,
      expectedFormat: "YYYY-MM-DD",
    });
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw validationError("Parametro de fecha invalido.", {
      field: fieldName,
      expectedFormat: "YYYY-MM-DD",
    });
  }

  return value;
};

const validateDateRange = (query) => {
  const from = parseDateParam(query.from, "from");
  const to = parseDateParam(query.to, "to");

  if (from && to && from > to) {
    throw validationError("El rango de fechas no es valido.", {
      from,
      to,
    });
  }

  return { from, to };
};

const validateDays = (query) => {
  const days = parsePositiveInteger(query.days, "days", { defaultValue: 30 });

  if (!allowedExpiringDays.has(days)) {
    throw validationError("Parametro days invalido.", {
      field: "days",
      allowedValues: [...allowedExpiringDays],
    });
  }

  return days;
};

export const validateDashboardQuery = (query) => validateDateRange(query);

export const validateLowStockReportQuery = (query) => ({
  page: parsePositiveInteger(query.page, "page", { defaultValue: 1 }),
  pageSize: parsePositiveInteger(query.pageSize, "pageSize", {
    defaultValue: 10,
    maxValue: 100,
  }),
});

export const validateExpiringProductsReportQuery = (query) => ({
  ...validateLowStockReportQuery(query),
  days: validateDays(query),
});

export const validateTopExitsReportQuery = (query) => ({
  ...validateDateRange(query),
  limit: parsePositiveInteger(query.limit, "limit", {
    defaultValue: 10,
    maxValue: 50,
  }),
});

export const validateMovementsByPeriodReportQuery = (query) => {
  const groupBy = query.groupBy || "day";

  if (Array.isArray(groupBy) || !allowedGroupBy.has(groupBy)) {
    throw validationError("Parametro groupBy invalido.", {
      field: "groupBy",
      allowedValues: [...allowedGroupBy],
    });
  }

  return {
    ...validateDateRange(query),
    groupBy,
  };
};
