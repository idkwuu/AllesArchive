const game = require("../gameData");
const config = require("../config");
const randomString = require("randomstring").generate;

module.exports = async (req, res) => {
    if (Object.keys(game.players).length > 50) return res.status(503).json({err: "serverFull"});
    const secret = randomString(config.secretLength);

    game.players[req.user.id] = {
        name: `${req.user.name}#${req.user.tag}`,
        score: 100,
        secret,
        color: req.user.id === "00000000-0000-0000-0000-000000000000" ?
            "#8b0dd4" :
            req.user.plus ?
                "#f7c614" :
                "#e74c3c",
        plague: Math.floor(Math.random() * 5) === 0,
        bulletPower: 2,
        speed: 2,
        speedBoost: {
            active: false,
            full: 50
        },
        x: Math.floor(Math.random() * config.innerMap) - config.innerMap / 2,
        y: Math.floor(Math.random() * config.innerMap) - config.innerMap / 2,
        direction: 0
    };
    
    res.json({id: req.user.id, secret});
};