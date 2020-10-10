require("dotenv").config();

// Express
const express = require("express");
const app = express();
app.use(require("body-parser").json());
app.use((_err, _req, res, _next) => res.status(500).json({err: "internalError"}));
app.listen(8080, () => console.log("Server is listening..."));

// Get Status
app.get("/:id", require("./getStatus"));

// Set Status
app.post("/:id", require("./setStatus"));

// 404
app.use((_req, res) => res.status(404).json({err: "notFound"}));