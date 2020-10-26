require("dotenv").config();

const db = require("./db");

// Express
const express = require("express");
const app = express();
app.use((_err, _req, res, _next) =>
  res.status(500).json({ err: "internalError" })
);
db.sync().then(() =>
  app.listen(8080, () => console.log("Express is listening..."))
);