// HTTP Server
const app = require("express")();
app.use(require("body-parser").json());
app.listen(8080);

// Events
const eventCodes = [
	"customer.subscription.created",
	"customer.subscription.deleted"
];

const events = {};
eventCodes.forEach(code => (events[code] = require(`./events/${code}`)));

// Webhook
app.post("/", async (req, res) => {
	if (events[req.body.type]) await events[req.body.type](req.body);
	res.status(204).send();
});
