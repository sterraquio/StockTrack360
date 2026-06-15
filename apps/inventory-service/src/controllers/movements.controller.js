import {
  createEntryMovementService,
  createExitMovementService,
  listMovementsService,
} from "../services/movements.service.js";

export const listMovementsController = async (req, res) => {
  const response = await listMovementsService(req.query);
  return res.status(200).json(response);
};

export const createEntryMovementController = async (req, res) => {
  const response = await createEntryMovementService(req.body, req.user);
  return res.status(201).json(response);
};

export const createExitMovementController = async (req, res) => {
  const response = await createExitMovementService(req.body, req.user);
  return res.status(201).json(response);
};
