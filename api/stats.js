const game = require("../gameData");

module.exports = (req, res) => {
    res.json({
        players: Object.keys(game.players).length,
        serverStart: game.serverStart
    });
};