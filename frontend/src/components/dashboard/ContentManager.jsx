import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { supabase } from "../../lib/supabaseClient";
import { formatPrice, formatDate } from "../../lib/format";
import { slugify } from "./contentConfig";
import { Loading, EmptyState, ErrorNote } from "../ui/States";

const badge = {
  draft: "bg-ink/10 text-ink",
  pending: "bg-flame/10 text-accent",
  published: "bg-ink text-paper",
  rejected: "bg-flame text-white",
};
const statusText = { draft: "Draft", pending: "Waiting for review", published: "Published", rejected: "Needs changes" };

const sectionLabel = { clothes: "Clothes (Uffata)", food: "Food (Nyaata)", games: "Games (Taphoota)" };
const viewPath = { products: "/product/", events: "/events/", game_guides: "/games/" };

const pad = (n) => String(n).padStart(2, "0");
const toLocalInput = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

function initialValues(config, row) {
  const v = {};
  for (const f of config.fields) {
    const raw = row?.[f.key];
    v[f.key] = f.type === "price" ? (raw != null ? String(raw / 100) : "")
      : f.type === "datetime" ? toLocalInput(raw)
      : raw ?? "";
  }
  return v;
}

function toPayload(config, values) {
  const p = {};
  for (const f of config.fields) {
    const raw = values[f.key];
    if (f.type === "price") p[f.key] = raw === "" ? null : Math.round(Number(raw) * 100);
    else if (f.type === "number") p[f.key] = raw === "" ? null : Number(raw);
    else if (f.type === "datetime") p[f.key] = raw ? new Date(raw).toISOString() : null;
    else p[f.key] = typeof raw === "string" ? raw.trim() || null : raw;
  }
  return p;
}

/* ---------------- The form ---------------- */
function Editor({ config, row, categories, user, admin, onDone, onCancel }) {
  const [values, setValues] = useState(() => initialValues(config, row));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k, v) => setValues((s) => ({ ...s, [k]: v }));

  async function upload(file) {
    setError("");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return setError("Please choose a JPG, PNG or WebP photo.");
    if (file.size > 5 * 1024 * 1024) return setError("The photo must be smaller than 5 MB.");
    const ext = file.name.split(".").pop().toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = `${user.id}/${Date.now()}.${ext}`;          // each person has their own folder
    const { error: upErr } = await supabase.storage.from("media").upload(path, file, { cacheControl: "31536000" });
    if (upErr) return setError(upErr.message);
    set("image_url", supabase.storage.from("media").getPublicUrl(path).data.publicUrl);
  }

  async function save(mode) { // "draft" | "pending" | "published"
    setError("");
    for (const f of config.fields) {
      if (f.required && (values[f.key] === "" || values[f.key] == null)) return setError(`Please fill in: ${f.label}`);
    }
    setBusy(true);
    try {
      const payload = toPayload(config, values);
      if (row) {
        const { error: e } = await supabase.from(config.table).update({ ...payload, status: mode }).eq("id", row.id);
        if (e) throw e;
      } else {
        const slug = `${slugify(values[config.titleKey])}-${Math.random().toString(36).slice(2, 6)}`;
        const { error: e } = await supabase.from(config.table).insert({ ...payload, slug, status: mode });
        if (e) throw e;
      }
      onDone();
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 md:p-6">
      <h3 className="font-display text-xl font-bold">{row ? `Edit ${config.single}` : `Add ${config.single}`}</h3>
      {row?.status === "published" && !admin && (
        <p className="mt-2 rounded-lg bg-mist p-3 text-sm">This is published. If you save changes, it goes back to review before it shows again.</p>
      )}
      {row?.status === "rejected" && row.rejection_note && (
        <p className="mt-2 rounded-lg border border-flame/40 p-3 text-sm text-accent">Reviewer's note: {row.rejection_note}</p>
      )}

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {config.fields.map((f) => (
          <label key={f.key} className={`block text-sm font-medium ${["textarea", "image"].includes(f.type) ? "md:col-span-2" : ""}`}>
            {f.label}{f.required && " *"}
            {f.type === "textarea" ? (
              <textarea className="field mt-1" rows={3} value={values[f.key]} onChange={(e) => set(f.key, e.target.value)} />
            ) : f.type === "category" ? (
              <select className="field mt-1" value={values[f.key]} onChange={(e) => set(f.key, e.target.value)}>
                <option value="">Choose...</option>
                {Object.keys(sectionLabel).map((sec) => {
                  const list = categories.filter((c) => c.section === sec);
                  return list.length ? (
                    <optgroup key={sec} label={sectionLabel[sec]}>
                      {list.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </optgroup>
                  ) : null;
                })}
              </select>
            ) : f.type === "image" ? (
              <div className="mt-1 flex items-center gap-4">
                {values.image_url && <img src={values.image_url} alt="" className="h-20 w-20 rounded-lg object-cover" />}
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => e.target.files[0] && upload(e.target.files[0])} />
              </div>
            ) : (
              <input
                className="field mt-1"
                type={f.type === "price" || f.type === "number" ? "number" : f.type === "datetime" ? "datetime-local" : "text"}
                step={f.type === "price" ? "0.01" : undefined}
                min={f.type === "price" || f.type === "number" ? "0" : undefined}
                value={values[f.key]}
                onChange={(e) => set(f.key, e.target.value)}
              />
            )}
          </label>
        ))}
      </div>

      <div className="mt-4"><ErrorNote>{error}</ErrorNote></div>
      <div className="mt-5 flex flex-wrap gap-3">
        {admin ? (
          <>
            <button disabled={busy} onClick={() => save("published")} className="btn btn-primary">Save and publish</button>
            <button disabled={busy} onClick={() => save("draft")} className="btn btn-ghost">Save as draft</button>
          </>
        ) : (
          <>
            <button disabled={busy} onClick={() => save("pending")} className="btn btn-primary">Submit for review</button>
            <button disabled={busy} onClick={() => save("draft")} className="btn btn-ghost">Save draft</button>
          </>
        )}
        <button disabled={busy} onClick={onCancel} className="btn">Cancel</button>
      </div>
    </div>
  );
}

