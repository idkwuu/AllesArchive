const db = require("../../db");
const { literal } = require("sequelize");

module.exports = async (req, res) => {
  if (typeof req.body.xp !== "number")
    return res.status(400).json({ err: "badRequest" });

  // Get User
  const user = await db.User.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ err: "missingResource" });

  // Update
  await user.update({
    xp: literal(`xp + ${req.body.xp}`),
  });

  // Response
  res.json({});
};
