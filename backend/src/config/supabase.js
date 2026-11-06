
const { createClient } = require("@supabase/supabase-js");
const env = require("./env");

// Service-role client: backend only.
// This client bypasses Row Level Security.
module.exports = createClient(
  env.supabaseUrl,
  env.supabaseServiceKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
