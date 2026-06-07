import { validateRequired, validatePositiveInteger } from "@/services/shared/utils/helpers.js";
import { CATEGORIES } from "@/services/shared/constants.js";

export function validateCreateProduct(data) {
  const errors = {};

  // SKU
  if (!data.sku || data.sku.trim() === "") {
    errors.sku = "SKU es requerido";
  } else if (data.sku.length > 50) {
    errors.sku = "SKU no puede exceder 50 caracteres";
  }

  // Nombre
  if (!data.name || data.name.trim() === "") {
    errors.name = "Nombre es requerido";
  } else if (data.name.length > 200) {
    errors.name = "Nombre no puede exceder 200 caracteres";
  }

  // Categoría
  if (!data.categoryId) {
    errors.categoryId = "Categoría es requerida";
  } else if (!CATEGORIES.find((c) => c.id === data.categoryId)) {
    errors.categoryId = "Categoría inválida";
  }

  // Stock actual
  if (data.currentStock !== undefined) {
    if (!Number.isInteger(data.currentStock) || data.currentStock < 0) {
      errors.currentStock = "Stock debe ser un número entero no negativo";
    }
  }

  // Stock mínimo
  if (data.minimumStock !== undefined && data.minimumStock !== null) {
    if (!Number.isInteger(data.minimumStock) || data.minimumStock < 0) {
      errors.minimumStock = "Stock mínimo debe ser un número entero no negativo";
    }
  }

  // Fecha vencimiento
  if (data.expiryDate) {
    const dateObj = new Date(data.expiryDate);
    if (isNaN(dateObj.getTime())) {
      errors.expiryDate = "Fecha de vencimiento inválida";
    } else {
      // Validar que no sea una fecha en el pasado
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dateObj < today) {
        errors.expiryDate = "Fecha de vencimiento no puede ser en el pasado";
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateUpdateProduct(data) {
  const errors = {};

  // Nombre
  if (data.name !== undefined && data.name.trim() === "") {
    errors.name = "Nombre no puede estar vacío";
  } else if (data.name && data.name.length > 200) {
    errors.name = "Nombre no puede exceder 200 caracteres";
  }

  // Categoría
  if (data.categoryId && !CATEGORIES.find((c) => c.id === data.categoryId)) {
    errors.categoryId = "Categoría inválida";
  }

  // Stock mínimo
  if (data.minimumStock !== undefined && data.minimumStock !== null) {
    if (!Number.isInteger(data.minimumStock) || data.minimumStock < 0) {
      errors.minimumStock = "Stock mínimo debe ser un número entero no negativo";
    }
  }

  // Fecha vencimiento
  if (data.expiryDate) {
    const dateObj = new Date(data.expiryDate);
    if (isNaN(dateObj.getTime())) {
      errors.expiryDate = "Fecha de vencimiento inválida";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dateObj < today) {
        errors.expiryDate = "Fecha de vencimiento no puede ser en el pasado";
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateMovement(data) {
  const errors = {};

  if (!data.productId) {
    errors.productId = "ID del producto es requerido";
  }

  if (!data.quantity || !Number.isInteger(data.quantity) || data.quantity <= 0) {
    errors.quantity = "Cantidad debe ser un número entero mayor a 0";
  }

  if (!data.movementType) {
    errors.movementType = "Tipo de movimiento es requerido";
  } else if (!["entry", "exit"].includes(data.movementType)) {
    errors.movementType = "Tipo de movimiento inválido (entry o exit)";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
