import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { formatPrice, formatDate } from "../lib/format";
import { Loading, EmptyState } from "../components/ui/States";

const badge = {
  paid: "bg-ink text-paper", pending: "bg-ink/10 text-ink", failed: "bg-flame/10 text-accent",
  cancelled: "bg-flame/10 text-accent", shipped: "bg-ink text-paper", delivered: "bg-ink text-paper",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("orders")
      .select("id, status, amount_total, created_at, order_items(name, quantity)")
      .order("created_at", { ascending: false })
      .then(({ data }) => { setOrders(data || []); setLoading(false); });
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl font-extrabold">My orders</h1>
      <div className="mt-8 space-y-4">
        {loading ? <Loading />
          : orders.length === 0 ? <EmptyState title="No orders yet" text="Your orders will show up here after you check out." to="/shop" action="Start shopping" />
          : orders.map((o) => (
            <div key={o.id} className="rounded-xl border border-line bg-surface p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-ink/60">{formatDate(o.created_at)}</p>
                <span className={`rounded-full px-3 py-0.5 text-sm font-semibold capitalize ${badge[o.status] || ""}`}>{o.status}</span>
              </div>
              <p className="mt-2">{o.order_items.map((i) => `${i.name} x ${i.quantity}`).join(", ")}</p>
              <p className="mt-2 font-display text-lg font-bold">{formatPrice(o.amount_total)}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
