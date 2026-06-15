import {
  createUserService,
  listUsersService,
  updateUserService,
} from "../services/users.service.js";

export const listUsersController = async (req, res) => {
  const response = await listUsersService(req.query);
  return res.status(200).json(response);
};

export const createUserController = async (req, res) => {
  const response = await createUserService(req.body);
  return res.status(201).json(response);
};

export const updateUserController = async (req, res) => {
  const response = await updateUserService(req.params.id, req.body);
  return res.status(200).json(response);
};
