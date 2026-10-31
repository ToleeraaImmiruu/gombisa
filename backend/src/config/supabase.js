const { createClient } = require("@supabase/supabase-js");
const env = require("./env");

// Service-role client: bypasses Row Level Security. Backend only.
module.exports = createClient(env.supabaseUrl, env.supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
