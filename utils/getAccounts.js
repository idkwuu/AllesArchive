const axios = require("axios");

module.exports = async userId => {
	return (await axios.get(
		`https://1api.alles.cx/v1/accounts?id=${encodeURIComponent(userId)}`,
		{
			auth: {
				username: process.env.ALLES_ID,
				password: process.env.ALLES_SECRET
			}
		}
	)).data.id;
};
