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

  // Hash password
  let password;
  try {
    password = await argon2.hash(req.body.password);
  } catch (err) {
    return res.status(500).json({ err: "internalError" });
  }

  // Update
  await user.update({ password });

  // Response
  res.json({});

  // Log
  log("user.password.update", null, req.client.id, user.id);
};
