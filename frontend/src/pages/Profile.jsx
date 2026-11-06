import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { supabase } from "../lib/supabaseClient";
import PageHeader from "../components/ui/PageHeader";
import { Loading, ErrorNote } from "../components/ui/States";

const roleLabel = { customer: "Member", contributor: "Member", admin: "Admin" };

export default function Profile() {
  const user = useSelector((s) => s.auth.user);
  const [form, setForm] = useState({ full_name: "", phone: "" });
  const [info, setInfo] = useState({ email: "", role: "" });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from("profiles").select("full_name, phone, email, role").eq("id", user.id).maybeSingle()
      .then(({ data }) => {
        if (data) {
          setForm({ full_name: data.full_name || "", phone: data.phone || "" });
          setInfo({ email: data.email || user.email, role: data.role });
        } else {
          setInfo({ email: user.email, role: "customer" });
        }
        setLoading(false);
      });
  }, [user.id, user.email]);

  async function save(e) {
    e.preventDefault();
    setBusy(true); setError(""); setSaved(false);
    const { error: err } = await supabase.from("profiles")
      .update({ full_name: form.full_name.trim() || null, phone: form.phone.trim() || null })
      .eq("id", user.id);
    setBusy(false);
    if (err) setError(err.message); else setSaved(true);
  }

  if (loading) return <Loading />;

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <PageHeader title="My profile" text="Your name and phone number are used to fill in delivery details." />
      <form onSubmit={save} className="space-y-4 rounded-2xl border border-line bg-surface p-6">
        <label className="block text-sm font-medium">Full name
          <input className="field mt-1" value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} autoComplete="name" /></label>
        <label className="block text-sm font-medium">Phone number
          <input className="field mt-1" type="tel" pattern="[+0-9 ()\-]{7,20}" title="Digits only, for example 0911223344"
            value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} autoComplete="tel" placeholder="09..." /></label>
        <div className="text-sm">
          <p className="font-medium">Email</p>
          <p className="mt-1 text-ink/70">{info.email}</p>
        </div>
        <div className="text-sm">
          <p className="font-medium">Role</p>
          <p className="mt-1 text-ink/70">{roleLabel[info.role] || info.role}</p>
        </div>
        <ErrorNote>{error}</ErrorNote>
        {saved && <p role="status" className="rounded-lg border border-ink/30 bg-mist px-4 py-3">Saved.</p>}
        <button className="btn btn-primary" disabled={busy}>{busy ? "Saving..." : "Save"}</button>
      </form>
    </div>
  );
}
