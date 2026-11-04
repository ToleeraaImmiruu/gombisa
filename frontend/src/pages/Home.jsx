import { Link } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useEvents } from "../hooks/useContent";
import ProductGrid from "../components/product/ProductGrid";
import EventCard from "../components/content/EventCard";
import HeroCarousel from "../components/ui/HeroCarousel";
import BackgroundImage from "../components/ui/BackgroundImage";
import PhotoSection from "../components/ui/PhotoSection";
import Reveal from "../components/ui/Reveal";
import { ErrorNote } from "../components/ui/States";
import { siteImages } from "../lib/siteImages";

/* ---- Easy settings ----
   Each number is how strongly the photo is covered: 0 = photo fully visible, 1 = hidden.
   Lower a number to see more of that photo. Raise it if text becomes hard to read. */
const LOOK = {
  hero: 0.8,       // shade behind the big title
  featured: 0.74,  // band behind the Featured products
  promises: 0.74,  // band behind the three promises
  community: 0.8,  // black block (left side; the right side is lighter)
};

// Afaan Oromoo: please have a native speaker confirm these words.
const GREETING = "Baga nagaan dhuftan";

const shade = (rgb) =>
  `linear-gradient(0deg, rgba(${rgb},.92) 0%, rgba(${rgb},.58) 50%, rgba(${rgb},.22) 100%)`;
const lightShade =
  "linear-gradient(0deg, color-mix(in srgb, var(--color-paper) 94%, transparent) 0%, color-mix(in srgb, var(--color-paper) 60%, transparent) 50%, color-mix(in srgb, var(--color-paper) 26%, transparent) 100%)";

const tiles = [
  { to: "/shop?section=clothes", oromo: "Uffata", english: "Clothes", text: "Dresses, shawls, jewelry",
    photo: siteImages.tiles.clothes, shade: shade("196,32,46"), cls: "text-white" },
  { to: "/shop?section=food", oromo: "Nyaata", english: "Food", text: "Coffee, spices, ready foods",
    photo: siteImages.tiles.food, shade: shade("10,8,6"), cls: "text-white" },
  { to: "/games", oromo: "Taphoota", english: "Games", text: "Learn and play",
    photo: siteImages.tiles.games, shade: lightShade, cls: "border-2 border-ink text-ink" },
  { to: "/events", oromo: "Ayyaanota", english: "Events", text: "Festivals and gatherings",
    photo: siteImages.tiles.events, shade: shade("143,21,32"), cls: "text-white" },
];

function Tile({ to, oromo, english, text, photo, shade, cls }) {
  return (
    <Link to={to} className={`relative isolate flex min-h-[15rem] flex-col justify-end overflow-hidden rounded-xl bg-night p-5 transition-transform hover:-translate-y-1 ${cls}`}>
      <BackgroundImage sources={[photo.src]} position={photo.position} />
      <div className="absolute inset-0" style={{ backgroundImage: shade }} aria-hidden="true" />
      <div className="relative">
        <span className="block font-display text-3xl font-extrabold leading-none">{oromo}</span>
        <span className="mt-2 block text-sm font-semibold opacity-95">{english}</span>
        <span className="block text-sm opacity-85">{text}</span>
      </div>
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
  const { products, loading: pLoading, error } = useProducts({ featured: true, limit: 4 });
  const { events } = useEvents({ limit: 3 });

  return (
    <>
      <HeroCarousel slides={siteImages.hero} overlay={LOOK.hero} hint="frontend/public/images/slide-1.jpg">
        <div className="mx-auto max-w-6xl px-4 pb-28 pt-20 lg:pb-36 lg:pt-32">
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
      </HeroCarousel>

      {/* Four doors, each with its own photo */}
      <section className="mx-auto max-w-6xl px-4 pt-10">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {tiles.map((t) => <Tile key={t.oromo} {...t} />)}
        </div>
      </section>

      {events.length > 0 && (
        <Reveal>
          <section className="mx-auto max-w-6xl px-4 pt-16">
            <SectionHead title="Coming up" to="/events" linkText="All events" />
            <div className="grid gap-4 md:grid-cols-3">
              {events.map((e) => <EventCard key={e.id} event={e} />)}
            </div>
          </section>
        </Reveal>
      )}

      {/* Featured products on a soft photo band */}
      <Reveal>
        <PhotoSection sources={siteImages.featured} position="50% 70%" tone="light" strength={LOOK.featured} className="mt-12 py-16">
          <div className="mx-auto max-w-6xl px-4">
            <SectionHead title="Featured" to="/shop" linkText="Browse everything" />
            {error ? <ErrorNote>Could not load products: {error}</ErrorNote>
              : pLoading ? <p className="py-10 text-ink/60">Loading products...</p>
              : products.length === 0 ? <p className="rounded-xl bg-surface/80 p-6 text-ink/80">Products will appear here soon.</p>
              : <ProductGrid products={products} />}
          </div>
        </PhotoSection>
      </Reveal>

      {/* Dark photo block */}
      <Reveal>
        <section className="mx-auto max-w-6xl px-4 pt-6">
          <div className="relative isolate overflow-hidden rounded-2xl bg-night px-6 py-16 text-white md:px-12 md:py-24">
            <BackgroundImage sources={siteImages.community} position="50% 58%" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, rgba(10,8,6,${LOOK.community}) 0%, rgba(10,8,6,${LOOK.community * 0.55}) 55%, rgba(10,8,6,${LOOK.community * 0.15}) 100%)` }} aria-hidden="true" />
            <div className="relative">
              <h2 className="font-display text-3xl font-extrabold md:text-5xl">Made by the community</h2>
              <p className="mt-3 max-w-xl text-lg text-white/90">
                Every garment, food and game on Gombisa comes with its story and the name of the person who made it.
              </p>
              <Link to="/about" className="btn mt-6 bg-white text-night hover:bg-white/90">About Gombisa</Link>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Three promises on a soft photo band */}
      <Reveal>
        <PhotoSection sources={siteImages.promises} position="50% 62%" tone="light" strength={LOOK.promises} className="mt-10 py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid gap-8 border-t-4 border-ink pt-8 md:grid-cols-3">
              {promises.map(([title, text]) => (
                <div key={title}>
                  <h3 className="font-display text-xl font-bold">{title}</h3>
                  <p className="mt-2 text-ink/80">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </PhotoSection>
      </Reveal>
    </>
  );
}
