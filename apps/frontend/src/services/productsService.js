import { apiRequest } from "./apiClient";
import { API_CONTRACT } from "./apiContract";
import { replacePathParams } from "./apiUtils";

const { categories, products } = API_CONTRACT;

export function listProducts(query) {
  return apiRequest(products.list.path, {
    method: products.list.method,
    query,
  });
}

export function getProductById(id) {
  return apiRequest(replacePathParams(products.detail.path, { id }), {
    method: products.detail.method,
  });
}

export function createProduct(payload) {
  return apiRequest(products.create.path, {
    body: payload,
    method: products.create.method,
  });
}

export function updateProduct(id, payload) {
  return apiRequest(replacePathParams(products.update.path, { id }), {
    body: payload,
    method: products.update.method,
  });
}

export function deleteProduct(id) {
  return apiRequest(replacePathParams(products.delete.path, { id }), {
    method: products.delete.method,
  });
}

export function listCategories() {
  return apiRequest(categories.list.path, {
    method: categories.list.method,
  });
}
