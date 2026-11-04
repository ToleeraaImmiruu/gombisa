import BackgroundImage from "./BackgroundImage";

// Page title with the Afaan Oromoo name above it.
// With an "image", it becomes a photo banner; without, a simple title with a woven band.
export default function PageHeader({ oromo, title, text, image, position }) {
  const kicker = oromo && oromo !== title ? oromo : null;

  if (image) {
    return (
      <header className="relative isolate mb-8 overflow-hidden rounded-2xl bg-night text-white">
        <BackgroundImage sources={image} position={position} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(10,8,6,.85), rgba(10,8,6,.45))" }} aria-hidden="true" />
        <div className="relative px-6 py-12 md:px-10 md:py-16">
          {kicker && <p className="font-display text-lg font-bold text-white/90">{kicker}</p>}
          <h1 className="font-display text-4xl font-extrabold md:text-5xl">{title}</h1>
          {text && <p className="mt-2 max-w-prose text-white/85">{text}</p>}
        </div>
        <div className="weave absolute inset-x-0 bottom-0" aria-hidden="true" />
      </header>
    );
  }

  return (
    <header className="mb-8">
      {kicker && <p className="font-display text-lg font-bold text-accent">{kicker}</p>}
      <h1 className="font-display text-4xl font-extrabold">{title}</h1>
      {text && <p className="mt-2 max-w-prose text-ink/70">{text}</p>}
      <div className="weave mt-5 max-w-xs" aria-hidden="true" />
    </header>
  );
}
