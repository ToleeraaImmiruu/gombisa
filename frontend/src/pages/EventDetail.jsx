import { Link, useParams } from "react-router-dom";
import { useBySlug } from "../hooks/useContent";
import { formatDate } from "../lib/format";
import { useLocalized } from "../lib/i18n";
import { Loading, EmptyState } from "../components/ui/States";

export default function EventDetail() {
  const { slug } = useParams();
  const L = useLocalized();
  const { item: event, loading } = useBySlug("events", slug);

  if (loading) return <Loading />;
  if (!event) return <div className="mx-auto max-w-3xl px-4 py-16"><EmptyState title="Event not found" to="/events" action="See all events" /></div>;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/events" className="text-sm text-forest hover:underline">All events</Link>
      <h1 className="mt-2 font-display text-4xl font-extrabold leading-tight">{L(event, "title")}</h1>
      <p className="mt-3 text-lg font-medium text-forest">{formatDate(event.starts_at)}</p>
      <p className="text-ink/70">{[event.location, event.city].filter(Boolean).join(", ")}</p>
      {event.image_url && <img src={event.image_url} alt="" className="mt-6 w-full rounded-2xl" />}
      <p className="mt-6 max-w-prose whitespace-pre-line text-lg leading-relaxed">{L(event, "description")}</p>
    </article>
  );
}
