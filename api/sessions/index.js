const db = require("../../db");
const log = require("../../util/log");

module.exports = async (req, res) => {
  // Get Session
  const session = await db.Session.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!session) return res.status(404).json({ err: "missingResource" });

  // Response
  res.json({
    id: session.id,
    user: session.userId,
    address: session.address,
    createdAt: session.createdAt,
  });

  // Log
  log("session.get", { id: session.id }, req.client.id, session.userId);
};
