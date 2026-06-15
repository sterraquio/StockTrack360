import dotenv from "dotenv";

dotenv.config({ quiet: true });

const toPort = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const env = {
  host: process.env.HOST || "127.0.0.1",
  port: toPort(process.env.PORT, 4002),
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  jwtSecret: process.env.JWT_SECRET || "",
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseSecretKey: process.env.SUPABASE_SECRET_KEY || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
};
