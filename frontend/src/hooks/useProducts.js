import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const COLUMNS = "id, name, name_om, slug, price_cents, stock, image_url, is_featured";

export function useProducts({ section = "", search = "", sort = "newest", featured = false, limit = 0 } = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const join = section ? "categories!inner(section, name, name_om)" : "categories(section, name, name_om)";
    let query = supabase.from("products").select(`${COLUMNS}, ${join}`).eq("status", "published");

    if (section) query = query.eq("categories.section", section);
    if (search) query = query.ilike("name", `%${search}%`);
    if (featured) query = query.eq("is_featured", true);
    if (sort === "price_asc") query = query.order("price_cents", { ascending: true });
    else if (sort === "price_desc") query = query.order("price_cents", { ascending: false });
    else query = query.order("created_at", { ascending: false });
    if (limit) query = query.limit(limit);

    query.then(({ data, error }) => {
      if (cancelled) return;
      if (error) setError(error.message);
      else { setProducts(data || []); setError(""); }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [section, search, sort, featured, limit]);

  return { products, loading, error };
}
