import auth from "../../utils/auth";
import config from "../../config";
import axios from "axios";

const { NEXUS_URI, NEXUS_ID, NEXUS_SECRET } = process.env;

export default async (req, res) => {
	const user = await auth(req);
	if (!user) return res.status(401).send({ err: "badAuthorization" });

	if (!req.body) return res.status(400).json({ err: "badRequest" });
	if (typeof req.body.option !== "string")
		return res.status(400).json({ err: "badRequest" });

	// Get Option
	const option = config.plusOptions[req.body.option];
	if (!option) return res.status(400).json({ err: "badRequest" });
	if (option.coins > user.coins)
		return res.status(400).json({ err: "user.coins.notEnough" });

	try {
		// Deduct Coins
		await axios.post(
			`${NEXUS_URI}/users/${user.id}/coins`,
			{
				coins: 0 - option.coins,
			},
			{
				auth: {
					username: NEXUS_ID,
					password: NEXUS_SECRET,
				},
			}
		);

		// Set Membership End
		await axios.post(
			`${NEXUS_URI}/users/${user.id}`,
			{
				plusEnd: new Date(
					(user.plus.active ? new Date(user.plus.end) : new Date()).getTime() +
						option.days * 24 * 60 * 60 * 1000
				),
			},
			{
				auth: {
					username: NEXUS_ID,
					password: NEXUS_SECRET,
				},
			}
		);

		// Response
		res.json({});
	} catch (err) {
		res.status(500).json({ err: "internalError" });
	}
};
