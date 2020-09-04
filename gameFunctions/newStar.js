const game = require("../gameData");
const star = require("../util/star");

module.exports = () => {
    game.stars.shift();
    game.stars.push(star());
};