/* ---------------- The list ---------------- */
// admin=false: a person sees and manages only their own items.
// admin=true:  an administrator sees everything, can approve, reject, edit and delete.
export default function ContentManager({ config, admin = false }) {
  const user = useSelector((s) => s.auth.user);
  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [owners, setOwners] = useState({});
  const [filter, setFilter] = useState("all");
  const [pending, setPending] = useState(0);
  const [editing, setEditing] = useState(null); // null | "new" | row
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    let q = supabase.from(config.table).select("*").order("created_at", { ascending: false });
    if (!admin) q = q.eq("owner_id", user.id);
    if (filter !== "all") q = q.eq("status", filter);
    const { data, error: e } = await q;
    if (e) setError(e.message); else { setRows(data || []); setError(""); }
    setLoading(false);
  }, [config.table, admin, user.id, filter]);

  useEffect(() => { load(); }, [load]);

  // Admins: how many items are waiting for review
  useEffect(() => {
    if (!admin) return;
    supabase.from(config.table).select("id", { count: "exact", head: true }).eq("status", "pending")
      .then(({ count }) => setPending(count || 0));
  }, [admin, config.table, rows]);

  useEffect(() => {
    if (config.table === "products") {
      supabase.from("categories").select("id, name, section").order("sort_order").then(({ data }) => setCategories(data || []));
    }
    if (admin) {
      supabase.from("profiles").select("id, full_name").then(({ data }) =>
        setOwners(Object.fromEntries((data || []).map((p) => [p.id, p.full_name || "Unnamed"]))));
    }
  }, [config.table, admin]);

  async function setStatus(row, status, note = null) {
    const { error: e } = await supabase.from(config.table).update({ status, rejection_note: note }).eq("id", row.id);
    if (e) setError(e.message); else load();
  }

  function reject(row) {
    const note = window.prompt("Tell the person what to change (they will see this):");
    if (note !== null) setStatus(row, "rejected", note.trim() || "Please review and resubmit.");
  }

  async function remove(row) {
    if (!window.confirm(`Delete "${row[config.titleKey]}"? This cannot be undone.`)) return;
    const { error: e } = await supabase.from(config.table).delete().eq("id", row.id);
    if (e) {
      setError(e.code === "23503"
        ? "This item has already been ordered, so it cannot be deleted. Save it as a draft to hide it instead."
        : e.message);
    } else load();
  }

  if (editing) {
    return (
      <Editor config={config} row={editing === "new" ? null : editing} categories={categories} user={user} admin={admin}
        onDone={() => { setEditing(null); load(); }} onCancel={() => setEditing(null)} />
    );
  }

  const filters = ["all", "draft", "pending", "published", "rejected"];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <select className="field w-auto" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by status">
          {filters.map((f) => <option key={f} value={f}>{f === "all" ? "All statuses" : statusText[f]}</option>)}
        </select>
        <button onClick={() => setEditing("new")} className="btn btn-primary">Add {config.single}</button>
      </div>

      {admin && pending > 0 && filter !== "pending" && (
        <button onClick={() => setFilter("pending")} className="mt-4 w-full rounded-lg border border-flame/40 bg-flame/5 px-4 py-3 text-left font-semibold text-accent">
          {pending} waiting for review. Click to show them.
        </button>
      )}

      <div className="mt-5 space-y-3">
        <ErrorNote>{error}</ErrorNote>
        {loading ? <Loading />
          : rows.length === 0 ? <EmptyState title={filter === "pending" && admin ? "Nothing is waiting for review" : `No ${config.label.toLowerCase()} here yet`} text={admin ? undefined : "Click Add to share your first one."} />
          : rows.map((row) => (
            <div key={row.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-line bg-surface p-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-mist">
                {row.image_url && <img src={row.image_url} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{row[config.titleKey]}</p>
                <p className="text-sm text-ink/60">
                  {config.table === "products" && `${formatPrice(row.price_cents)} · ${row.stock} available`}
                  {config.table === "events" && formatDate(row.starts_at)}
                  {config.table === "game_guides" && (row.summary || "").slice(0, 80)}
                  {admin && ` · by ${owners[row.owner_id] || "the team"}`}
                </p>
                {row.status === "rejected" && row.rejection_note && <p className="mt-1 text-sm text-accent">Note: {row.rejection_note}</p>}
              </div>
              <span className={`rounded-full px-3 py-0.5 text-sm font-semibold ${badge[row.status]}`}>{statusText[row.status]}</span>
              <div className="flex flex-wrap gap-2 text-sm">
                {row.status === "published" && <Link to={`${viewPath[config.table]}${row.slug}`} className="btn btn-ghost !px-3 !py-1.5">View</Link>}
                {admin && row.status !== "published" && <button onClick={() => setStatus(row, "published")} className="btn btn-primary !px-3 !py-1.5">Approve</button>}
                {admin && row.status === "pending" && <button onClick={() => reject(row)} className="btn btn-ghost !px-3 !py-1.5">Reject</button>}
                {!admin && row.status === "draft" && <button onClick={() => setStatus(row, "pending")} className="btn btn-ghost !px-3 !py-1.5">Submit</button>}
                <button onClick={() => setEditing(row)} className="btn btn-ghost !px-3 !py-1.5">Edit</button>
                <button onClick={() => remove(row)} className="btn !px-3 !py-1.5 text-accent hover:underline">Delete</button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
