const supabase = require("../config/supabase");
const chapa = require("../services/payments/chapa.service");

const MAX_QTY = 20;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const clean = (v, max) => String(v ?? "").trim().slice(0, max);

exports.createCheckout = async (req, res, next) => {
  try {
    const { items, shipping } = req.body || {};

    if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
      return res.status(400).json({ error: "Your cart is empty." });
    }

    const ship = {
      name: clean(shipping?.name, 100),
      phone: clean(shipping?.phone, 30),
      city: clean(shipping?.city, 100),
      address: clean(shipping?.address, 300),
      notes: clean(shipping?.notes, 500),
    };
    if (!ship.name || !ship.phone || !ship.city || !ship.address) {
      return res.status(400).json({ error: "Please fill in your name, phone, city and address." });
    }

    // Merge duplicates and validate. Prices from the client are never used.
    const qtyById = new Map();
    for (const it of items) {
      const qty = Number(it.quantity);
      if (!UUID.test(it.productId || "") || !Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
        return res.status(400).json({ error: "One of the items in your cart is invalid." });
      }
      qtyById.set(it.productId, (qtyById.get(it.productId) || 0) + qty);
    }

    const { data: products, error: pErr } = await supabase
      .from("products")
      .select("id, name, price_cents, stock")
      .in("id", [...qtyById.keys()])
      .eq("is_active", true);
    if (pErr) throw pErr;

    const orderItems = [];
    for (const [id, qty] of qtyById) {
      const p = products.find((x) => x.id === id);
      if (!p) return res.status(400).json({ error: "A product in your cart is no longer available." });
      if (p.stock < qty) {
        return res.status(400).json({ error: `${p.name} only has ${p.stock} left in stock.` });
      }
      orderItems.push({ product_id: p.id, name: p.name, price_cents: p.price_cents, quantity: qty });
    }

    const amountTotal = orderItems.reduce((s, i) => s + i.price_cents * i.quantity, 0);

    const { data: order, error: oErr } = await supabase
      .from("orders")
      .insert({
        user_id: req.user.id,
        amount_total: amountTotal,
        currency: "ETB",
        payment_provider: "chapa",
        shipping_name: ship.name,
        shipping_phone: ship.phone,
        shipping_city: ship.city,
        shipping_address: ship.address,
        notes: ship.notes || null,
      })
      .select()
      .single();
    if (oErr) throw oErr;

    const { error: iErr } = await supabase
      .from("order_items")
      .insert(orderItems.map((i) => ({ ...i, order_id: order.id })));
    if (iErr) {
      await supabase.from("orders").delete().eq("id", order.id);
      throw iErr;
    }

    let checkoutUrl;
    try {
      checkoutUrl = await chapa.initializePayment({ order, user: req.user, shipping: ship });
    } catch (err) {
      await supabase.from("orders").update({ status: "failed" }).eq("id", order.id);
      return res.status(502).json({ error: "We could not start the payment. Please try again." });
    }

    await supabase.from("orders").update({ tx_ref: order.id }).eq("id", order.id);
    res.json({ url: checkoutUrl, orderId: order.id });
  } catch (err) {
    next(err);
  }
};
