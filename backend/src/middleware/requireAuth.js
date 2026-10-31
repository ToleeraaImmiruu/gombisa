const supabase = require("../config/supabase");

module.exports = async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Please log in first." });

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return res.status(401).json({ error: "Your session has expired. Please log in again." });
  }
  req.user = data.user;
  next();
};
