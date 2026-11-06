import { useState } from "react";
import ContentManager from "../components/dashboard/ContentManager";
import AdminUsers from "../components/dashboard/AdminUsers";
import AdminOrders from "../components/dashboard/AdminOrders";
import { CONTENT } from "../components/dashboard/contentConfig";
import PageHeader from "../components/ui/PageHeader";

const tabs = [
  ...Object.entries(CONTENT).map(([key, c]) => [key, c.label]),
  ["users", "People"],
  ["orders", "Orders"],
];

export default function Admin() {
  const [tab, setTab] = useState("products");

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <PageHeader title="Admin" text="Review what people add, manage content and people, and follow orders. Items waiting for review are shown first." />
      <div className="mb-6 flex flex-wrap gap-2" role="tablist">
        {tabs.map(([key, label]) => (
          <button key={key} role="tab" aria-selected={tab === key} onClick={() => setTab(key)}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${tab === key ? "border-flame bg-flame text-white" : "border-line bg-surface"}`}>
            {label}
          </button>
        ))}
      </div>
      {CONTENT[tab] ? <ContentManager key={tab} config={CONTENT[tab]} admin />
        : tab === "users" ? <AdminUsers /> : <AdminOrders />}
    </div>
  );
}
