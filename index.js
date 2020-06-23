// HTTP Server
const app = require("express")();
app.use(require("body-parser").raw());
app.listen(8080);

// Stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET);

// Events
const eventCodes = [
	"customer.subscription.created",
	"customer.subscription.deleted",
	"customer.subscription.updated"
];
const events = {};
eventCodes.forEach(code => (events[code] = require(`./events/${code}`)));

// Webhook
app.post("/", async (req, res) => {
	const sig = req.headers["stripe-signature"];
	let event;
	try {
		event = stripe.webhooks.constructEvent(
			req.body,
			sig,
			process.env.WEBHOOK_SECRET
		);
	} catch (err) {
		console.log(err);
		return res.status(400).send(`Webhook Error: ${err.message}`);
	}

	if (events[event.type]) await events[event.type](event);
	res.status(204).send();
});
