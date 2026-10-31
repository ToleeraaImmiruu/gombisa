const chapa = require("../services/payments/chapa.service");
const { confirmChapaPayment } = require("../services/order.service");

// Signed webhook configured in the Chapa dashboard (POST)
exports.chapaWebhook = async (req, res) => {
  if (!chapa.verifyWebhookSignature(req.body, req.headers)) {
    return res.status(401).send("Invalid signature");
  }
  let payload;
  try {
    payload = JSON.parse(req.body.toString("utf8"));
  } catch {
    return res.status(400).end();
  }

  try {
    await confirmChapaPayment(payload.tx_ref || payload.trx_ref);
    res.status(200).end();
  } catch (err) {
    console.error("Webhook failed:", err);
    res.status(500).end(); // lets Chapa retry
  }
};

// callback_url sent with each payment (GET, unsigned).
// We never trust it: confirmChapaPayment re-checks with Chapa's verify API.
exports.chapaCallback = async (req, res) => {
  try {
    await confirmChapaPayment(req.query.trx_ref || req.query.tx_ref);
    res.status(200).send("ok");
  } catch (err) {
    console.error("Callback failed:", err);
    res.status(500).end();
  }
};
