import { Link, useParams } from "react-router-dom";
import { useBySlug } from "../hooks/useContent";
import { useLocalized } from "../lib/i18n";
import { Loading, EmptyState } from "../components/ui/States";

export default function GameDetail() {
  const { slug } = useParams();
  const L = useLocalized();
  const { item: game, loading } = useBySlug("game_guides", slug);

  if (loading) return <Loading />;
  if (!game) return <div className="mx-auto max-w-3xl px-4 py-16"><EmptyState title="Game not found" to="/games" action="See all games" /></div>;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/games" className="text-sm text-forest hover:underline">All games</Link>
      <h1 className="mt-2 font-display text-4xl font-extrabold">{L(game, "name")}</h1>
      {game.summary && <p className="mt-3 text-xl text-ink/80">{game.summary}</p>}
      {game.image_url && <img src={game.image_url} alt="" className="mt-6 w-full rounded-2xl" />}
      {game.how_to_play && (<><h2 className="mt-8 font-display text-2xl font-bold">How to play</h2>
        <p className="mt-2 max-w-prose whitespace-pre-line text-lg leading-relaxed">{game.how_to_play}</p></>)}
      {game.history && (<><h2 className="mt-8 font-display text-2xl font-bold">Where it comes from</h2>
        <p className="mt-2 max-w-prose whitespace-pre-line text-lg leading-relaxed">{game.history}</p></>)}
      {game.video_url && <p className="mt-8"><a className="btn btn-ghost" href={game.video_url} target="_blank" rel="noreferrer">Watch a video</a></p>}
    </article>
  );
}
