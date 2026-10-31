import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../features/cart/cartSlice";
import { formatPrice } from "../../lib/format";
import { useLocalized } from "../../lib/i18n";

export function ProductImage({ product, name, className = "" }) {
  return product.image_url ? (
    <img src={product.image_url} alt={name} loading="lazy" className={`h-full w-full object-cover ${className}`} />
  ) : (
    <div className="weave-soft flex h-full w-full items-center justify-center" aria-hidden="true">
      <span className="font-display text-6xl font-extrabold text-forest/60">{name.charAt(0)}</span>
    </div>
  );
}

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const L = useLocalized();
  const [added, setAdded] = useState(false);
  const name = L(product, "name");
  const soldOut = product.stock < 1;

  function add() {
    dispatch(addToCart({
      id: product.id, name, slug: product.slug, price_cents: product.price_cents,
      image_url: product.image_url, stock: product.stock,
    }));
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-line bg-white">
      <Link to={`/product/${product.slug}`} className="block aspect-[4/5] overflow-hidden bg-mist">
        <ProductImage product={product} name={name} className="transition-transform duration-300 group-hover:scale-[1.03]" />
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <Link to={`/product/${product.slug}`} className="font-medium leading-snug hover:text-forest">{name}</Link>
        <p className="font-display text-lg font-bold">{formatPrice(product.price_cents)}</p>
        <button onClick={add} disabled={soldOut} className="btn btn-ghost mt-3 w-full" aria-live="polite">
          {soldOut ? "Sold out" : added ? "Added to cart" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}
