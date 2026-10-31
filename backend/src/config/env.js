require("dotenv").config();

const required = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "CLIENT_URL"];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error("Missing environment variables:", missing.join(", "));
  process.exit(1);
}

const optional = ["CHAPA_SECRET_KEY", "CHAPA_WEBHOOK_SECRET", "PUBLIC_API_URL"];
optional
  .filter((k) => !process.env[k])
  .forEach((k) => console.warn(`Warning: ${k} is not set. Payments will not work until it is.`));

module.exports = {
  port: process.env.PORT || 4000,
  clientUrl: process.env.CLIENT_URL,
  publicApiUrl: process.env.PUBLIC_API_URL,
  chapaSecret: process.env.CHAPA_SECRET_KEY,
  chapaWebhookSecret: process.env.CHAPA_WEBHOOK_SECRET,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
};
