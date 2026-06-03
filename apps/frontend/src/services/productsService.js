import { apiRequest } from "./apiClient";
import { API_CONTRACT } from "./apiContract";
import { replacePathParams } from "./apiUtils";
import {
  isDataMockEnabled,
  mockCreateProduct,
  mockDeleteProduct,
  mockGetProductById,
  mockListCategories,
  mockListProducts,
  mockUpdateProduct,
} from "./dataMock";

const { categories, products } = API_CONTRACT;

export function listProducts(query) {
  if (isDataMockEnabled()) {
    return mockListProducts(query);
  }

  return apiRequest(products.list.path, {
    method: products.list.method,
    query,
  });
}

export function getProductById(id) {
  if (isDataMockEnabled()) {
    return mockGetProductById(id);
  }

  return apiRequest(replacePathParams(products.detail.path, { id }), {
    method: products.detail.method,
  });
}

export function createProduct(payload) {
  if (isDataMockEnabled()) {
    return mockCreateProduct(payload);
  }

  return apiRequest(products.create.path, {
    body: payload,
    method: products.create.method,
  });
}

export function updateProduct(id, payload) {
  if (isDataMockEnabled()) {
    return mockUpdateProduct(id, payload);
  }

  return apiRequest(replacePathParams(products.update.path, { id }), {
    body: payload,
    method: products.update.method,
  });
}

export function deleteProduct(id) {
  if (isDataMockEnabled()) {
    return mockDeleteProduct(id);
  }

  return apiRequest(replacePathParams(products.delete.path, { id }), {
    method: products.delete.method,
  });
}

export function listCategories() {
  if (isDataMockEnabled()) {
    return mockListCategories();
  }

  return apiRequest(categories.list.path, {
    method: categories.list.method,
  });
}
