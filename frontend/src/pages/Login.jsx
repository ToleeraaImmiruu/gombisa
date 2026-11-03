import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { ErrorNote } from "../components/ui/States";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setBusy(false); return; }
    navigate(location.state?.from || "/", { replace: true });
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="font-display text-4xl font-extrabold">Log in</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block text-sm font-medium">Email
          <input className="field mt-1" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></label>
        <label className="block text-sm font-medium">Password
          <input className="field mt-1" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></label>
        <ErrorNote>{error}</ErrorNote>
        <button className="btn btn-primary w-full" disabled={busy}>{busy ? "Logging in..." : "Log in"}</button>
      </form>
      <p className="mt-6 text-sm">New to Gombisa? <Link to="/register" state={location.state} className="font-semibold text-flame hover:underline">Create an account</Link></p>
    </div>
  );
}
