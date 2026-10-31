import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-20 bg-ink text-white/80">
      <div className="weave weave-thick" aria-hidden="true" />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl font-extrabold text-white">Gombisa</p>
          <p className="mt-3 max-w-sm">Oromo clothing, food, traditional games and cultural events, shared by the people who make them.</p>
        </div>
        <div>
          <p className="font-semibold text-white">Explore</p>
          <ul className="mt-3 space-y-2">
            <li><Link className="hover:text-white" to="/shop?section=clothes">Clothes</Link></li>
            <li><Link className="hover:text-white" to="/shop?section=food">Food</Link></li>
            <li><Link className="hover:text-white" to="/games">Traditional games</Link></li>
            <li><Link className="hover:text-white" to="/events">Events</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Gombisa</p>
          <ul className="mt-3 space-y-2">
            <li><Link className="hover:text-white" to="/about">About us</Link></li>
            <li><Link className="hover:text-white" to="/orders">My orders</Link></li>
            <li><Link className="hover:text-white" to="/cart">Cart</Link></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-sm text-white/50">
        © {new Date().getFullYear()} Gombisa. Pay with Telebirr or card through Chapa.
      </p>
    </footer>
  );
}
