const db = require("./db");
const { Op } = require("sequelize");
const axios = require("axios");

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
  try {
    const data = (
      await axios.get(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: {
            authorization: `Bearer ${account.access}`,
          },
        }
      )
    ).data;
    if (!data || !data.item) return;
    console.log(`${account.alles} is playing "${data.item.name}"`);
  } catch (err) {
    await account.update({ failed: true });
  }
}, 100);
