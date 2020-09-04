const game = require("../gameData");
const config = require("../config");

module.exports = () => {
    for (var i = 0; i < config.stars; i++) game.stars.push({
        x: Math.floor(Math.random() * config.mapSize) - config.mapSize / 2,
        y: Math.floor(Math.random() * config.mapSize) - config.mapSize / 2
    });
};