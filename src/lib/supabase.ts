import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const SUPABASE_PROJECT_ID = "aleenmfaugxymtxqlyyz";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsZWVubWZhdWd4eW10eHFseXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3Mjk0OTQsImV4cCI6MjA4NzMwNTQ5NH0.s7fxG-qTlKywV_QBl3STLRxJftR74NmgjGY6dPGlkU0";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ??
  `https://${SUPABASE_PROJECT_ID}.supabase.co`;

const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
