import auth from "../../../utils/auth";
import Stripe from "stripe";

const { NODE_ENV, STRIPE_SECRET, STRIPE_TEST_CUSTOMER } = process.env;
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
		// Get data from Stripe
		const customer = await stripe.customers.retrieve(customerId);

		// Response
		res.json({
			registered: true,
			email: customer.email,
			balance: customer.balance,
		});
	} catch (err) {
		res.status(500).json({ err: "internalError" });
	}
};
