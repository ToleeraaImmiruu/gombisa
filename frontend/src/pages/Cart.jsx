import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setQuantity, removeFromCart, clearCart, selectSubtotal } from "../features/cart/cartSlice";
import { api } from "../lib/api";
import { formatPrice } from "../lib/format";
import { ProductImage } from "../components/product/ProductCard";
import { EmptyState, ErrorNote } from "../components/ui/States";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((s) => s.cart.items);
  const subtotal = useSelector(selectSubtotal);
  const user = useSelector((s) => s.auth.user);

  const [form, setForm] = useState({ name: user?.full_name || "", phone: "", city: "", address: "", notes: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState title="Your cart is empty" text="Add a garment, some coffee or a game set to get started." to="/shop" action="Browse the shop" />
      </div>
    );
  }

  async function checkout(e) {
    e.preventDefault();
    setError("");
    if (!user) return navigate("/login", { state: { from: "/cart" } });

    setBusy(true);
    try {
      // Only ids and quantities are sent. The server looks up the real prices.
      const { url } = await api("/api/checkout", {
        method: "POST",
        body: { items: items.map((i) => ({ productId: i.id, quantity: i.quantity })), shipping: form },
      });
      window.location.href = url; // Chapa hosted payment page (Telebirr, card...)
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl font-extrabold">Your cart</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-3">
          {items.map((i) => (
            <div key={i.id} className="flex items-center gap-4 rounded-xl border border-line bg-white p-3">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-mist"><ProductImage product={i} name={i.name} /></div>
              <div className="min-w-0 flex-1">
                <Link to={`/product/${i.slug}`} className="font-medium hover:text-forest">{i.name}</Link>
                <p className="text-sm text-ink/60">{formatPrice(i.price_cents)}</p>
                <button onClick={() => dispatch(removeFromCart(i.id))} className="mt-1 text-sm text-flame hover:underline">Remove</button>
              </div>
              <div className="flex items-center rounded-lg border border-line">
                <button className="h-9 w-9" aria-label={`Decrease ${i.name}`} onClick={() => dispatch(setQuantity({ id: i.id, quantity: i.quantity - 1 }))}>-</button>
                <span className="w-7 text-center">{i.quantity}</span>
                <button className="h-9 w-9" aria-label={`Increase ${i.name}`} onClick={() => dispatch(setQuantity({ id: i.id, quantity: i.quantity + 1 }))}>+</button>
              </div>
              <p className="w-28 text-right font-semibold">{formatPrice(i.price_cents * i.quantity)}</p>
            </div>
          ))}
          <button onClick={() => dispatch(clearCart())} className="text-sm text-ink/60 underline">Clear cart</button>
        </div>

        <form onSubmit={checkout} className="h-fit space-y-4 rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-xl font-bold">Delivery details</h2>
          <label className="block text-sm font-medium">Full name
            <input className="field mt-1" required value={form.name} onChange={set("name")} autoComplete="name" /></label>
          <label className="block text-sm font-medium">Phone
            <input className="field mt-1" required type="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" placeholder="09..." /></label>
          <label className="block text-sm font-medium">City
            <input className="field mt-1" required value={form.city} onChange={set("city")} autoComplete="address-level2" /></label>
          <label className="block text-sm font-medium">Address
            <textarea className="field mt-1" required rows={2} value={form.address} onChange={set("address")} /></label>
          <label className="block text-sm font-medium">Note for the seller (optional)
            <textarea className="field mt-1" rows={2} value={form.notes} onChange={set("notes")} /></label>

          <div className="space-y-1 border-t border-line pt-4 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between text-ink/60"><span>Delivery</span><span>Arranged after payment</span></div>
            <div className="flex justify-between pt-2 font-display text-xl font-bold"><span>Total</span><span>{formatPrice(subtotal)}</span></div>
          </div>

          <ErrorNote>{error}</ErrorNote>
          <button className="btn btn-primary w-full" disabled={busy}>
            {busy ? "Opening payment..." : user ? "Pay with Telebirr or card" : "Log in to pay"}
          </button>
          <p className="text-center text-xs text-ink/60">Secure payment through Chapa. Your card details never touch our site.</p>
        </form>
      </div>
    </div>
  );
}
