import { EmptyState } from "../components/ui/States";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <EmptyState title="We could not find that page" text="The link may be old or mistyped." to="/" action="Go to the home page" />
    </div>
  );
}
