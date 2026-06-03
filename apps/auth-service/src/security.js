import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const JWT_ALGORITHM = "HS256";
const TOKEN_TTL_SECONDS = 60 * 60 * 8;

export function hashPassword(password, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(password, salt, 64).toString("hex");

  return `${salt}:${hash}`;
}

export function verifyPassword(password, storedHash) {
  const [salt, hash] = String(storedHash).split(":");

  if (!salt || !hash) {
    return false;
  }

  const expected = Buffer.from(hash, "hex");
  const actual = Buffer.from(hashPassword(password, salt).split(":")[1], "hex");

  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function signToken(payload, secret) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const header = {
    alg: JWT_ALGORITHM,
    typ: "JWT",
  };
  const body = {
    ...payload,
    iat: issuedAt,
    exp: issuedAt + TOKEN_TTL_SECONDS,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedBody = base64UrlEncode(JSON.stringify(body));
  const signature = createSignature(`${encodedHeader}.${encodedBody}`, secret);

  return `${encodedHeader}.${encodedBody}.${signature}`;
}

export function verifyToken(token, secret) {
  try {
    const [encodedHeader, encodedBody, signature] = String(token).split(".");

    if (!encodedHeader || !encodedBody || !signature) {
      return null;
    }

    const expectedSignature = createSignature(`${encodedHeader}.${encodedBody}`, secret);
    const received = Buffer.from(signature);
    const expected = Buffer.from(expectedSignature);

    if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
      return null;
    }

    const header = JSON.parse(base64UrlDecode(encodedHeader));
    const payload = JSON.parse(base64UrlDecode(encodedBody));

    if (header.alg !== JWT_ALGORITHM || typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function createSignature(value, secret) {
  return base64UrlEncode(createHmac("sha256", secret).update(value).digest());
}

function base64UrlEncode(value) {
  return Buffer.from(value)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function base64UrlDecode(value) {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");

  return Buffer.from(normalized, "base64").toString("utf8");
}
