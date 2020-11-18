require("dotenv").config();
const {
  QUICKAUTH_ID,
  SPOTIFY_ID,
  SPOTIFY_SECRET,
  ORIGIN,
  DISABLE_STATUS,
} = process.env;

const db = require("./db");
const { Op } = require("sequelize");
const quickauth = require("@alleshq/quickauth");
const axios = require("axios");
const qs = require("qs").stringify;
const cors = require("cors");

// Express
const express = require("express");
const app = express();
app.use((_err, _req, res, _next) =>
  res.status(500).json({ err: "internalError" })
);
db.sync().then(() => {
  if (DISABLE_STATUS) console.log("Status querying disabled.");
  else require("./status");
  app.listen(8080, () => console.log("Express is listening..."));
});

// Spotify OAuth Redirect
app.get("/", (_req, res) =>
  res.redirect(
    `https://accounts.spotify.com/authorize?response_type=code&client_id=${SPOTIFY_ID}&scope=user-read-currently-playing&redirect_uri=${encodeURIComponent(
      ORIGIN
    )}%2Fcb`
  )
);

// Spotify Callback => QuickAuth Redirect
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
    res
      .status(400)
      .send(
        "Something didn't go quite right there! <a href='/'>Try again</a>."
      );
});

// QuickAuth callback
app.get("/auth", (req, res) => {
  if (typeof req.query.token !== "string" || typeof req.query.data !== "string")
    return res.status(400).json({ err: "badRequest" });
  quickauth(QUICKAUTH_ID, req.query.token)
    .then(async (alles) => {
      // Get token pair from Spotify
      const tokens = (
        await axios.post(
          "https://accounts.spotify.com/api/token",
          qs({
            grant_type: "authorization_code",
            code: req.query.data,
            redirect_uri: `${ORIGIN}/cb`,
          }),
          {
            auth: {
              username: SPOTIFY_ID,
              password: SPOTIFY_SECRET,
            },
            headers: {
              "content-type": "application/x-www-form-urlencoded",
            },
          }
        )
      ).data;
      if (tokens.scope !== "user-read-currently-playing")
        throw new Error("Unexpected scopes");

      // Get user id
      const { id } = (
        await axios.get("https://api.spotify.com/v1/me", {
          headers: {
            authorization: `Bearer ${tokens.access_token}`,
          },
        })
      ).data;

      // Deactivate old account connected to AllesID
      let account = await db.Account.findOne({
        where: { alles },
      });
      if (account && account.id !== id)
        await account.update({ connected: false });

      // Get Spotify account
      account = await db.Account.findOne({
        where: { id },
      });

      // Update existing account
      if (account)
        await account.update({
          alles,
          access: tokens.access_token,
          refresh: tokens.refresh_token,
          connected: true,
        });
      // Or create new account
      else
        account = await db.Account.create({
          id,
          alles,
          access: tokens.access_token,
          refresh: tokens.refresh_token,
          connected: true,
          checkedAt: 0,
        });

      // Reponse
      res.send("All done! Your AllesID and Spotify account are now connected!");
    })
    .catch(() => res.status(401).json({ err: "badAuthorization" }));
});

// Account API
app.use("/spotify/:id", cors());
app.get("/spotify/:id", async (req, res) => {
  const user = await getAccount("id", req.params.id);
  if (user) res.json(user);
  else res.status(404).json({ err: "missingResource" });
});

app.use("/alles/:id", cors());
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
      connected: true,
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
