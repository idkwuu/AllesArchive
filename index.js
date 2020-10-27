require("dotenv").config();
const { QUICKAUTH_ID } = process.env;

const db = require("./db");
const { Op } = require("sequelize");
const quickauth = require("@alleshq/quickauth");

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

// Spotify Code => QuickAuth Redirect
app.get("/cb", (req, res) => {
  if (typeof req.query.code === "string")
    res.redirect(
      quickauth.url(
        process.env.QUICKAUTH_ID,
        `${process.env.ORIGIN}/auth`,
        req.query.code
      )
    );
  else
    res.send(
      "Something didn't go quite right there! <a href='/'>Try again</a>."
    );
});

// QuickAuth callback
app.get("/auth", (req, res) => {
  if (typeof req.query.token !== "string" || typeof req.query.data !== "string")
    return res.status(400).json({ err: "badRequest" });
  quickauth(QUICKAUTH_ID, req.query.token)
    .then(async (alles) => {
      console.log(alles);

      // Response
      res.send("All done! Your AllesID and Spotify account are now connected!");
    })
    .catch(() => res.status(401).json({ err: "badAuthorization" }));
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
