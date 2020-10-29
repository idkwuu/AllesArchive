const db = require("../db");

module.exports = async (req, res) => {
  const user = await db.User.findOne({
    where: {
      username: req.params.username,
    },
  });
  if (!user) return res.status(404).json({ err: "missingResource" });

  // Response
  res.json({ id: user.id });
};
