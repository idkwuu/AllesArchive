import auth from "../../../utils/auth";
import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_SECRET);

export default async (req, res) => {
	const user = await auth(req);
	if (!user) return res.status(401).send({ err: "badAuthorization" });

	const customerId =
		process.env.NODE_ENV === "development" && process.env.STRIPE_TEST_CUSTOMER
			? process.env.STRIPE_TEST_CUSTOMER
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
