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

  // Destroy
  await session.destroy();

  // Response
  res.json({});

  // Log
  log("session.delete", { id: session.id }, req.client.id, session.userId);
};
