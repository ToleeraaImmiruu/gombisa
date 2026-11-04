import BackgroundImage from "./BackgroundImage";

// A full-width band with a photo behind it.
//  tone="light": the photo is softened with the page colour, and it fades into the page
//                at the top and bottom. Text stays normal. Good behind cards.
//  tone="dark":  the photo is darkened and the text is white.
//  strength: how strongly the photo is covered (0 = photo fully visible, 1 = hidden).
export default function PhotoSection({ sources, position = "50% 60%", tone = "light", strength = 0.78, className = "", children }) {
  const veil =
    tone === "dark"
      ? `rgba(10,8,6,${strength})`
      : `color-mix(in srgb, var(--color-paper) ${Math.round(strength * 100)}%, transparent)`;
  const fade =
    tone === "light"
      ? "linear-gradient(180deg, var(--color-paper) 0%, transparent 16%, transparent 84%, var(--color-paper) 100%),"
      : "";

  return (
    <section className={`relative isolate overflow-hidden ${tone === "dark" ? "bg-night text-white" : ""} ${className}`}>
      <BackgroundImage sources={sources} position={position} />
      <div className="absolute inset-0" style={{ backgroundImage: `${fade} linear-gradient(${veil}, ${veil})` }} aria-hidden="true" />
      <div className="relative">{children}</div>
    </section>
  );
}
