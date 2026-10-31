import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { supabase } from "../lib/supabaseClient";
import { setSession } from "../features/auth/authSlice";

// Call once at the top of the app. Keeps Redux in sync with Supabase login.
export function useAuthListener() {
  const dispatch = useDispatch();
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => dispatch(setSession(data.session)));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => dispatch(setSession(session)));
    return () => sub.subscription.unsubscribe();
  }, [dispatch]);
}
