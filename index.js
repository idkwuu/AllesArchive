require("dotenv").config();

// Express
const express = require("express");
const app = express();
app.use(require("body-parser").json());
app.use((_err, _req, res, _next) => res.status(500).json({err: "internalError"}));
app.listen(8080, () => console.log("Server is listening..."));

// Get Status
app.get("/:id", require("./api/get"));

// Set Status with Secret
app.post("/:id", require("./api/set"));

// Set Status with Session Token
app.post("/", require("./api/setUser"));

// 404
app.use((_req, res) => res.status(404).json({err: "notFound"}));