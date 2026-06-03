import { randomUUID } from "node:crypto";
import { createServiceError, HTTP_STATUS, paginate, parsePagination } from "./http.js";
import { hashPassword } from "./security.js";

const ROLES = new Set(["ADMINISTRADOR", "USUARIO"]);
const STATUSES = new Set(["ACTIVE", "INACTIVE"]);

const now = new Date().toISOString();

const users = [
  buildSeedUser({
    id: "auth-admin-user",
    name: "Administrador",
    email: "admin@stocktrack360.local",
    password: "password",
    role: "ADMINISTRADOR",
    status: "ACTIVE",
  }),
  buildSeedUser({
    id: "auth-operator-user",
    name: "Usuario Inventario",
    email: "usuario@stocktrack360.local",
    password: "password",
    role: "USUARIO",
    status: "ACTIVE",
  }),
];

export function findUserByEmail(email) {
  return users.find((user) => user.email.toLowerCase() === String(email).toLowerCase());
}

export function findUserById(id) {
  return users.find((user) => user.id === id);
}

export function listUsers(query) {
  validateListFilters(query);

  const search = query.get("search")?.trim().toLowerCase();
  const role = query.get("role");
  const status = query.get("status");
  const filteredUsers = users
    .filter((user) => !search || user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search))
    .filter((user) => !role || user.role === role)
    .filter((user) => !status || user.status === status)
    .map(toPublicUser);

  return paginate(filteredUsers, parsePagination(query));
}

export function createUser(payload) {
  validateUserCreate(payload);

  if (findUserByEmail(payload.email)) {
    throw createServiceError(HTTP_STATUS.conflict, "EMAIL_ALREADY_EXISTS", "El correo ya esta registrado.");
  }

  const createdAt = new Date().toISOString();
  const user = {
    id: randomUUID(),
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    passwordHash: hashPassword(payload.password),
    role: payload.role,
    status: payload.status,
    createdAt,
    updatedAt: createdAt,
  };

  users.push(user);

  return toPublicUser(user);
}

export function updateUser(id, payload) {
  if (Object.hasOwn(payload, "email")) {
    throw createServiceError(HTTP_STATUS.badRequest, "VALIDATION_ERROR", "El correo no se puede modificar.");
  }

  const user = findUserById(id);

  if (!user) {
    throw createServiceError(HTTP_STATUS.notFound, "USER_NOT_FOUND", "Usuario no encontrado.");
  }

  validateUserUpdate(payload);

  user.name = payload.name?.trim() ?? user.name;
  user.role = payload.role ?? user.role;
  user.status = payload.status ?? user.status;
  user.updatedAt = new Date().toISOString();

  return toPublicUser(user);
}

export function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function buildSeedUser(user) {
  return {
    ...user,
    email: user.email.toLowerCase(),
    passwordHash: hashPassword(user.password),
    password: undefined,
    createdAt: now,
    updatedAt: now,
  };
}

function validateListFilters(query) {
  const role = query.get("role");
  const status = query.get("status");

  if (role && !ROLES.has(role)) {
    throw createServiceError(HTTP_STATUS.badRequest, "VALIDATION_ERROR", "El rol no es valido.");
  }

  if (status && !STATUSES.has(status)) {
    throw createServiceError(HTTP_STATUS.badRequest, "VALIDATION_ERROR", "El estado no es valido.");
  }
}

function validateUserCreate(payload) {
  const errors = {};

  if (!payload.name?.trim()) errors.name = "El nombre es obligatorio.";
  if (!payload.email?.trim()) errors.email = "El correo es obligatorio.";
  if (!payload.password) errors.password = "La contrasena es obligatoria.";
  if (!payload.role) errors.role = "El rol es obligatorio.";
  if (!payload.status) errors.status = "El estado es obligatorio.";
  validateRoleAndStatus(payload, errors);

  if (Object.keys(errors).length > 0) {
    throw createServiceError(HTTP_STATUS.badRequest, "VALIDATION_ERROR", "Datos de usuario invalidos.", errors);
  }
}

function validateUserUpdate(payload) {
  const errors = {};

  if (Object.hasOwn(payload, "name") && !payload.name?.trim()) {
    errors.name = "El nombre es obligatorio.";
  }

  validateRoleAndStatus(payload, errors);

  if (Object.keys(errors).length > 0) {
    throw createServiceError(HTTP_STATUS.badRequest, "VALIDATION_ERROR", "Datos de usuario invalidos.", errors);
  }
}

function validateRoleAndStatus(payload, errors) {
  if (Object.hasOwn(payload, "role") && !ROLES.has(payload.role)) {
    errors.role = "El rol no es valido.";
  }

  if (Object.hasOwn(payload, "status") && !STATUSES.has(payload.status)) {
    errors.status = "El estado no es valido.";
  }
}
