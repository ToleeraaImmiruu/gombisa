import { Link } from "react-router-dom";

export function Loading({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-ink/70" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-flame border-t-transparent" />
      {label}
    </div>
  );
}

export function EmptyState({ title, text, to, action }) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-white px-6 py-14 text-center">
      <p className="font-display text-xl font-bold">{title}</p>
      {text && <p className="mx-auto mt-2 max-w-md text-ink/70">{text}</p>}
      {to && <Link to={to} className="btn btn-primary mt-6">{action}</Link>}
    </div>
  );
}

export function ErrorNote({ children }) {
  if (!children) return null;
  return <p role="alert" className="rounded-lg border border-flame/40 bg-flame/5 px-4 py-3 text-flame">{children}</p>;
}
