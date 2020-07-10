// Express
const express = require("express");
const app = express();
app.use(require("body-parser").json());
app.listen(8080, () => console.log("Express is listening..."));

// Base route
app.get("/", (req, res) => res.send("Hello! This is the Nexus API!"));
