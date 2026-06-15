import {
  getCurrentUser,
  login,
  logout,
} from "../services/auth.service.js";

export const loginController = async (req, res) => {
  const response = await login(req.body);
  return res.status(200).json(response);
};

export const meController = async (req, res) => {
  const response = getCurrentUser(req.authenticatedUser);
  return res.status(200).json(response);
};

export const logoutController = async (_req, res) => {
  const response = logout();
  return res.status(200).json(response);
};
