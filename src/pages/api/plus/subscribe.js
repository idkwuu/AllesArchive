import auth from "../../../utils/auth";
import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_SECRET);

export default async (req, res) => {
	const user = await auth(req);
	if (!user) return res.status(401).send({ err: "badAuthorization" });

	if (!req.body || typeof req.body.plan !== "string")
		return res.status(400).json({ err: "badRequest" });
	if (!["monthly", "yearly"].includes(req.body.plan))
		return res.status(400).json({ err: "billing.invalidPlan" });
	if (user.plus) return res.status(400).json({ err: "alreadySet" });

	// No Customer ID
	const customerId =
		process.env.NODE_ENV === "development" && process.env.STRIPE_TEST_CUSTOMER
			? process.env.STRIPE_TEST_CUSTOMER
			: user.stripeCustomerId;
	if (!customerId) return res.status(400).json({ err: "billing.unregistered" });

	try {
		// Check for active subscription
		const monthly = (
			await stripe.subscriptions.list({
				customer: customerId,
				price: process.env.STRIPE_PLUS_MONTHLY,
			})
		).data[0];
		const yearly = (
			await stripe.subscriptions.list({
				customer: customerId,
				price: process.env.STRIPE_PLUS_YEARLY,
			})
		).data[0];
		if (yearly || monthly) return res.status(400).json({ err: "alreadySet" });

		// Create Subscription
		await stripe.subscriptions.create({
			customer: customerId,
			items: [
				{
					price: process.env[`STRIPE_PLUS_${req.body.plan.toUpperCase()}`],
				},
			],
		});

		// Response
		res.json({});
	} catch (err) {
		res.status(500).json({ err: "internalError" });
	}
};
