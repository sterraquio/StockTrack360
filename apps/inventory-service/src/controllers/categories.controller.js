import {
  createCategoryService,
  listCategoriesService,
} from "../services/categories.service.js";

export const listCategoriesController = async (_req, res) => {
  const response = await listCategoriesService();
  return res.status(200).json(response);
};

export const createCategoryController = async (req, res) => {
  const response = await createCategoryService(req.body);
  return res.status(201).json(response);
};
