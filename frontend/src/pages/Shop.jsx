import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import ProductGrid from "../components/product/ProductGrid";
import { Loading, EmptyState, ErrorNote } from "../components/ui/States";
import { useT } from "../lib/i18n";

export default function Shop() {
  const t = useT();
  const [params, setParams] = useSearchParams();
  const section = params.get("section") || "";
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const { products, loading, error } = useProducts({ section, search, sort });

  const tabs = [
    ["", "All"],
    ["clothes", t("section_clothes")],
    ["food", t("section_food")],
    ["games", t("section_games")],
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl font-extrabold">Shop</h1>

      <div className="mt-6 flex flex-wrap items-center gap-2" role="tablist" aria-label="Sections">
        {tabs.map(([value, label]) => (
          <button key={value || "all"} role="tab" aria-selected={section === value}
            onClick={() => (value ? setParams({ section: value }) : setParams({}))}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${section === value ? "border-forest bg-forest text-white" : "border-line bg-white hover:border-forest"}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <input className="field min-w-[220px] flex-1" type="search" placeholder="Search products" aria-label="Search products"
          value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="field w-auto" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
          <option value="newest">Newest</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </select>
      </div>

      <div className="mt-8">
        <ErrorNote>{error}</ErrorNote>
        {loading ? <Loading />
          : products.length === 0 ? (
            <EmptyState title="Nothing matches yet" text="Try a different section or clear your search." />
          ) : <ProductGrid products={products} />}
      </div>
    </div>
  );
}
