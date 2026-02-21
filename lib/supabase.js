import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Use placeholder during build when env is missing; runtime requires real env
export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  key || "placeholder-anon-key"
);
