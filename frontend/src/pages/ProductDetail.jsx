import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { supabase } from "../lib/supabaseClient";
import { addToCart } from "../features/cart/cartSlice";
import { formatPrice } from "../lib/format";
import { useLocalized } from "../lib/i18n";
import { ProductImage } from "../components/product/ProductCard";
import { Loading, EmptyState } from "../components/ui/States";

export default function ProductDetail() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const L = useLocalized();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    supabase.from("products").select("*, categories(name, name_om, section)").eq("slug", slug).maybeSingle()
      .then(({ data }) => { setProduct(data); setLoading(false); });
  }, [slug]);

  if (loading) return <Loading />;
  if (!product) return <div className="mx-auto max-w-3xl px-4 py-16"><EmptyState title="Product not found" to="/shop" action="Back to shop" /></div>;

  const name = L(product, "name");
  const soldOut = product.stock < 1;
  const maxQty = Math.min(product.stock, 20);

  function add() {
    dispatch(addToCart({ id: product.id, name, slug: product.slug, price_cents: product.price_cents,
      image_url: product.image_url, stock: product.stock, quantity: qty }));
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-2">
      <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-mist">
        <ProductImage product={product} name={name} />
      </div>

      <div>
        <Link to="/shop" className="text-sm text-accent hover:underline">Back to shop</Link>
        <h1 className="mt-2 font-display text-4xl font-extrabold leading-tight">{name}</h1>
        {product.categories && <p className="mt-1 text-ink/60">{L(product.categories, "name")}</p>}
        <p className="mt-4 font-display text-3xl font-bold">{formatPrice(product.price_cents)}</p>

        {product.description && <p className="mt-5 max-w-prose text-lg leading-relaxed">{L(product, "description")}</p>}

        {product.cultural_note && (
          <div className="mt-6 border-l-4 border-flame bg-mist p-4">
            <p className="font-semibold">The story behind it</p>
            <p className="mt-1 leading-relaxed">{product.cultural_note}</p>
          </div>
        )}

        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          {product.origin_region && <div><dt className="text-ink/60">Region</dt><dd className="font-medium">{product.origin_region}</dd></div>}
          {product.maker_name && <div><dt className="text-ink/60">Made by</dt><dd className="font-medium">{product.maker_name}</dd></div>}
        </dl>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {!soldOut && (
            <div className="flex items-center rounded-lg border border-line bg-surface">
              <button className="h-11 w-11 text-xl" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">-</button>
              <span className="w-8 text-center font-semibold" aria-live="polite">{qty}</span>
              <button className="h-11 w-11 text-xl" onClick={() => setQty((q) => Math.min(maxQty, q + 1))} aria-label="Increase quantity">+</button>
            </div>
          )}
          <button onClick={add} disabled={soldOut} className="btn btn-primary" aria-live="polite">
            {soldOut ? "Sold out" : added ? "Added to cart" : "Add to cart"}
          </button>
          <Link to="/cart" className="btn btn-ghost">View cart</Link>
        </div>
        {!soldOut && product.stock <= 5 && <p className="mt-3 text-sm text-accent">Only {product.stock} left</p>}
      </div>
    </div>
  );
}
