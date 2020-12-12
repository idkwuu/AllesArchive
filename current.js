const db = require("./db");
const { Op } = require("sequelize");

module.exports = async (id) => {
  // Get Status
  const status = await db.Status.findOne({
    where: {
      accountId: id,
      createdAt: {
        [Op.gte]: new Date().getTime() - 20000,
      },
    },
    order: [["createdAt", "desc"]],
  });
  if (!status) return;

  // Get current item
  const current = await db.Item.findOne({
    where: {
      id: status.itemId,
    },
  });
  current.artists = await current.getArtists();

  // Return data
  return current
    ? {
        id: current.id,
        name: current.name,
        playing: status.playing,
        progress: status.progress,
        duration: current.duration,
        explicit: current.explicit,
        artists: current.artists.map((a) => ({
          id: a.id,
          name: a.name,
        })),
      }
    : null;
};
