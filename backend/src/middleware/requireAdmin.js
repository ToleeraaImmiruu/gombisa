const supabase = require("../config/supabase");

// Use after requireAuth
module.exports = async function requireAdmin(req, res, next) {
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", req.user.id)
    .single();
  if (data?.role !== "admin") return res.status(403).json({ error: "Admins only." });
  next();
};
