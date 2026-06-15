import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authMessages, userStatuses } from "../constants/auth.constants.js";
import { env } from "../config/env.js";
import { findUserByEmail } from "../repositories/users.repository.js";
import { validateLoginPayload } from "../validators/auth.validator.js";
import { ApiError, errorCodes } from "../utils/apiError.js";

const invalidCredentialsError = () =>
  new ApiError(
    401,
    errorCodes.invalidCredentials,
    authMessages.invalidCredentials,
  );

const createToken = (user) => {
  if (!env.jwtSecret) {
    throw new ApiError(
      503,
      errorCodes.serviceUnavailable,
      "Generacion JWT no configurada.",
    );
  }

  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
    },
    env.jwtSecret,
    {
      subject: user.id,
      expiresIn: env.jwtExpiresIn,
    },
  );
};

const removePasswordHash = ({ passwordHash: _passwordHash, ...user }) => user;

export const login = async (payload) => {
  const credentials = validateLoginPayload(payload);
  const user = await findUserByEmail(credentials.email);

  if (!user) {
    throw invalidCredentialsError();
  }

  const passwordMatches = await bcrypt.compare(
    credentials.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw invalidCredentialsError();
  }

  if (user.status !== userStatuses.active) {
    throw new ApiError(
      403,
      errorCodes.userInactive,
      authMessages.invalidCredentials,
    );
  }

  const publicUser = removePasswordHash(user);

  return {
    token: createToken(publicUser),
    user: publicUser,
  };
};

export const getCurrentUser = (authenticatedUser) => authenticatedUser;

export const logout = () => ({
  message: "Sesion cerrada correctamente.",
});
