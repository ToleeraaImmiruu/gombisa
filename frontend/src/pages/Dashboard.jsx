import { useState } from "react";
import ContentManager from "../components/dashboard/ContentManager";
import { CONTENT } from "../components/dashboard/contentConfig";
import PageHeader from "../components/ui/PageHeader";

// Every logged-in person can use this page. Their posts wait for an admin to approve them.
export default function Dashboard() {
  const [tab, setTab] = useState("products");

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <PageHeader
        oromo="Nuti waliin"
        title="My posts"
        text="Add your clothes, foods, games and events. An admin reviews each post before it appears on the site. You can edit and delete only your own posts."
      />
      <div className="mb-6 flex flex-wrap gap-2" role="tablist">
        {Object.entries(CONTENT).map(([key, c]) => (
          <button key={key} role="tab" aria-selected={tab === key} onClick={() => setTab(key)}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${tab === key ? "border-flame bg-flame text-white" : "border-line bg-surface"}`}>
            {c.label}
          </button>
        ))}
      </div>
      <ContentManager key={tab} config={CONTENT[tab]} />
    </div>
  );
}
