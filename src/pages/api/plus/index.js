import auth from "../../../utils/auth";
import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_SECRET);

export default async (req, res) => {
	const user = await auth(req);
	if (!user) return res.status(401).send({ err: "badAuthorization" });

	// No Customer ID
	const customerId =
		process.env.NODE_ENV === "development" && process.env.STRIPE_TEST_CUSTOMER
			? process.env.STRIPE_TEST_CUSTOMER
			: user.stripeCustomerId;
	if (!customerId) return res.json({ registered: false });

	try {
		// Get Subscription
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
		const subscription = yearly || monthly;

		// Response
		res.json({
			registered: true,
			plan: yearly ? "yearly" : monthly ? "monthly" : null,
			periodEnd: subscription && subscription.current_period_end,
			renew: subscription && !subscription.cancel_at_period_end,
		});
	} catch (err) {
		res.status(500).json({ err: "internalError" });
	}
};
