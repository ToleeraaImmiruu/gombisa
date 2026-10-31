import { useGames } from "../hooks/useContent";
import GameCard from "../components/content/GameCard";
import { Loading, EmptyState } from "../components/ui/States";
import { useT } from "../lib/i18n";

export default function Games() {
  const t = useT();
  const { games, loading } = useGames();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl font-extrabold">{t("section_games")}</h1>
      <p className="mt-2 max-w-prose text-ink/70">Learn how traditional Oromo games are played and where they come from.</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? <Loading /> : games.length === 0
          ? <div className="sm:col-span-2 lg:col-span-3"><EmptyState title="Game guides are coming" text="We are collecting rules and stories from the community." /></div>
          : games.map((g) => <GameCard key={g.id} game={g} />)}
      </div>
    </div>
  );
}
