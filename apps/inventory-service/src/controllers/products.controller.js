import {
  createProductService,
  deleteProductService,
  getProductByIdService,
  listProductsService,
  updateProductService,
} from "../services/products.service.js";

export const listProductsController = async (req, res) => {
  const response = await listProductsService(req.query);
  return res.status(200).json(response);
};

export const getProductByIdController = async (req, res) => {
  const response = await getProductByIdService(req.params.id);
  return res.status(200).json(response);
};

export const createProductController = async (req, res) => {
  const response = await createProductService(req.body);
  return res.status(201).json(response);
};

export const updateProductController = async (req, res) => {
  const response = await updateProductService(req.params.id, req.body);
  return res.status(200).json(response);
};

export const deleteProductController = async (req, res) => {
  const response = await deleteProductService(req.params.id);
  return res.status(200).json(response);
};
