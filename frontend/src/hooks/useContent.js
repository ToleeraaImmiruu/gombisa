import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function useEvents({ upcomingOnly = true, limit = 0 } = {}) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let query = supabase.from("events").select("*").eq("status", "published").order("starts_at", { ascending: true });
    if (upcomingOnly) query = query.gte("starts_at", new Date().toISOString());
    if (limit) query = query.limit(limit);
    query.then(({ data }) => { setEvents(data || []); setLoading(false); });
  }, [upcomingOnly, limit]);

  return { events, loading };
}

export function useGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("game_guides").select("*").eq("status", "published").order("created_at", { ascending: false })
      .then(({ data }) => { setGames(data || []); setLoading(false); });
  }, []);

  return { games, loading };
}

// Loads one row by slug from a table (events or game_guides)
export function useBySlug(table, slug) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from(table).select("*").eq("slug", slug).maybeSingle()
      .then(({ data }) => { setItem(data); setLoading(false); });
  }, [table, slug]);

  return { item, loading };
}
