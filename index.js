require("dotenv").config();
const db = require("./db");
const uuid = require("uuid").v4;
const { Op } = require("sequelize");

const friendLimit = 25;

// Express
const express = require("express");
const app = express();
app.use(require("body-parser").json());
app.use((_err, _req, res, _next) =>
  res.status(500).json({ err: "internalError" })
);
app.listen(8080, () => db.sync().then(() => console.log("Server is ready")));

// Auth
app.use((req, res, next) => {
  if (req.headers.authorization === process.env.SECRET) next();
  else res.status(401).json({ err: "badAuthorization" });
});

// Friendship Data
const fData = (f, u) => ({
  user: f.user1 === u ? f.user2 : f.user1,
  incoming: f.user2 === u,
  requestedAt: f.requestedAt,
  acceptedAt: f.acceptedAt || undefined,
});

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
    friends: friendships.map((f) => fData(f, req.params.id)),
  });
});

// Create/Accept Friend Request
app.post("/:id", async (req, res) => {
  if (typeof req.body.user !== "string")
    return res.status(400).json({ err: "badRequest" });
  if (req.params.id === req.body.user)
    return res.status(400).json({ err: "user.friend.self" });

  // Friend Count = Active Friends + Outgoing Requests
  const friendCount = await db.Friendship.count({
    where: {
      [Op.or]: [
        {
          [Op.or]: [{ user1: req.params.id }, { user2: req.params.id }],
          acceptedAt: { [Op.ne]: null },
        },
        {
          user1: req.params.id,
          acceptedAt: null,
        },
      ],
    },
  });
  if (friendCount >= friendLimit)
    return res.status(400).json({ err: "user.friend.tooMany" });

  // Check for incoming request
  const incomingRequest = await db.Friendship.findOne({
    where: {
      user1: req.body.user,
      user2: req.params.id,
      acceptedAt: null,
    },
  });
  if (incomingRequest) {
    await incomingRequest.update({ acceptedAt: new Date() });
    return res.json(fData(incomingRequest, req.params.id));
  }

  // Check if friendship/request already exists
  const alreadyExists = await db.Friendship.findOne({
    where: {
      [Op.or]: [
        { user1: req.params.id, user2: req.body.user },
        { user1: req.body.user, user2: req.params.id },
      ],
    },
  });
  if (alreadyExists) return res.json(fData(alreadyExists, req.params.id));

  // Create friend request
  const request = await db.Friendship.create({
    id: uuid(),
    user1: req.params.id,
    user2: req.body.user,
    requestedAt: new Date(),
  });

  // Response
  res.json(fData(request, req.params.id));
});
