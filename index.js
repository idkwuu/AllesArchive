const nexus = require("@alleshq/nexus");
const express = require("express");
const app = express();
app.listen(8080, () => console.log("Server is online!"));

// 404
app.use((req, res) => res.status(404).json({err: "notFound"}));