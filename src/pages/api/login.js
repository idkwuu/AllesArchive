import axios from "axios";
import { getAddress } from "../../utils/getAddress";

const { NEXUS_URI, NEXUS_ID, NEXUS_SECRET } = process.env;

export default async (req, res) => {
	if (
		!req.body ||
		typeof req.body.name !== "string" ||
		typeof req.body.tag !== "string" ||
		typeof req.body.password !== "string"
	) {
		return res.status(400).send({ err: "badRequest" });
	}

	// Fake delay
	const delay = Math.floor(Math.random() * 200) + 50;
	await new Promise((resolve) => setTimeout(() => resolve(), delay));

	try {
		// Get user id from nametag
		const { id } = await axios
			.get(
				`${NEXUS_URI}/nametag?name=${encodeURIComponent(
					req.body.name
				)}&tag=${encodeURIComponent(req.body.tag)}`,
				{
					auth: {
						username: NEXUS_ID,
						password: NEXUS_SECRET,
					},
				}
			)
			.then((res) => res.data);

		// Validate password
		const { matches } = await axios
			.post(
				`${NEXUS_URI}/users/${id}/password/verify`,
				{ password: req.body.password },
				{
					auth: {
						username: NEXUS_ID,
						password: NEXUS_SECRET,
					},
				}
			)
			.then((res) => res.data);

		if (!matches) throw Error();

		// Create session
		const { token } = await axios
			.post(
				`${NEXUS_URI}/sessions`,
				{
					user: id,
					address: getAddress(req),
				},
				{
					auth: {
						username: NEXUS_ID,
						password: NEXUS_SECRET,
					},
				}
			)
			.then((res) => res.data);

		res.json({ token });
	} catch (err) {
		return res.status(400).json({ err: "user.signIn.credentials" });
	}
};
