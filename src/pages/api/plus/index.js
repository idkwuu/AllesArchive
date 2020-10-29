import auth from "../../../utils/auth";
import Stripe from "stripe";

const {
	NODE_ENV,
	STRIPE_SECRET,
	STRIPE_TEST_CUSTOMER,
	STRIPE_PLUS_MONTHLY,
	STRIPE_PLUS_YEARLY,
} = process.env;
const stripe = Stripe(STRIPE_SECRET);

export default async (req, res) => {
	const user = await auth(req);
	if (!user) return res.status(401).send({ err: "badAuthorization" });

	// No Customer ID
	const customerId =
		NODE_ENV === "development" && STRIPE_TEST_CUSTOMER
			? STRIPE_TEST_CUSTOMER
			: user.stripeCustomerId;
	if (!customerId) return res.json({ registered: false });

	try {
		// Get Subscription
		const monthly = (
			await stripe.subscriptions.list({
				customer: customerId,
				price: STRIPE_PLUS_MONTHLY,
			})
		).data[0];
		const yearly = (
			await stripe.subscriptions.list({
				customer: customerId,
				price: STRIPE_PLUS_YEARLY,
			})
		).data[0];
		const subscription = yearly || monthly;

		// Response
		res.json({
			registered: true,
			plan: yearly ? "yearly" : monthly ? "monthly" : null,
			end:
				subscription &&
				(subscription.cancel_at || subscription.current_period_end),
			renew: subscription && !subscription.cancel_at,
		});
	} catch (err) {
		res.status(500).json({ err: "internalError" });
	}
};
