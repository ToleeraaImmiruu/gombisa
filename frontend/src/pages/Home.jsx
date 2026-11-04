import { Link } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useEvents } from "../hooks/useContent";
import ProductGrid from "../components/product/ProductGrid";
import EventCard from "../components/content/EventCard";
import BackgroundImage from "../components/ui/BackgroundImage";
import { siteImages } from "../lib/siteImages";

/* ---- Easy settings ----
   OVERLAY: how dark the photo is behind the text (0 = no shade, 1 = black).
   Raise it if the text is hard to read, lower it to show more of the photo. */
const OVERLAY = 0.8;
const PHOTO_FOCUS = "50% 75%"; // which part of the photo stays visible: "left% top%"

// Afaan Oromoo: please have a native speaker confirm these words.
const GREETING = "Baga nagaan dhuftan";

function Tile({ to, oromo, english, text, className }) {
  return (
    <Link to={to} className={`flex min-h-[10.5rem] flex-col justify-end rounded-xl p-5 transition-transform hover:-translate-y-1 ${className}`}>
      <span className="font-display text-3xl font-extrabold leading-none">{oromo}</span>
      <span className="mt-2 text-sm font-semibold opacity-90">{english}</span>
      <span className="text-sm opacity-75">{text}</span>
    </Link>
  );
}

function SectionHead({ title, to, linkText }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 className="font-display text-3xl font-extrabold">{title}</h2>
      {to && <Link to={to} className="font-semibold text-accent hover:underline">{linkText}</Link>}
    </div>
  );
}

const promises = [
  ["A story with every item", "Each product tells you what it is and when it is worn, eaten or played."],
  ["Credit to the maker", "You see who made it and where the style comes from."],
  ["Pay with Telebirr or card", "Secure checkout through Chapa."],
];

export default function Home() {
  const { products, loading: pLoading } = useProducts({ featured: true, limit: 4 });
  const { events } = useEvents({ limit: 3 });

  return (
    <>
      {/* HERO: your photo behind the text */}
      <section className="relative isolate overflow-hidden bg-night text-white">
        <BackgroundImage sources={siteImages.hero} position={PHOTO_FOCUS} hint="frontend/public/images/hero.jpg" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              `linear-gradient(90deg, rgba(10,8,6,${OVERLAY}) 0%, rgba(10,8,6,${OVERLAY * 0.65}) 50%, rgba(10,8,6,${OVERLAY * 0.15}) 100%),` +
              `linear-gradient(0deg, rgba(10,8,6,0.55) 0%, transparent 40%)`,
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-28 pt-20 lg:pb-36 lg:pt-32">
          <p className="font-display text-xl font-bold text-white/90 sm:text-2xl">{GREETING}</p>
          <h1 className="mt-2 font-display text-7xl font-extrabold leading-[0.9] tracking-tight sm:text-8xl lg:text-9xl">
            Gombisa
          </h1>
          <p className="mt-6 max-w-lg text-xl leading-relaxed text-white/90">
            Oromo clothing, food, traditional games and celebrations, in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop" className="btn btn-primary">Shop the collection</Link>
            <Link to="/events" className="btn border-2 border-white text-white hover:bg-white hover:text-night">See upcoming events</Link>
          </div>
        </div>
        <div className="weave weave-thick absolute inset-x-0 bottom-0" aria-hidden="true" />
      </section>

      {/* FOUR DOORS: Oromo names first */}
      <section className="mx-auto max-w-6xl px-4 pt-10">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Tile to="/shop?section=clothes" oromo="Uffata" english="Clothes" text="Dresses, shawls, jewelry" className="bg-flame text-white" />
          <Tile to="/shop?section=food" oromo="Nyaata" english="Food" text="Coffee, spices, ready foods" className="bg-night text-white" />
          <Tile to="/games" oromo="Taphoota" english="Games" text="Learn and play" className="border-2 border-ink bg-surface text-ink" />
          <Tile to="/events" oromo="Ayyaanota" english="Events" text="Festivals and gatherings" className="bg-flame-deep text-white" />
        </div>
      </section>

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

      <section className="mx-auto max-w-6xl px-4 pt-16">
        <div className="grid gap-8 border-t-4 border-ink pt-8 md:grid-cols-3">
          {promises.map(([title, text]) => (
            <div key={title}>
              <h3 className="font-display text-xl font-bold">{title}</h3>
              <p className="mt-2 text-ink/70">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4">
        <div className="rounded-2xl bg-night px-6 py-12 text-white md:px-12">
          <h2 className="font-display text-3xl font-extrabold">Made by the community</h2>
          <p className="mt-3 max-w-2xl text-lg text-white/85">
            Every garment, food and game on Gombisa comes with its story and the name of the person who made it.
          </p>
          <Link to="/about" className="btn mt-6 bg-white text-night hover:bg-white/90">About Gombisa</Link>
        </div>
      </section>
    </>
  );
}
