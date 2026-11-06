import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { formatPrice, formatDate } from "../../lib/format";
import { Loading, EmptyState, ErrorNote } from "../ui/States";

const statuses = ["pending", "paid", "shipped", "delivered", "failed", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () =>
    supabase.from("orders")
      .select("id, status, amount_total, created_at, shipping_name, shipping_phone, shipping_city, shipping_address, notes, order_items(name, quantity)")
      .order("created_at", { ascending: false }).limit(100)
      .then(({ data, error: e }) => { if (e) setError(e.message); else setOrders(data || []); setLoading(false); });
  useEffect(() => { load(); }, []);

  async function setStatus(id, status) {
    const { error: e } = await supabase.from("orders").update({ status }).eq("id", id);
    if (e) setError(e.message); else load();
  }

  if (loading) return <Loading />;
  return (
    <div className="space-y-3">
      <ErrorNote>{error}</ErrorNote>
      {orders.length === 0 ? <EmptyState title="No orders yet" /> : orders.map((o) => (
        <div key={o.id} className="rounded-xl border border-line bg-surface p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink/60">{formatDate(o.created_at)} · {formatPrice(o.amount_total)}</p>
            <select className="field w-auto !py-1.5" value={o.status} onChange={(e) => setStatus(o.id, e.target.value)} aria-label="Order status">
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <p className="mt-2">{o.order_items.map((i) => `${i.name} x ${i.quantity}`).join(", ")}</p>
          <p className="mt-1 text-sm text-ink/70">{o.shipping_name} · {o.shipping_phone} · {o.shipping_city}, {o.shipping_address}</p>
          {o.notes && <p className="mt-1 text-sm text-ink/70">Note: {o.notes}</p>}
        </div>
      ))}
    </div>
  );
}
