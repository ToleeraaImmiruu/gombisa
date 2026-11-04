import { useEffect, useState } from "react";

const dots = "repeating-linear-gradient(90deg, rgba(255,255,255,.06) 0 14px, transparent 14px 28px)," +
  "repeating-linear-gradient(0deg, rgba(196,32,46,.20) 0 14px, transparent 14px 28px), #17140f";

// Full-width hero with a slow photo slideshow behind the content.
// - pauses when the mouse is over it, or when the visitor presses Pause
// - does not move at all for visitors who prefer reduced motion
// - slides whose file is missing are skipped; with none, a woven placeholder shows
export default function HeroCarousel({ slides, overlay = 0.8, interval = 6500, hint, children }) {
  const [failed, setFailed] = useState([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [reduced, setReduced] = useState(false);

  const usable = slides.map((s, i) => ({ ...s, id: i })).filter((s) => !failed.includes(s.id));
  const count = usable.length;
  const current = count ? index % count : 0;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = (e) => setReduced(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (count < 2 || paused || hover || reduced) return;
    const timer = setInterval(() => setIndex((i) => i + 1), interval);
    return () => clearInterval(timer);
  }, [count, paused, hover, reduced, interval]);

  return (
    <section
      className="relative isolate overflow-hidden bg-night text-white"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {count === 0 ? (
          <div className="h-full w-full" style={{ background: dots }} />
        ) : (
          usable.map((s, n) => (
            <img
              key={s.id}
              src={s.src}
              alt=""
              fetchPriority={n === 0 ? "high" : "auto"}
              onError={() => setFailed((f) => [...f, s.id])}
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                objectPosition: s.position,
                opacity: n === current ? 1 : 0,
                transform: n === current && !reduced ? "scale(1.06)" : "scale(1)",
                transition: "opacity 1.4s ease, transform 9s ease-out",
              }}
            />
          ))
        )}
        {count === 0 && import.meta.env.DEV && hint && (
          <p className="absolute bottom-10 left-4 rounded border border-dashed border-white/60 bg-black/50 px-3 py-1.5 text-xs">
            Add your photos here: {hint}
          </p>
        )}
      </div>

      {/* Shade behind the text: darkest on the left, lighter on the right */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            `linear-gradient(90deg, rgba(10,8,6,${overlay}) 0%, rgba(10,8,6,${overlay * 0.65}) 50%, rgba(10,8,6,${overlay * 0.25}) 100%),` +
            `linear-gradient(0deg, rgba(10,8,6,0.55) 0%, transparent 40%)`,
        }}
        aria-hidden="true"
      />

      <div className="relative">{children}</div>
      <div className="weave weave-thick absolute inset-x-0 bottom-0" aria-hidden="true" />

      {count > 1 && (
        <div className="absolute bottom-10 right-4 flex items-center gap-3 rounded-full bg-black/50 px-3 py-2">
          <button
            onClick={() => setPaused((p) => !p)}
            className="flex h-6 w-6 items-center justify-center text-white"
            aria-label={paused ? "Play slideshow" : "Pause slideshow"}
          >
            {paused ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4l14 8-14 8z" /></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>
            )}
          </button>
          <div className="flex gap-2" role="group" aria-label="Choose a photo">
            {usable.map((s, n) => (
              <button
                key={s.id}
                onClick={() => setIndex(n)}
                aria-label={`Show photo ${n + 1}`}
                aria-current={n === current}
                className={`h-2.5 rounded-full transition-all ${n === current ? "w-6 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"}`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
