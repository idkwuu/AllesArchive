const game = require("../gameData");
const config = require("../config");
const db = require("../util/mongo");
const calculateMovement = require("../util/move");

module.exports = () => {
    Object.keys(game.players).forEach(async id => {
        const player = game.players[id];

        //Movement
        const movement = calculateMovement(player.direction, player.speed * (player.speedBoost.active ? 2 : 1));
        player.x += movement.x;
        player.y += movement.y;

        //Speed Boost
        if (player.speedBoost.active) {
            player.speedBoost.full -= 1;
            if (player.speedBoost.full <= 0) player.speedBoost.active = false;
        } else {
            if (player.speedBoost.full < 100) player.speedBoost.full += 0.2;
        }

        //Plague
        if (player.plague && Math.floor(Math.random() * 5) === 0) {
            player.score--;
        }

        //Map Bounds
        if (
            player.x < 0 - config.mapSize / 2 ||
            player.x > 0 + config.mapSize / 2 ||
            player.y < 0 - config.mapSize / 2 ||
            player.y > 0 + config.mapSize / 2
        ) player.score--;

        //Update
        if (player.score > 0) {
            game.players[id] = player;
        } else {

            //Add Kills
            if (player.killedBy && game.players[player.killedBy]) {
                await db("players").updateOne({_id: player.killedBy}, {$inc: {kills: 1}});
            }

            //Remove Player
            delete game.players[id];

        }
    });
};