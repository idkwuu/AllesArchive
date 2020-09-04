const config = require("../config");

module.exports = () => ({
    x: Math.floor(Math.random() * config.mapSize) - config.mapSize / 2,
    y: Math.floor(Math.random() * config.mapSize) - config.mapSize / 2
});