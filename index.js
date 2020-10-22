// Express
const express = require("express");
const app = express();
app.use(require("cors")());
app.listen(8080, () => console.log("Server is online!"));

// Nexus
const axios = require("axios");
const nexus = async (method, endpoint, data) => (await axios({
    method,
    url: `${process.env.NEXUS_URI}/${endpoint}`,
    data,
    auth: {
        username: process.env.NEXUS_ID,
        password: process.env.NEXUS_SECRET
    }
})).data;

// Get User ID from Name#tag
app.get("/nametag", (req, res) => {
    if (typeof req.query.name !== "string" || typeof req.query.tag !== "string")
        return res.status(400).json({err: "badRequest"});
    
    nexus("GET", `nametag?name=${encodeURIComponent(req.query.name)}&tag=${encodeURIComponent(req.query.tag)}`)
        .then(({id}) => res.json({id}))
        .catch(() => res.status(404).json({err: "missingResource"}));
});

// Get User ID from Username
app.get("/username/:username", (req, res) => {    
    nexus("GET", `username/${encodeURIComponent(req.params.username)}`)
        .then(({id}) => res.json({id}))
        .catch(() => res.status(404).json({err: "missingResource"}));
});

// Get user data
app.get("/users/:id", (req, res) => {
    nexus("GET", `users/${encodeURIComponent(req.params.id)}`)
        .then(user => res.json({
            id: user.id,
            name: user.name,
            tag: user.tag,
            nickname: user.nickname,
            username: user.username,
            xp: user.xp,
            plus: user.plus,
            createdAt: user.createdAt
        }))
        .catch(() => res.status(404).json({err: "missingResource"}));
});

// 404
app.use((_req, res) => res.status(404).json({err: "notFound"}));