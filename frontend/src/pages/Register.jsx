import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { ErrorNote } from "../components/ui/States";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ full_name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.full_name } },
    });
    setBusy(false);
    if (error) return setError(error.message);
    if (data.session) navigate(location.state?.from || "/", { replace: true });
    else setNotice("Account created. Check your email to confirm it, then log in.");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="font-display text-4xl font-extrabold">Create your account</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block text-sm font-medium">Full name
          <input className="field mt-1" required value={form.full_name} onChange={set("full_name")} autoComplete="name" /></label>
        <label className="block text-sm font-medium">Email
          <input className="field mt-1" type="email" required value={form.email} onChange={set("email")} autoComplete="email" /></label>
        <label className="block text-sm font-medium">Password (at least 8 characters)
          <input className="field mt-1" type="password" required minLength={8} value={form.password} onChange={set("password")} autoComplete="new-password" /></label>
        <ErrorNote>{error}</ErrorNote>
        {notice && <p role="status" className="rounded-lg border border-ink/30 bg-mist px-4 py-3 text-ink">{notice}</p>}
        <button className="btn btn-primary w-full" disabled={busy}>{busy ? "Creating account..." : "Create account"}</button>
      </form>
      <p className="mt-6 text-sm">Already have an account? <Link to="/login" state={location.state} className="font-semibold text-flame hover:underline">Log in</Link></p>
    </div>
  );
}
