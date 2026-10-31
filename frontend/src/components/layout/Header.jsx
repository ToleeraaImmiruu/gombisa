import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../lib/supabaseClient";
import { selectCartCount } from "../../features/cart/cartSlice";
import { setLang } from "../../features/language/languageSlice";
import { useT } from "../../lib/i18n";

const link = ({ isActive }) =>
  `whitespace-nowrap py-1 border-b-2 ${isActive ? "border-flame text-ink" : "border-transparent text-ink/70 hover:text-ink"}`;

export default function Header() {
  const t = useT();
  const dispatch = useDispatch();
  const count = useSelector(selectCartCount);
  const user = useSelector((s) => s.auth.user);
  const lang = useSelector((s) => s.language.lang);

  return (
    <header className="sticky top-0 z-20 bg-paper/95 backdrop-blur">
      <div className="weave" aria-hidden="true" />
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
        <Link to="/" className="font-display text-3xl font-extrabold tracking-tight text-forest">Gombisa</Link>

        <nav className="order-3 flex w-full gap-6 overflow-x-auto text-sm font-medium md:order-none md:w-auto" aria-label="Main">
          <NavLink to="/shop" className={link}>{t("nav_shop")}</NavLink>
          <NavLink to="/events" className={link}>{t("nav_events")}</NavLink>
          <NavLink to="/games" className={link}>{t("nav_games")}</NavLink>
          <NavLink to="/about" className={link}>{t("nav_about")}</NavLink>
        </nav>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex overflow-hidden rounded-md border border-line" role="group" aria-label="Language">
            {[["en", "EN"], ["om", "OM"]].map(([code, label]) => (
              <button key={code} onClick={() => dispatch(setLang(code))} aria-pressed={lang === code}
                className={`px-2.5 py-1 font-semibold ${lang === code ? "bg-ink text-white" : "hover:bg-mist"}`}>
                {label}
              </button>
            ))}
          </div>

          {user ? (
            <>
              <Link to="/orders" className="hidden hover:underline sm:inline">{t("nav_orders")}</Link>
              <button onClick={() => supabase.auth.signOut()} className="hover:underline">{t("nav_logout")}</button>
            </>
          ) : (
            <Link to="/login" className="hover:underline">{t("nav_login")}</Link>
          )}

          <Link to="/cart" className="relative rounded-md bg-forest px-3 py-1.5 font-semibold text-white hover:bg-forest-deep">
            {t("nav_cart")}
            {count > 0 && (
              <span className="ml-2 rounded-full bg-white px-1.5 py-0.5 text-xs font-bold text-forest">{count}</span>
            )}
          </Link>
        </div>
      </div>
      <div className="border-b border-line" />
    </header>
  );
}
