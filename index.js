const {SERVERNAME} = process.env;

// Express
const express = require("express");
const app = express();
app.listen(8080);

app.get("/", (req, res) => {
    res.send(`AllesFS ${SERVERNAME}`);
});

// Get File
app.get("/:filename", (req, res) => {
    console.log(req.params.filename);
});