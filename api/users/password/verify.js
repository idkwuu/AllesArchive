const db = require("../../../db");
const argon2 = require("argon2");
const log = require("../../../util/log");

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
  let matches;
  if (!user.password) matches = false;
  else {
    try {
      matches = await argon2.verify(user.password, req.body.password);
    } catch (err) {
      matches = false;
    }
  }

  // Response
  res.json({ matches });
};
