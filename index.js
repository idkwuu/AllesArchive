require("dotenv").config();

const db = require("./db");
const { Op } = require("sequelize");

// Express
const express = require("express");
const app = express();
app.use((_err, _req, res, _next) =>
  res.status(500).json({ err: "internalError" })
);
db.sync().then(() => {
  require("./status");
  app.listen(8080, () => console.log("Express is listening..."));
});

// Account API
app.get("/spotify/:id", async (req, res, next) => {
  const user = await getAccount("id", req.params.id);
  if (user) res.json(user);
  else res.status(404).json({ err: "missingResource" });
});

app.get("/alles/:id", async (req, res) => {
  const user = await getAccount("alles", req.params.id);
  if (user) res.json(user);
  else res.status(404).json({ err: "missingResource" });
});

// Get User
const getAccount = async (key, value) => {
  const account = await db.Account.findOne({
    where: {
      [key]: value,
    },
  });
  if (!account) return;

  // Get Status
  const status = await db.Status.findOne({
    where: {
      accountId: account.id,
      createdAt: {
        [Op.gte]: new Date().getTime() - 20000,
      },
    },
    order: [["createdAt", "desc"]],
  });

  // Get Item and Artists
  let item, artists;
  if (status) {
    item = await db.Item.findOne({
      where: {
        id: status.itemId,
      },
    });
    if (item) artists = await item.getArtists();
  }

  // Response
  return {
    alles: account.alles,
    spotify: account.id,
    connected: !account.failed,
    checkedAt: account.checkedAt,
    createdAt: account.createdAt,
    item: item
      ? {
          id: item.id,
          name: item.name,
          playing: status.playing,
          progress: status.progress,
          duration: item.duration,
          explicit: item.explicit,
          artists: artists.map((a) => ({
            id: a.id,
            name: a.name,
          })),
        }
      : null,
  };
};

// 404
app.use((_req, res) => res.status(404).json({ err: "notFound" }));
