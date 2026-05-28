import { getProductById, listProducts } from "./productsService";

export function listInventory(query) {
  return listProducts(query);
}

export function getInventoryProductById(id) {
  return getProductById(id);
}
