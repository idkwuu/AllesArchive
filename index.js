// Express
const express = require("express");
const app = express();
app.listen(8080, () => console.log("Server is online!"));

// Nexus
const nexus = require("@alleshq/nexus");
nexus.setCredentials(process.env.NEXUS_ID, process.env.NEXUS_SECRET);

// 404
app.use((req, res) => res.status(404).json({err: "notFound"}));