import {
  listMovements,
  registerMovement,
} from "../repositories/movements.repository.js";
import {
  validateAuthenticatedUserId,
  validateListMovementsQuery,
  validateMovementPayload,
} from "../validators/movements.validator.js";

const movementTypes = {
  entry: "ENTRADA",
  exit: "SALIDA",
};

export const listMovementsService = (query) => {
  const filters = validateListMovementsQuery(query);
  return listMovements(filters);
};

export const createEntryMovementService = (payload, user) => {
  const movementPayload = validateMovementPayload(payload);
  const userId = validateAuthenticatedUserId(user);

  return registerMovement({
    ...movementPayload,
    userId,
    type: movementTypes.entry,
  });
};

export const createExitMovementService = (payload, user) => {
  const movementPayload = validateMovementPayload(payload);
  const userId = validateAuthenticatedUserId(user);

  return registerMovement({
    ...movementPayload,
    userId,
    type: movementTypes.exit,
  });
};
