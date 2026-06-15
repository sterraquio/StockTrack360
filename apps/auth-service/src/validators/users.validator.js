import { roles, userStatuses } from "../constants/auth.constants.js";
import {
  parsePositiveInteger,
  readOptionalQueryString,
  requireBodyObject,
  requireNonEmptyString,
  validateUuid,
  validationError,
} from "../utils/validation.js";

const allowedRoles = new Set(Object.values(roles));
const allowedStatuses = new Set(Object.values(userStatuses));
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeEmail = (value) => {
  const email = requireNonEmptyString(value, "email").toLowerCase();

  if (!emailPattern.test(email)) {
    throw validationError("Ingresa un correo valido.", { field: "email" });
  }

  return email;
};

const normalizeRole = (value) => {
  const role = requireNonEmptyString(value, "role").toUpperCase();

  if (!allowedRoles.has(role)) {
    throw validationError("Rol invalido.", {
      field: "role",
      allowed: [...allowedRoles],
    });
  }

  return role;
};

const normalizeStatus = (value) => {
  const status = requireNonEmptyString(value, "status").toUpperCase();

  if (!allowedStatuses.has(status)) {
    throw validationError("Estado invalido.", {
      field: "status",
      allowed: [...allowedStatuses],
    });
  }

  return status;
};

export const validateUserId = (id) => validateUuid(id, "id");

export const validateListUsersQuery = (query) => {
  const search = readOptionalQueryString(query, "search");
  const role = readOptionalQueryString(query, "role");
  const status = readOptionalQueryString(query, "status");

  return {
    search,
    role: role ? normalizeRole(role) : null,
    status: status ? normalizeStatus(status) : null,
    page: parsePositiveInteger(query.page, "page", { defaultValue: 1 }),
    pageSize: parsePositiveInteger(query.pageSize, "pageSize", {
      defaultValue: 10,
      maxValue: 100,
    }),
  };
};

export const validateCreateUserPayload = (payload) => {
  const body = requireBodyObject(payload);

  if (typeof body.password !== "string" || body.password.trim().length === 0) {
    throw validationError("Completa los campos obligatorios.", {
      field: "password",
    });
  }

  return {
    name: requireNonEmptyString(body.name, "name"),
    email: normalizeEmail(body.email),
    password: body.password,
    role: normalizeRole(body.role),
    status: normalizeStatus(body.status),
  };
};

export const validateUpdateUserPayload = (payload) => {
  const body = requireBodyObject(payload);
  const forbiddenFields = ["email", "password", "passwordHash"].filter((field) =>
    Object.prototype.hasOwnProperty.call(body, field),
  );

  if (forbiddenFields.length > 0) {
    throw validationError("No se permite modificar este campo.", {
      fields: forbiddenFields,
    });
  }

  const updates = {};

  if (Object.prototype.hasOwnProperty.call(body, "name")) {
    updates.name = requireNonEmptyString(body.name, "name");
  }

  if (Object.prototype.hasOwnProperty.call(body, "role")) {
    updates.role = normalizeRole(body.role);
  }

  if (Object.prototype.hasOwnProperty.call(body, "status")) {
    updates.status = normalizeStatus(body.status);
  }

  if (Object.keys(updates).length === 0) {
    throw validationError("Debes enviar al menos un campo editable.", {
      allowedFields: ["name", "role", "status"],
    });
  }

  return updates;
};
