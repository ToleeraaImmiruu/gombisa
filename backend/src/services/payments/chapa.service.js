const crypto = require("crypto");
const env = require("../../config/env");

const BASE = "https://api.chapa.co/v1";

const authHeaders = () => ({
  Authorization: `Bearer ${env.chapaSecret}`,
  "Content-Type": "application/json",
});

// Start a payment. Returns the Chapa hosted checkout URL.
// Customers can pick Telebirr, cards, etc. on Chapa's page.
async function initializePayment({ order, user, shipping }) {
  if (!env.chapaSecret || !env.publicApiUrl) {
    throw new Error("Payments are not configured (CHAPA_SECRET_KEY / PUBLIC_API_URL).");
  }
  const [firstName, ...rest] = (shipping.name || "Customer").split(" ");

  const res = await fetch(`${BASE}/transaction/initialize`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      amount: (order.amount_total / 100).toFixed(2), // santim -> birr
      currency: "ETB",
      email: user.email,
      first_name: firstName || "Customer",
      last_name: rest.join(" ") || "-",
      phone_number: shipping.phone,
      tx_ref: order.id,
      callback_url: `${env.publicApiUrl}/webhook/chapa/callback`,
      return_url: `${env.clientUrl}/order-success?order=${order.id}`,
      customization: { title: "Gombisa" },
    }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.status !== "success" || !json.data?.checkout_url) {
    console.error("Chapa initialize failed:", json);
    throw new Error(json.message || "Could not start the payment.");
  }
  return json.data.checkout_url;
}

// Ask Chapa directly whether a payment really succeeded.
async function verifyPayment(txRef) {
  const res = await fetch(`${BASE}/transaction/verify/${encodeURIComponent(txRef)}`, {
    headers: authHeaders(),
  });
  return res.json().catch(() => ({}));
}

// Check that a webhook really came from Chapa.
function verifyWebhookSignature(rawBody, headers) {
  const secret = env.chapaWebhookSecret;
  if (!secret) return false;

  const hmac = (data) => crypto.createHmac("sha256", secret).update(data).digest("hex");
  const safeEqual = (a, b) =>
    typeof a === "string" &&
    typeof b === "string" &&
    a.length === b.length &&
    crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));

  const payloadSig = headers["x-chapa-signature"]; // HMAC of the payload
  const constantSig = headers["chapa-signature"]; // HMAC of the secret itself

  return safeEqual(payloadSig, hmac(rawBody)) || safeEqual(constantSig, hmac(secret));
}

module.exports = { initializePayment, verifyPayment, verifyWebhookSignature };
