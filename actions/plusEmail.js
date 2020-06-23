const getUserByCustomerId = require("../utils/getUserByCustomerId");
const getUserData = require("../utils/getUserData");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const axios = require("axios");

module.exports = async customerId => {
	const user = await getUserData(await getUserByCustomerId(customerId));
	console.log(user);
};
