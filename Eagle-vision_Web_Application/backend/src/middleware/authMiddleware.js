const requireAdmin = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validKey = process.env.ADMIN_API_KEY || "SuperSecretAdminKey123";

  if (!apiKey || apiKey !== validKey) {
    return res.status(401).json({ message: "Unauthorized access: Invalid or missing API key." });
  }
  next();
};

module.exports = { requireAdmin };
