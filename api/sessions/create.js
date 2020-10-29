const jwt = require("jsonwebtoken");
const uuid = require("uuid").v4;
const db = require("../../db");
const log = require("../../util/log");

module.exports = async (req, res) => {
  if (typeof req.body.user !== "string" || typeof req.body.address !== "string")
    return res.status(400).json({ err: "badRequest" });

  // Get User
  const user = await db.User.findOne({
    where: {
      id: req.body.user,
    },
  });
  if (!user) return res.status(404).json({ err: "missingResource" });

  // Create Session
  const session = await db.Session.create({
    id: uuid(),
    address: req.body.address,
    userId: user.id,
  });

  // Sign Token
  const token = jwt.sign(
    {
      session: session.id,
    },
    process.env.SESSION_JWT
  );

  // Response
  res.json({
    id: session.id,
    token,
  });
};
