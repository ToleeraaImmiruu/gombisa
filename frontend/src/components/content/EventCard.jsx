import { Link } from "react-router-dom";
import { formatDay, formatMonth } from "../../lib/format";
import { useLocalized } from "../../lib/i18n";

export default function EventCard({ event }) {
  const L = useLocalized();
  return (
    <Link to={`/events/${event.slug}`} className="flex gap-4 rounded-xl border border-line bg-white p-4 hover:border-forest">
      <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-lg bg-forest text-white">
        <span className="font-display text-3xl font-extrabold leading-none">{formatDay(event.starts_at)}</span>
        <span className="text-sm">{formatMonth(event.starts_at)}</span>
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-lg font-bold leading-snug">{L(event, "title")}</h3>
        <p className="text-sm text-ink/70">{[event.location, event.city].filter(Boolean).join(", ")}</p>
        {event.description && <p className="mt-1 line-clamp-2 text-sm text-ink/80">{L(event, "description")}</p>}
      </div>
    </Link>
  );
}
