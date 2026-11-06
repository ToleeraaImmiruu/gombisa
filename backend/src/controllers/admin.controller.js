const supabase = require("../config/supabase");

const ROLES = ["customer", "contributor", "admin"];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// GET /api/admin/users
exports.listUsers = async (_req, res, next) => {
  try {
    const { data: authData, error: aErr } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
    if (aErr) throw aErr;
    const { data: profiles, error: pErr } = await supabase
      .from("profiles")
      .select("id, full_name, phone, role, wants_contributor, created_at");
    if (pErr) throw pErr;

    const byId = new Map(profiles.map((p) => [p.id, p]));
    const users = authData.users.map((u) => {
      const p = byId.get(u.id) || {};
      return {
        id: u.id,
        email: u.email,
        full_name: p.full_name || u.user_metadata?.full_name || "",
        phone: p.phone || "",
        role: p.role || "customer",
        wants_contributor: !!p.wants_contributor,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
      };
    });
    users.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/users/:id/role   { role }
exports.setRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body || {};
    if (!UUID.test(id) || !ROLES.includes(role)) {
      return res.status(400).json({ error: "Invalid user or role." });
    }
    if (id === req.user.id) {
      return res.status(400).json({ error: "You cannot change your own role." });
    }
    const { error } = await supabase
      .from("profiles")
      .update({ role, wants_contributor: false })
      .eq("id", id);
    if (error) throw error;
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/users/:id?removeContent=true
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!UUID.test(id)) return res.status(400).json({ error: "Invalid user." });
    if (id === req.user.id) return res.status(400).json({ error: "You cannot delete your own account here." });

    if (req.query.removeContent === "true") {
      await supabase.from("events").delete().eq("owner_id", id);
      await supabase.from("game_guides").delete().eq("owner_id", id);
      const { data: products } = await supabase.from("products").select("id").eq("owner_id", id);
      for (const p of products || []) {
        // A product that was already ordered cannot be deleted: hide it instead.
        const { error } = await supabase.from("products").delete().eq("id", p.id);
        if (error) await supabase.from("products").update({ status: "draft" }).eq("id", p.id);
      }
    }

    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) throw error;
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};
