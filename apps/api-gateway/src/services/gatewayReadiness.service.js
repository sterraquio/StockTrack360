import { env } from "../config/env.js";
import { getServiceTargets } from "../repositories/serviceRegistry.repository.js";

export const getGatewayReadiness = () => ({
  jwtConfigured: Boolean(env.jwtSecret),
  serviceTargets: getServiceTargets(),
});
