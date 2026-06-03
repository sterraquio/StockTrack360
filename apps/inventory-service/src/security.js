import { createHmac, timingSafeEqual } from "node:crypto";

const JWT_ALGORITHM = "HS256";

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
