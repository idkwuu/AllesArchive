const db = require("../../db");
const { literal } = require("sequelize");
const getLevel = require("../../util/level");
const config = require("../../config");

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

  // Check level difference
  const levels =
    getLevel(user.xp + req.body.xp).level - getLevel(user.xp).level;

  // Update
  await user.update({
    xp: literal(`xp + ${req.body.xp}`),
    coins:
      levels > 0
        ? literal(`coins + ${levels * config.levelUpCoins}`)
        : undefined,
  });

  // Response
  res.json({});
};
