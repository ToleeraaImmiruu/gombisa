import BackgroundImage from "../components/ui/BackgroundImage";
import { siteImages } from "../lib/siteImages";

export default function About() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-night text-white">
        <BackgroundImage sources={siteImages.about} position="50% 60%" hint="frontend/public/images/about.jpg" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(10,8,6,.85), rgba(10,8,6,.45))" }} aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-4 pb-20 pt-24">
          <h1 className="font-display text-5xl font-extrabold sm:text-6xl">About Gombisa</h1>
        </div>
        <div className="weave absolute inset-x-0 bottom-0" aria-hidden="true" />
      </section>

      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="space-y-5 text-lg leading-relaxed">
          <p>Gombisa brings Oromo clothing, food, traditional games and cultural events into one place, so they are easy to find, learn about and share.</p>
          <p>Each product page tells the story behind the item and credits the person who made it. Games come with their rules and history. Events are listed so the community can gather.</p>
          <p>The information on this site comes from community members, makers and elders. If you see something that should be corrected, or you would like to list your work or your event, please tell us.</p>
        </div>
        <p className="mt-10 text-ink/60">Replace this text with your own story, your contact details and the names of the people you work with.</p>
      </div>
    </>
  );
}
