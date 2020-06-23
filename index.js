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
eventCodes.forEach(code => (events[code] = require(`./events/${code}.js`)));

// Webhook
app.post("/", (req, res) => {
	if (events[req.body.type]) events[req.body.type](req.body, res);
	else res.status(200).send("No handler");
});
