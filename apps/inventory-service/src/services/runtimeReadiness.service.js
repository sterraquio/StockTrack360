import { env } from "../config/env.js";
import { supabase } from "../repositories/supabaseClient.repository.js";

export const getRuntimeReadiness = () => ({
  jwtConfigured: Boolean(env.jwtSecret),
  supabaseConfigured: Boolean(supabase),
});
