const { default: Axios } = require("axios");
const nexus = require("../utils/nexus");

module.exports = async (event) => {
  const { metadata } = event.data.object;

  if (typeof metadata.coins !== "undefined") {
    // Purchased Coins
    try {
      await nexus("POST", `users/${encodeURIComponent(metadata.user)}/coins`, {
        coins: Number(metadata.coins),
      });
    } catch (err) {}
  }
};
