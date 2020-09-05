require("dotenv").config();

const game = require("./gameData");
const config = require("./config");
const auth = require("./util/auth");
const quickauth = require("@alleshq/quickauth");

// HTTP Server
const express = require("express");
const app = express(); // Express Server
const http = require("http").createServer(app);
const io = require("socket.io")(http); // Socket.io Server
app.use(require("cors")()); // CORS Headers
app.use(require("body-parser").json()); // Body Parser
app.use(require("cookie-parser")()); // Cookie Parser
app.use((_err, _req, res, _next) => res.status(500).json({err: "internalError"})); // Express Error Handling
http.listen(8080, () => console.log("Server is listening..."));

// Setup Functions
require("./gameFunctions/generateStars")();

// Game Loop
setInterval(() => {

    // Emit Game Data
    io.emit("data", {
        players: (() => {
            const players = {};
            Object.keys(game.players).forEach(id => {
                const player = game.players[id];
                players[id] = {
                    name: player.name,
                    score: player.score,
                    x: player.x,
                    y: player.y,
                    speedBoost: player.speedBoost,
                    plague: player.plague,
                    color: player.color
                };
            });
            return players;
        })(),
        bullets: game.bullets.map(bullet => ({
            x: bullet.x,
            y: bullet.y
        })),
        stars: game.stars
    });

    // Game Functions
    require("./gameFunctions/newStar")();
    require("./gameFunctions/playerUpdate")();
    require("./gameFunctions/bulletUpdate")();

}, 1000 / config.tickSpeed);

// Socket.io Connection
io.on("connection", socket => {

    // Player Action
    socket.on("action", data => {
        const player = game.players[data.id];
        if (!player || player.secret !== data.secret) return;

        switch (data.action) {

            // Change Direction
            case "changeDirection":
                player.direction = data.param;
                break;
            
            // Activate Speed Boost
            case "speedBoost":
                if (player.speedBoost.full < 100) return;
                player.speedBoost.active = true;
                break;
            
            // Shoot Bullet
            case "shoot":
                if (game.bullets.length > config.maxBullets) return; //Maximum Bullets in Arena
                player.score--;
                game.bullets.push({
                    owner: data.id,
                    bulletPower: player.bulletPower,
                    direction: player.effects.includes("sharpshooter") ? player.direction : player.direction + (Math.random() * 10 - 5),
                    x: player.x,
                    y: player.y,
                    plague: player.plague
                });
                break;

        }

        game.players[data.id] = player;
    });

});

// User
app.get("/user", auth, (req, res) => res.json(req.user));

// Join
app.post("/join", auth, require("./api/join"));

// Authenticate
app.get("/auth", (_req, res) => res.redirect(quickauth.url(process.env.QUICKAUTH_CALLBACK)));
app.get("/auth/cb", require("./api/auth"));

// Stats
app.get("/stats", (_req, res) => res.json({
    players: Object.keys(game.players).length,
    serverStart: game.serverStart
}));