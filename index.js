require("dotenv").config();
const db = require("./db");
const uuid = require("uuid").v4;
const { Op } = require("sequelize");

// Express
const express = require("express");
const app = express();
app.use(require("body-parser").json());
app.use((_err, _req, res, _next) =>
  res.status(500).json({ err: "internalError" })
);
app.listen(8080, () => db.sync().then(() => console.log("Server is ready")));

// Get Friendships
app.get("/:id", async (req, res) => {
  const friendships = await db.Friendship.findAll({
    where: {
      [Op.or]: [{ user1: req.params.id }, { user2: req.params.id }],
      acceptedAt:
        typeof req.query.requests === "string"
          ? null
          : {
              [Op.ne]: null,
            },
    },
  });

  res.json({
    friends: friendships.map((f) => ({
      user: f.user1 === req.params.id ? f.user2 : f.user1,
      incoming: f.user2 === req.params.id,
      requestedAt: f.requestedAt,
      acceptedAt: f.acceptedAt,
    })),
  });
});
