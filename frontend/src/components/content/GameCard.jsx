import { Link } from "react-router-dom";
import { useLocalized } from "../../lib/i18n";

export default function GameCard({ game }) {
  const L = useLocalized();
  const name = L(game, "name");
  return (
    <Link to={`/games/${game.slug}`} className="overflow-hidden rounded-xl border border-line bg-white hover:border-flame">
      <div className="aspect-[16/9] bg-mist">
        {game.image_url ? (
          <img src={game.image_url} alt={name} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="weave-soft flex h-full items-center justify-center" aria-hidden="true">
            <span className="font-display text-5xl font-extrabold text-flame/60">{name.charAt(0)}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg font-bold">{name}</h3>
        {game.summary && <p className="mt-1 line-clamp-2 text-sm text-ink/80">{game.summary}</p>}
      </div>
    </Link>
  );
}
