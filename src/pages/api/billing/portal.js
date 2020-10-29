import auth from "../../../utils/auth";
import Stripe from "stripe";

const { NODE_ENV, STRIPE_SECRET, STRIPE_TEST_CUSTOMER } = process.env;
const stripe = Stripe(STRIPE_SECRET);

export default async (req, res) => {
	const user = await auth(req);
	if (!user) return res.status(401).send({ err: "badAuthorization" });

	const customerId =
		NODE_ENV === "development" && STRIPE_TEST_CUSTOMER
			? STRIPE_TEST_CUSTOMER
			: user.stripeCustomerId;
	if (!customerId) return res.status(400).json({ err: "billing.unregistered" });

	try {
		// Create Portal Session
		const portalSession = await stripe.billingPortal.sessions.create({
			customer: customerId,
		});

		// Response
		res.json({ url: portalSession.url });
	} catch (err) {
		res.status(500).json({ err: "internalError" });
	}
};
