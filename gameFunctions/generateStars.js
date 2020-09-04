const game = require("../gameData");
const config = require("../config");
const star = require("../util/star");

module.exports = () => {
    for (var i = 0; i < config.stars; i++) game.stars.push(star());
};