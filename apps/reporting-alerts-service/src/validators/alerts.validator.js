import { parsePositiveInteger, validationError } from "../utils/validation.js";

const allowedExpiringDays = new Set([7, 30]);

export const validatePaginationQuery = (query) => ({
  page: parsePositiveInteger(query.page, "page", { defaultValue: 1 }),
  pageSize: parsePositiveInteger(query.pageSize, "pageSize", {
    defaultValue: 10,
    maxValue: 100,
  }),
});

export const validateExpiringSoonQuery = (query) => {
  const days = parsePositiveInteger(query.days, "days", { defaultValue: 30 });

  if (!allowedExpiringDays.has(days)) {
    throw validationError("Parametro days invalido.", {
      field: "days",
      allowedValues: [...allowedExpiringDays],
    });
  }

  return {
    ...validatePaginationQuery(query),
    days,
  };
};
