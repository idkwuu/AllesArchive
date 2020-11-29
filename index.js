require("dotenv").config();

// Express
const express = require("express");
const app = express();
app.use(require("body-parser").json());
app.use(require("./util/auth"));
app.use((_err, _req, res, _next) =>
  res.status(500).json({ err: "internalError" })
);

// Database
const db = require("./db");
db.sync().then(() =>
  app.listen(8080, () => console.log("Server is listening..."))
);

// Create User
app.post("/users", require("./api/users/create"));

// Get User from Name#Tag
app.get("/nametag", require("./api/nametag"));

// Get User from Username
app.get("/username/:username", require("./api/username"));

// User Info
app.get("/users/:id", require("./api/users"));
app.post("/users/:id", require("./api/users/update"));

// XP
app.post("/users/:id/xp", require("./api/users/xp"));

// Coins
app.post("/users/:id/coins", require("./api/users/coins"));

// Password
app.post("/users/:id/password", require("./api/users/password/update"));
app.post("/users/:id/password/verify", require("./api/users/password/verify"));

// Sessions
app.post("/sessions", require("./api/sessions/create"));
app.post("/sessions/token", require("./api/sessions/token"));
app.get("/sessions/:id", require("./api/sessions"));
app.delete("/sessions/:id", require("./api/sessions/delete"));

// 404
app.use((_req, res) => res.status(404).json({ err: "notFound" }));
