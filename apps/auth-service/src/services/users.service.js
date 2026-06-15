import bcrypt from "bcryptjs";
import {
  createUser,
  findUserByEmail,
  listUsers,
  updateUser,
} from "../repositories/users.repository.js";
import {
  validateCreateUserPayload,
  validateListUsersQuery,
  validateUpdateUserPayload,
  validateUserId,
} from "../validators/users.validator.js";
import { ApiError, errorCodes } from "../utils/apiError.js";

const saltRounds = 10;

export const listUsersService = (query) => {
  const filters = validateListUsersQuery(query);
  return listUsers(filters);
};

export const createUserService = async (payload) => {
  const userPayload = validateCreateUserPayload(payload);
  const existingUser = await findUserByEmail(userPayload.email);

  if (existingUser) {
    throw new ApiError(
      409,
      errorCodes.emailAlreadyExists,
      "Ya existe un usuario con ese correo.",
    );
  }

  const passwordHash = await bcrypt.hash(userPayload.password, saltRounds);

  return createUser({
    name: userPayload.name,
    email: userPayload.email,
    passwordHash,
    role: userPayload.role,
    status: userPayload.status,
  });
};

export const updateUserService = async (id, payload) => {
  const userId = validateUserId(id);
  const updates = validateUpdateUserPayload(payload);
  const updatedUser = await updateUser(userId, updates);

  if (!updatedUser) {
    throw new ApiError(
      404,
      errorCodes.userNotFound,
      "Usuario no encontrado.",
    );
  }

  return updatedUser;
};
