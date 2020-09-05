const jwt = require("jsonwebtoken");
const db = require("../../db");

module.exports = async (req, res) => {
  if (typeof req.body.token !== "string")
    return res.status(400).json({ err: "badRequest" });

  // Decode token
  let token;
  try {
    token = await jwt.verify(req.body.token, process.env.SESSION_JWT);
  } catch (err) {
    return res.status(404).json({ err: "session.token" });
  }

  // Get Session
  const session = await db.Session.findOne({
    where: {
      id: token.session,
    },
  });
  if (!session) return res.status(404).json({ err: "session.token" });

  // Response
  res.json({
    id: session.id,
    user: session.userId,
  });
};
