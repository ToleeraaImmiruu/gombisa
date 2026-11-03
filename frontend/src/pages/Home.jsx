import { Link } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useEvents } from "../hooks/useContent";
import ProductGrid from "../components/product/ProductGrid";
import EventCard from "../components/content/EventCard";
import { useT } from "../lib/i18n";

function Tile({ to, title, sub, className }) {
  return (
    <Link to={to} className={`flex min-h-[9.5rem] flex-col justify-end rounded-xl p-5 transition-transform hover:-translate-y-0.5 ${className}`}>
      <span className="font-display text-3xl font-extrabold leading-none">{title}</span>
      <span className="mt-1 text-sm opacity-80">{sub}</span>
    </Link>
  );
}

function SectionHead({ title, to, linkText }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 className="font-display text-3xl font-extrabold">{title}</h2>
      {to && <Link to={to} className="font-semibold text-flame hover:underline">{linkText}</Link>}
    </div>
  );
}

export default function Home() {
  const t = useT();
  const { products, loading: pLoading } = useProducts({ featured: true, limit: 4 });
  const { events } = useEvents({ limit: 3 });

  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-[1.15fr_1fr] lg:py-20">
        <div>
          <h1 className="font-display text-7xl font-extrabold leading-[0.9] tracking-tight text-flame sm:text-8xl lg:text-9xl">
            Gombisa
          </h1>
          <p className="mt-6 max-w-lg text-xl leading-relaxed text-ink/80">
            Oromo clothing, food, traditional games and celebrations, in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop" className="btn btn-primary">Shop the collection</Link>
            <Link to="/events" className="btn btn-ghost">See upcoming events</Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Tile to="/shop?section=clothes" title={t("section_clothes")} sub="Dresses, shawls, jewelry" className="bg-flame text-white" />
          <Tile to="/shop?section=food" title={t("section_food")} sub="Coffee, spices, ready foods" className="bg-ink text-white" />
          <Tile to="/games" title={t("section_games")} sub="Learn and play" className="border-2 border-ink bg-white text-ink" />
          <Tile to="/events" title={t("section_events")} sub="Festivals and gatherings" className="bg-flame-deep text-white" />
        </div>
      </section>

      <div className="weave weave-thick" aria-hidden="true" />

      {events.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-16">
          <SectionHead title="Coming up" to="/events" linkText="All events" />
          <div className="grid gap-4 md:grid-cols-3">
            {events.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 pt-16">
        <SectionHead title="Featured" to="/shop" linkText="Browse everything" />
        {pLoading ? <p className="py-10 text-ink/60">Loading products...</p>
          : products.length === 0 ? <p className="text-ink/70">Products will appear here soon.</p>
          : <ProductGrid products={products} />}
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4">
        <div className="rounded-2xl bg-ink px-6 py-12 text-white md:px-12">
          <h2 className="font-display text-3xl font-extrabold">Made by the community</h2>
          <p className="mt-3 max-w-2xl text-lg text-white/85">
            Every garment, food and game on Gombisa comes with its story and the name of the person who made it.
          </p>
          <Link to="/about" className="btn mt-6 bg-white text-ink hover:bg-mist">About Gombisa</Link>
        </div>
      </section>
    </>
  );
}
