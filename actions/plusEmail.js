const getUserByCustomerId = require("../utils/getUserByCustomerId");
const getUserData = require("../utils/getUserData");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const axios = require("axios");

module.exports = async customerId => {
	const user = await getUserData(await getUserByCustomerId(customerId));
	const customer = await stripe.customers.retrieve(customerId);

	try {
		axios.post(
			"https://pico.alles.cx/api/v1/send/message",
			{
				to: customer.email,
				from: "plus@alles.cx",
				reply_to: "archie@alles.cx",
				subject: "Welcome to Alles+!",
				html_body: "test"
			},
			{
				headers: {
					"X-Server-API-Key": process.env.PICO_KEY
				}
			}
		);
	} catch (err) {}
};
