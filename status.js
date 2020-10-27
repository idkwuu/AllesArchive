const db = require("./db");
const { Op } = require("sequelize");
const axios = require("axios");
const uuid = require("uuid").v4;

setInterval(async () => {
  // Get account that has not been checked for the largest amount of time
  const account = (
    await db.Account.findAll({
      where: {
        checkedAt: {
          [Op.lt]: new Date().getTime() - 5000,
        },
        failed: false,
      },
      order: ["checkedAt"],
      limit: 1,
    })
  )[0];
  if (!account) return;

  // Mark as checked now
  await account.update({ checkedAt: new Date() });

  // Get currently playing
  let data;
  try {
    data = (
      await axios.get(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: {
            authorization: `Bearer ${account.access}`,
          },
        }
      )
    ).data;
  } catch (err) {
    return await account.update({ failed: true });
  }

  if (!data || !data.item) return;
  try {
    // Find Item
    let item = await db.Item.findOne({
      where: {
        id: data.item.id,
      },
    });

    // Create Item
    if (!item) {
      item = await db.Item.create({
        id: data.item.id,
        name: data.item.name,
        explicit: data.item.explicit,
        duration: data.item.duration_ms,
      });

      // Find/Create Artists
      await Promise.all(
        data.item.artists.map(async (a) => {
          let artist = await db.Artist.findOne({
            where: {
              id: a.id,
            },
          });

          if (!artist)
            artist = await db.Artist.create({
              id: a.id,
              name: a.name,
            });

          await artist.addItem(item);
        })
      );
    }

    // Create Status
    await db.Status.create({
      id: uuid(),
      playing: data.is_playing,
      progress: data.progress_ms,
      accountId: account.id,
      itemId: item.id,
    });
  } catch (err) {
    console.log(err);
  }
}, 100);
