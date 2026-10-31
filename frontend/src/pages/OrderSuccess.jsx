import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { supabase } from "../lib/supabaseClient";
import { clearCart } from "../features/cart/cartSlice";
import { formatPrice } from "../lib/format";

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get("order");
  const dispatch = useDispatch();
  const [order, setOrder] = useState(null);
  const [gaveUp, setGaveUp] = useState(false);

  // The payment is only real once our server has confirmed it with Chapa,
  // so we check the order status a few times instead of trusting the redirect.
  useEffect(() => {
    if (!orderId) return;
    let tries = 0;
    let stop = false;

    async function check() {
      const { data } = await supabase.from("orders")
        .select("id, status, amount_total, order_items(name, quantity, price_cents)")
        .eq("id", orderId).maybeSingle();
      if (stop) return;
      setOrder(data);
      tries += 1;
      if (data?.status === "paid") dispatch(clearCart());
      if (data?.status === "pending" && tries < 15) setTimeout(check, 2000);
      else if (data?.status === "pending") setGaveUp(true);
    }
    check();
    return () => { stop = true; };
  }, [orderId, dispatch]);

  const status = order?.status;

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      {!order || (status === "pending" && !gaveUp) ? (
        <>
          <h1 className="font-display text-3xl font-extrabold">Confirming your payment</h1>
          <p className="mt-3 text-ink/70">This usually takes a few seconds. Please keep this page open.</p>
        </>
      ) : status === "paid" ? (
        <>
          <h1 className="font-display text-4xl font-extrabold text-forest">Thank you, your order is paid</h1>
          <p className="mt-3 text-ink/70">Order total {formatPrice(order.amount_total)}. We will contact you about delivery.</p>
          <ul className="mx-auto mt-6 max-w-sm divide-y divide-line rounded-xl border border-line bg-white text-left">
            {order.order_items.map((i, n) => (
              <li key={n} className="flex justify-between px-4 py-2"><span>{i.name} x {i.quantity}</span><span>{formatPrice(i.price_cents * i.quantity)}</span></li>
            ))}
          </ul>
        </>
      ) : status === "pending" ? (
        <>
          <h1 className="font-display text-3xl font-extrabold">We have not received confirmation yet</h1>
          <p className="mt-3 text-ink/70">If you completed the payment, your order will update shortly. Check My orders in a few minutes.</p>
        </>
      ) : (
        <>
          <h1 className="font-display text-3xl font-extrabold text-flame">The payment did not go through</h1>
          <p className="mt-3 text-ink/70">You have not been charged for this order. Your cart is still saved, so you can try again.</p>
          <Link to="/cart" className="btn btn-primary mt-6">Back to cart</Link>
        </>
      )}
      <p className="mt-8"><Link to="/orders" className="font-semibold text-forest hover:underline">View my orders</Link></p>
    </div>
  );
}
