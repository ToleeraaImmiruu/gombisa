// eslint-disable-next-line no-unused-vars
module.exports = function errorHandler(err, _req, res, _next) {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on our side. Please try again." });
};
