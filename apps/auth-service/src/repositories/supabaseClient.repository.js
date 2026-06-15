import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";

const supabaseKey = env.supabaseSecretKey || env.supabaseServiceRoleKey;

export const supabase =
  env.supabaseUrl && supabaseKey
    ? createClient(env.supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : null;
