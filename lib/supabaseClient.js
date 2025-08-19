import { createClient } from "@supabase/supabase-js";

// Ambil dari .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Cek biar nggak error kalau variabel lingkungan belum diisi
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL atau Anon Key belum diatur di .env.local");
}

// Buat client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
