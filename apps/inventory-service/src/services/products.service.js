import { findCategoryById } from "../repositories/categories.repository.js";
import {
  createProduct,
  deleteProductById,
  findProductById,
  findProductBySku,
  listProducts,
  updateProduct,
} from "../repositories/products.repository.js";
import {
  validateCreateProductPayload,
  validateListProductsQuery,
  validateProductId,
  validateUpdateProductPayload,
} from "../validators/products.validator.js";
import { ApiError, errorCodes } from "../utils/apiError.js";

const ensureCategoryExists = async (categoryId) => {
  const category = await findCategoryById(categoryId);

  if (!category) {
    throw new ApiError(
      404,
      errorCodes.categoryNotFound,
      "Categoria no encontrada.",
    );
  }
};

export const listProductsService = (query) => {
  const filters = validateListProductsQuery(query);
  return listProducts(filters);
};

export const getProductByIdService = async (id) => {
  const productId = validateProductId(id);
  const product = await findProductById(productId);

  if (!product) {
    throw new ApiError(
      404,
      errorCodes.productNotFound,
      "Producto no encontrado.",
    );
  }

  return product;
};

export const createProductService = async (payload) => {
  const productPayload = validateCreateProductPayload(payload);
  const existingProduct = await findProductBySku(productPayload.sku);

  if (existingProduct) {
    throw new ApiError(
      409,
      errorCodes.skuAlreadyExists,
      "Ya existe un producto con ese SKU.",
    );
  }

  await ensureCategoryExists(productPayload.categoryId);

  return createProduct(productPayload);
};

export const updateProductService = async (id, payload) => {
  const productId = validateProductId(id);
  const updates = validateUpdateProductPayload(payload);

  if (updates.categoryId) {
    await ensureCategoryExists(updates.categoryId);
  }

  const updatedProduct = await updateProduct(productId, updates);

  if (!updatedProduct) {
    throw new ApiError(
      404,
      errorCodes.productNotFound,
      "Producto no encontrado.",
    );
  }

  return updatedProduct;
};

export const deleteProductService = async (id) => {
  const productId = validateProductId(id);
  const product = await findProductById(productId);

  if (!product) {
    throw new ApiError(
      404,
      errorCodes.productNotFound,
      "Producto no encontrado.",
    );
  }

  if (product.availableStock > 0) {
    throw new ApiError(
      409,
      errorCodes.productHasStock,
      "No se puede eliminar un producto con stock disponible.",
    );
  }

  await deleteProductById(productId);

  return { message: "Producto eliminado correctamente." };
};
