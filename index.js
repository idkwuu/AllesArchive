const fs = require("fs");
const express = require("express");
const app = express();
app.listen(8080);

app.post("/", (req, res) => {
    if (req.headers.authorization !== process.env.SECRET) return res.status(401).send("Unauthorized");
    const t = new Date().getTime();
    const file = fs.createWriteStream(`${process.env.DATA}/${t}`, {flags: "a"});
    req.on("data", chunk => file.write(chunk));
    req.on("end", () => {
        file.end();
        res.status(200).send("Success");
    });
});