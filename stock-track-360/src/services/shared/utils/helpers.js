export function createSuccessResponse(data, message = "Operación exitosa") {
  return {
    success: true,
    message,
    data,
  };
}

export function createErrorResponse(message, code, details = null, statusCode = 400) {
  return {
    statusCode,
    body: {
      success: false,
      message,
      code,
      details,
    },
  };
}

export function validateRequired(value, fieldName) {
  if (!value || (typeof value === "string" && value.trim() === "")) {
    throw new Error(`${fieldName} es requerido`);
  }
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Email inválido");
  }
}

export function validatePositiveInteger(value, fieldName) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${fieldName} debe ser un número entero positivo`);
  }
}

export function validateMinDate(date, fieldName) {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    throw new Error(`${fieldName} debe ser una fecha válida`);
  }
}

export function checkExpirationStatus(expiryDate) {
  if (!expiryDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expDate = new Date(expiryDate);
  expDate.setHours(0, 0, 0, 0);

  const diffTime = expDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "expired";
  if (diffDays <= 7) return "expiring_7_days";
  if (diffDays <= 30) return "expiring_30_days";
  return null;
}

export function getCurrentDate() {
  const now = new Date();
  return now.toISOString().split("T")[0];
}
