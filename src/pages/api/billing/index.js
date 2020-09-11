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
		// Get data from Stripe
		const customer = await stripe.customers.retrieve(customerId);
		const plusMonthly =
			(
				await stripe.subscriptions.list({
					customer: customerId,
					price: process.env.STRIPE_PLUS_MONTHLY,
				})
			).data.length > 1;
		const plusYearly =
			(
				await stripe.subscriptions.list({
					customer: customerId,
					price: process.env.STRIPE_PLUS_YEARLY,
				})
			).data.length > 1;

		// Response
		res.json({
			registered: true,
			email: customer.email,
			plusSubscription: plusMonthly || plusYearly,
			balance: customer.balance,
		});
	} catch (err) {
		res.status(500).json({ err: "internalError" });
	}
};
