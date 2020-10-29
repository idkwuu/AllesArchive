const db = require("../db");
const log = require("../util/log");

module.exports = async (req, res) => {
  const { name, tag } = req.query;
  if (typeof name !== "string")
    return res.status(400).json({ err: "badRequest" });

  if (typeof tag === "string") {
    // Get specific user
    const user = await db.User.findOne({
      where: {
        name,
        tag,
      },
    });
    if (!user) return res.status(404).json({ err: "missingResource" });

    // Response
    res.json({
      id: user.id,
      name: user.name,
      tag: user.tag,
    });
  } else {
    // Get list of users with name
    const users = await db.User.findAll({
      where: {
        name,
      },
      order: ["tag"],
    });

    // Response
    res.json(
      users.map((user) => ({
        id: user.id,
        name: user.name,
        tag: user.tag,
      }))
    );
  }
};
