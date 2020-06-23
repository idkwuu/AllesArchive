const axios = require("axios");
const getAccounts = require("../utils/getAccounts");
const getUser = require("../utils/getUserByCustomerId");

module.exports = async (customer, max, active) => {
	const userId = await getUser(customer);

	if (max) {
		const accounts = await getAccounts(userId);
		await setUserPlus(accounts.primary.id, active);
		await Promise.all(
			accounts.secondaries.map(account => setUserPlus(account.id, active))
		);
	} else await setUserPlus(userId, active);
};

const setUserPlus = (user, active) =>
	axios.post(
		`https://1api.alles.cx/v1/plus?id=${encodeURIComponent(user)}`,
		{plus: active},
		{
			auth: {
				username: process.env.ALLES_ID,
				password: process.env.ALLES_SECRET
			}
		}
	);
