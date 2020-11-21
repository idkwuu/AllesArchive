require("dotenv").config();
const db = require("./db");
const uuid = require("uuid").v4;
const { Op } = require("sequelize");

const friendLimit = 25;

// Express
const express = require("express");
const app = express();
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
  let friendships;
  if (typeof req.query.requests === "string") {
    // Friend Requests
    friendships = (
      await db.Friendship.findAll({
        where: {
          user1: req.params.id,
          acceptedAt: null,
        },
        order: ["requestedAt"],
      })
    ).concat(
      await db.Friendship.findAll({
        where: {
          user2: req.params.id,
          acceptedAt: null,
        },
        order: ["requestedAt"],
        limit: friendLimit,
      })
    );
  } else {
    // Friendships
    friendships = await db.Friendship.findAll({
      where: {
        [Op.or]: [{ user1: req.params.id }, { user2: req.params.id }],
        acceptedAt: {
          [Op.ne]: null,
        },
      },
      order: ["acceptedAt"],
    });
  }

  // Response
  res.json({
    friends: friendships.map((f) => fData(f, req.params.id)),
  });
});

// Create/Accept Friend Request
app.post("/:id/:friend", async (req, res) => {
  if (req.params.id === req.params.friend)
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
      user1: req.params.friend,
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
        { user1: req.params.id, user2: req.params.friend },
        { user1: req.params.friend, user2: req.params.id },
      ],
    },
  });
  if (alreadyExists) return res.json(fData(alreadyExists, req.params.id));

  // Create friend request
  const request = await db.Friendship.create({
    id: uuid(),
    user1: req.params.id,
    user2: req.params.friend,
    requestedAt: new Date(),
  });

  // Response
  res.json(fData(request, req.params.id));
});

// Remove Friendship
app.delete("/:id/:friend", async (req, res) => {
  // Get friendship
  const friendship = await db.Friendship.findOne({
    where: {
      [Op.or]: [
        {
          user1: req.params.friend,
          user2: req.params.id,
        },
        {
          user1: req.params.friend,
          user2: req.params.friend,
        },
      ],
    },
  });
  if (!friendship) return res.status(404).json({ err: "missingResource" });

  // Destroy
  await friendship.destroy();

  // Response
  res.json({});
});
