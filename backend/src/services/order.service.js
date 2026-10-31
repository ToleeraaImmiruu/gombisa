const supabase = require("../config/supabase");
const chapa = require("./payments/chapa.service");

// Confirms a payment with Chapa and, if genuine, marks the order paid.
// Safe to call many times (callback + webhook can both arrive).
async function confirmChapaPayment(txRef) {
  if (!txRef) return { ok: false, reason: "missing-reference" };

  const result = await chapa.verifyPayment(txRef);
  const tx = result?.data;
  if (result?.status !== "success" || !tx) return { ok: false, reason: "verify-failed" };

  const { data: order } = await supabase
    .from("orders")
    .select("id, amount_total, currency, status")
    .eq("tx_ref", txRef)
    .single();
  if (!order) return { ok: false, reason: "order-not-found" };

  if (tx.status === "success") {
    const paidSantim = Math.round(Number(tx.amount) * 100);
    // If a test payment fails here, log tx and check how Chapa reports amount/fees.
    if (paidSantim !== order.amount_total || tx.currency !== order.currency) {
      console.error("Amount/currency mismatch", { txRef, paidSantim, expected: order.amount_total, currency: tx.currency });
      return { ok: false, reason: "mismatch" };
    }
    const { error } = await supabase.rpc("fulfill_order", { p_order_id: order.id });
    if (error) throw error;
    return { ok: true };
  }

  if (tx.status === "failed") {
    await supabase.from("orders").update({ status: "failed" }).eq("id", order.id).eq("status", "pending");
  }
  return { ok: false, reason: tx.status || "unknown" };
}

module.exports = { confirmChapaPayment };
