import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { api } from "../../lib/api";
import { formatDate } from "../../lib/format";
import { Loading, ErrorNote } from "../ui/States";

const roleLabel = { customer: "Member", admin: "Admin" };

export default function AdminUsers() {
  const me = useSelector((s) => s.auth.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const load = useCallback(() => {
    api("/api/admin/users")
      .then((d) => { setUsers(d.users); setError(""); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  async function changeRole(u, role) {
    if (!window.confirm(`Change ${u.email} to ${roleLabel[role]}?`)) return;
    try { await api(`/api/admin/users/${u.id}/role`, { method: "PATCH", body: { role } }); load(); }
    catch (e) { setError(e.message); }
  }

  async function remove(u) {
    if (!window.confirm(`Delete ${u.email}? Their account will be removed. This cannot be undone.`)) return;
    const removeContent = window.confirm("Also delete everything they added (products, games, events)?\n\nOK = delete their content too\nCancel = keep their content on the site");
    try { await api(`/api/admin/users/${u.id}?removeContent=${removeContent}`, { method: "DELETE" }); load(); }
    catch (e) { setError(e.message); }
  }

  const shown = users.filter((u) => `${u.email} ${u.full_name}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <input className="field max-w-xs" placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="mt-4"><ErrorNote>{error}</ErrorNote></div>
      {loading ? <Loading /> : (
        <div className="mt-2 overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-line bg-mist">
              <tr><th className="p-3">Person</th><th className="p-3">Joined</th><th className="p-3">Role</th><th className="p-3" /></tr>
            </thead>
            <tbody>
              {shown.map((u) => (
                <tr key={u.id} className="border-b border-line last:border-0">
                  <td className="p-3">
                    <p className="font-medium">{u.full_name || "No name"}</p>
                    <p className="text-ink/60">{u.email}</p>
                  </td>
                  <td className="p-3 text-ink/70">{formatDate(u.created_at)}</td>
                  <td className="p-3">
                    <select className="field w-auto !py-1.5" value={u.role === "admin" ? "admin" : "customer"} disabled={u.id === me.id} onChange={(e) => changeRole(u, e.target.value)} aria-label={`Role of ${u.email}`}>
                      {Object.entries(roleLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </td>
                  <td className="p-3 text-right">
                    {u.id !== me.id && <button onClick={() => remove(u)} className="text-accent hover:underline">Delete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
