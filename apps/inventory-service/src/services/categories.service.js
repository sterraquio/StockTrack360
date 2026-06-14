import {
  createCategory,
  findCategoryByName,
  listCategories,
} from "../repositories/categories.repository.js";
import { validateCreateCategoryPayload } from "../validators/categories.validator.js";
import { ApiError, errorCodes } from "../utils/apiError.js";

export const listCategoriesService = () => listCategories();

export const createCategoryService = async (payload) => {
  const categoryPayload = validateCreateCategoryPayload(payload);
  const existingCategory = await findCategoryByName(categoryPayload.name);

  if (existingCategory) {
    throw new ApiError(
      409,
      errorCodes.categoryAlreadyExists,
      "Ya existe una categoria con ese nombre.",
    );
  }

  return createCategory(categoryPayload);
};
