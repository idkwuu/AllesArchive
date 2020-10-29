import config from "../../../config";
import auth from "../../../utils/auth";
import axios from "axios";
import Stripe from "stripe";

const {
	NODE_ENV,
	NEXUS_URI,
	NEXUS_ID,
	NEXUS_SECRET,
	STRIPE_SECRET,
	STRIPE_TEST_CUSTOMER,
} = process.env;
const stripe = Stripe(STRIPE_SECRET);

export default async (req, res) => {
	const user = await auth(req);
	if (!user) return res.status(401).json({ err: "badAuthorization" });
	if (!req.body || typeof req.body.email !== "string")
		return res.status(400).json({ err: "badRequest" });

	// Email
	const email = req.body.email.trim().toLowerCase();
	if (email.length > config.maxEmailLength || !validateEmail(email))
		return res.status(400).json({ err: "email.invalid" });

	// Customer ID
	const customerId =
		NODE_ENV === "development" && STRIPE_TEST_CUSTOMER
			? STRIPE_TEST_CUSTOMER
			: user.stripeCustomerId;

	try {
		if (customerId) {
			// Update Customer
			await stripe.customers.update(customerId, { email });
		} else {
			// Create Customer
			const customer = await stripe.customers.create({
				email,
				metadata: {
					userId: user.id,
				},
			});

			// Update User
			await axios.post(
				`${NEXUS_URI}/users/${user.id}`,
				{
					stripeCustomerId: customer.id,
				},
				{
					auth: {
						username: NEXUS_ID,
						password: NEXUS_SECRET,
					},
				}
			);
		}

		// Response
		res.json({});
	} catch (err) {
		res.status(500).json({ err: "internalError" });
	}
};

const validateEmail = (email) =>
	/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
		email
	);
