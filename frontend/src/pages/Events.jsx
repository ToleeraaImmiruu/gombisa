import { useState } from "react";
import { useEvents } from "../hooks/useContent";
import EventCard from "../components/content/EventCard";
import { Loading, EmptyState } from "../components/ui/States";
import { useT } from "../lib/i18n";
import PageHeader from "../components/ui/PageHeader";

export default function Events() {
  const t = useT();
  const [upcoming, setUpcoming] = useState(true);
  const { events, loading } = useEvents({ upcomingOnly: upcoming });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <PageHeader oromo="Ayyaanota" title={t("section_events")} text="Festivals, markets and gatherings from across the Oromo community." />

      <div className="mt-6 flex gap-2">
        {[[true, "Upcoming"], [false, "All events"]].map(([value, label]) => (
          <button key={label} onClick={() => setUpcoming(value)} aria-pressed={upcoming === value}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${upcoming === value ? "border-flame bg-flame text-white" : "border-line bg-surface"}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {loading ? <Loading />
          : events.length === 0 ? <EmptyState title="No events listed yet" text="Check back soon, or ask us to list your community event." />
          : events.map((e) => <EventCard key={e.id} event={e} />)}
      </div>
    </div>
  );
}
