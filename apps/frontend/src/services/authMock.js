import { ApiClientError } from "./apiError";
import { getAuthToken, getAuthUser } from "./authStorage";

const MOCK_TOKEN_PREFIX = "mock-stocktrack360-jwt";

const MOCK_USERS = [
  {
    id: "mock-admin-user",
    name: "Administrador Demo",
    email: "admin@stocktrack360.local",
    password: "password",
    role: "ADMINISTRADOR",
    status: "ACTIVE",
  },
  {
    id: "mock-operator-user",
    name: "Usuario Demo",
    email: "usuario@stocktrack360.local",
    password: "password",
    role: "USUARIO",
    status: "ACTIVE",
  },
];

export function isAuthMockEnabled() {
  return process.env.NEXT_PUBLIC_AUTH_MOCK_ENABLED === "true";
}

export async function mockLogin(credentials) {
  await simulateNetworkDelay();

  const email = credentials?.email?.trim().toLowerCase();
  const password = credentials?.password;
  const user = MOCK_USERS.find(
    (mockUser) => mockUser.email === email && mockUser.password === password,
  );

  if (!user) {
    throw new ApiClientError({
      code: "INVALID_CREDENTIALS",
      message: "Correo o contraseña incorrectos.",
      status: 401,
    });
  }

  return {
    token: buildMockToken(user),
    user: toPublicUser(user),
  };
}

export async function mockGetCurrentUser() {
  await simulateNetworkDelay();

  const token = getAuthToken();

  if (!token?.startsWith(MOCK_TOKEN_PREFIX)) {
    throw new ApiClientError({
      code: "UNAUTHORIZED",
      message: "Tu sesión no es válida. Inicia sesión nuevamente.",
      status: 401,
    });
  }

  const storedUser = getAuthUser();
  const user =
    MOCK_USERS.find((mockUser) => mockUser.id === storedUser?.id) ??
    MOCK_USERS.find((mockUser) => buildMockToken(mockUser) === token);

  if (!user) {
    throw new ApiClientError({
      code: "UNAUTHORIZED",
      message: "Tu sesión no es válida. Inicia sesión nuevamente.",
      status: 401,
    });
  }

  return toPublicUser(user);
}

export async function mockLogout() {
  await simulateNetworkDelay();

  return {
    message: "Sesión cerrada correctamente.",
  };
}

function buildMockToken(user) {
  return `${MOCK_TOKEN_PREFIX}.${user.id}`;
}

function toPublicUser({ password, ...user }) {
  return user;
}

function simulateNetworkDelay() {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 150);
  });
}
