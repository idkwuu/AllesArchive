const db = require("../../../db");
const argon2 = require("argon2");

module.exports = async (req, res) => {
  if (typeof req.body.password !== "string")
    return res.status(400).json({ err: "badRequest" });

  // Get User
  const user = await db.User.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ err: "missingResource" });

  // Evaluate Password
  if (!user.password) return res.json({ matches: false });
  argon2
    .verify(user.password, req.body.password)
    .then((matches) => res.json({ matches }))
    .catch(() => res.json({ matches: false }));
};
