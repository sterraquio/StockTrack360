import {
  requireBodyObject,
  requireNonEmptyString,
  validationError,
} from "../utils/validation.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeEmail = (value) => {
  const email = requireNonEmptyString(value, "email").toLowerCase();

  if (!emailPattern.test(email)) {
    throw validationError("Ingresa un correo valido.", { field: "email" });
  }

  return email;
};

export const validateLoginPayload = (payload) => {
  const body = requireBodyObject(payload);
  const email = normalizeEmail(body.email);

  if (typeof body.password !== "string" || body.password.trim().length === 0) {
    throw validationError("Completa los campos obligatorios.", {
      field: "password",
    });
  }

  return {
    email,
    password: body.password,
  };
};
