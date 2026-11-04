import { useState } from "react";

// Fills its parent (the parent must be "relative"). Tries each source in order,
// and shows a black/red/white woven placeholder when none exists.
export default function BackgroundImage({ sources, position = "50% 70%", hint }) {
  const [index, setIndex] = useState(0);
  const missing = index >= sources.length;

  return (
    <div className="absolute inset-0 -z-10">
      {missing ? (
        <div
          className="h-full w-full"
          style={{
            background:
              "repeating-linear-gradient(90deg, rgba(255,255,255,.06) 0 14px, transparent 14px 28px)," +
              "repeating-linear-gradient(0deg, rgba(196,32,46,.20) 0 14px, transparent 14px 28px), #17140f",
          }}
          aria-hidden="true"
        />
      ) : (
        <img
          src={sources[index]}
          alt=""
          className="h-full w-full object-cover"
          style={{ objectPosition: position }}
          onError={() => setIndex((i) => i + 1)}
          fetchPriority="high"
        />
      )}
      {missing && import.meta.env.DEV && hint && (
        <p className="absolute bottom-6 right-4 rounded border border-dashed border-white/60 bg-black/50 px-3 py-1.5 text-xs text-white">
          Add your photo here: {hint}
        </p>
      )}
    </div>
  );
}
