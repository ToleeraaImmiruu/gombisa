import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { supabase } from "../lib/supabaseClient";
import { setSession } from "../features/auth/authSlice";

// Call once at the top of the app. Keeps Redux in sync with Supabase login and the user's role.
export function useAuthListener() {
  const dispatch = useDispatch();

  useEffect(() => {
    let active = true;

    async function load(session) {
      if (!session) return active && dispatch(setSession({ session: null }));
      const { data } = await supabase
        .from("profiles")
        .select("role, wants_contributor")
        .eq("id", session.user.id)
        .maybeSingle();
      if (active) dispatch(setSession({ session, role: data?.role, wants: data?.wants_contributor }));
    }

    supabase.auth.getSession().then(({ data }) => load(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => load(session), 0); // never call Supabase directly inside this callback
    });
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, [dispatch]);
}
