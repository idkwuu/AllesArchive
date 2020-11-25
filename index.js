require("dotenv").config();
const User = require("./db");

// Express
const express = require("express");
const app = express();
app.use(require("cors")());
app.listen(8080, () => console.log("Server is online!"));

// Nexus
const axios = require("axios");
const nexus = async (endpoint, data) =>
  (
    await axios({
      method: "GET",
      url: `${process.env.NEXUS_URI}/${endpoint}`,
      data,
      auth: {
        username: process.env.NEXUS_ID,
        password: process.env.NEXUS_SECRET,
      },
    })
  ).data;

// Get User From Nexus (and cache in database)
const getUserFromNexus = async (id) => {
  const user = await nexus(`users/${encodeURIComponent(id)}`);
  const data = {
    id: user.id,
    name: user.name,
    tag: user.tag,
    nickname: user.nickname,
    username: user.username,
    xp: user.xp,
    plus: user.plus,
    createdAt: user.createdAt,
  };
  return {
    id: user.id,
    name: user.name,
    tag: user.tag,
    username: user.username,
    data: JSON.stringify(data),
    cachedAt: new Date(),
  };
};

// Get User
const getUser = async (query, id, res) => {
  let user = await User.findOne({ where: query });
  let userData;

  // No user found from query
  try {
    if (!user) {
      // Get user data
      userData = await getUserFromNexus(await id());

      // Create user
      user = await User.create(userData);
    }
  } catch (err) {}

  // No user found from query, successfully queried Nexus, but couldn't create a new user
  // Eg. User has a different username, so a record already exists for the id, and we can't create a new one,
  // but there'll be no results in for the original query which is a username we haven't cached.
  try {
    if (!user && userData) {
      // Find existing record with that id
      user = await User.findOne({ where: { id: userData.id } });

      // Update it
      if (user) await user.update(userData);
    }
  } catch (err) {}

  // User exists but the cache needs to be updated
  try {
    if (
      user &&
      user.cachedAt < new Date().getTime() - Number(process.env.CACHE_MS)
    )
      await user.update(await getUserFromNexus(await id()));
  } catch (err) {}

  // Response
  if (user)
    res.json({
      ...JSON.parse(user.data),
      cachedAt: user.cachedAt,
    });
  else res.status(404).json({ err: "missingResource" });
};

// Get User from Name#tag
app.get("/nametag/:name/:tag", (req, res) =>
  getUser(
    {
      name: req.params.name,
      tag: req.params.tag,
    },
    async () =>
      (
        await nexus(
          `nametag?name=${encodeURIComponent(
            req.params.name
          )}&tag=${encodeURIComponent(req.params.tag)}`
        )
      ).id,
    res
  )
);

// Get User from Username
app.get("/username/:username", (req, res) =>
  getUser(
    { username: req.params.username },
    async () =>
      (await nexus(`username/${encodeURIComponent(req.params.username)}`)).id,
    res
  )
);

// Get User from ID
app.get("/users/:id", (req, res) =>
  getUser({ id: req.params.id }, () => req.params.id, res)
);

// 404
app.use((_req, res) => res.status(404).json({ err: "notFound" }));
