import { useGames } from "../hooks/useContent";
import GameCard from "../components/content/GameCard";
import { Loading, EmptyState } from "../components/ui/States";
import { useT } from "../lib/i18n";
import PageHeader from "../components/ui/PageHeader";
import { siteImages } from "../lib/siteImages";

export default function Games() {
  const t = useT();
  const { games, loading } = useGames();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader oromo="Taphoota" title={t("section_games")} text="Learn how traditional Oromo games are played and where they come from." image={siteImages.games} position="60% 50%" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? <Loading /> : games.length === 0
          ? <div className="sm:col-span-2 lg:col-span-3"><EmptyState title="Game guides are coming" text="We are collecting rules and stories from the community." /></div>
          : games.map((g) => <GameCard key={g.id} game={g} />)}
      </div>
    </div>
  );
}
