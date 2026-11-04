// Page title with the Afaan Oromoo name above it and a woven band underneath.
export default function PageHeader({ oromo, title, text }) {
  return (
    <header className="mb-8">
      {oromo && oromo !== title && <p className="font-display text-lg font-bold text-accent">{oromo}</p>}
      <h1 className="font-display text-4xl font-extrabold">{title}</h1>
      {text && <p className="mt-2 max-w-prose text-ink/70">{text}</p>}
      <div className="weave mt-5 max-w-xs" aria-hidden="true" />
    </header>
  );
}
