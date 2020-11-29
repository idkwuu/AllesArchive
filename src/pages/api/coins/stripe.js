import auth from "../../../utils/auth";
import config from "../../../config";
import Stripe from "stripe";

const { STRIPE_SK } = process.env;
const stripe = Stripe(STRIPE_SK);

export default async (req, res) => {
	const user = await auth(req);
	if (!user) return res.status(401).send({ err: "badAuthorization" });

	if (!req.body) return res.status(400).json({ err: "badRequest" });
	if (typeof req.body.option !== "string")
		return res.status(400).json({ err: "badRequest" });

	// Get Option
	const option = config.coinsOptions[req.body.option];
	if (!option) return res.status(400).json({ err: "badRequest" });

	// Create Checkout Session
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		line_items: [
			{
				price_data: {
					currency: "usd",
					product_data: {
						name: `${option.coins} Coins`,
					},
					unit_amount: option.price,
				},
				quantity: 1,
			},
		],
		mode: "payment",
		success_url: "https://alles.cx",
		cancel_url: "https://alles.cx",
	});

	// Response
	res.json({
		session: session.id,
	});
};
