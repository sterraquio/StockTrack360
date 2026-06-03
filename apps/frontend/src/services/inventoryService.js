import { getProductById, listCategories, listProducts } from "./productsService";

export function listInventory(query) {
  return listProducts(query);
}

export function listInventoryCategories() {
  return listCategories();
}

export function getInventoryProductById(id) {
  return getProductById(id);
}
