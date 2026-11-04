import { Link } from "react-router-dom";
import BackgroundImage from "../ui/BackgroundImage";
import { siteImages } from "../../lib/siteImages";

export default function Footer() {
  return (
    <footer className="relative isolate mt-20 overflow-hidden bg-night text-white/80">
      <BackgroundImage sources={siteImages.footer} position="50% 80%" />
      {/* Footer shade: 0.86 = mostly dark. Lower it to show more of the photo. */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(10,8,6,.84), rgba(10,8,6,.9))" }} aria-hidden="true" />

      <div className="weave weave-thick relative" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl font-extrabold text-white">Gombisa</p>
          <p className="mt-3 max-w-sm">Oromo clothing, food, traditional games and cultural events, shared by the people who make them.</p>
        </div>
        <div>
          <p className="font-semibold text-white">Explore</p>
          <ul className="mt-3 space-y-2">
            <li><Link className="hover:text-white" to="/shop?section=clothes">Clothes (Uffata)</Link></li>
            <li><Link className="hover:text-white" to="/shop?section=food">Food (Nyaata)</Link></li>
            <li><Link className="hover:text-white" to="/games">Games (Taphoota)</Link></li>
            <li><Link className="hover:text-white" to="/events">Events (Ayyaanota)</Link></li>
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
      <p className="relative border-t border-white/10 py-4 text-center text-sm text-white/60">
        © {new Date().getFullYear()} Gombisa. Pay with Telebirr or card through Chapa.
      </p>
    </footer>
  );
}
