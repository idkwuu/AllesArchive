import auth from "../../utils/auth";
import config from "../../config";
import axios from "axios";

const { NEXUS_URI, NEXUS_ID, NEXUS_SECRET } = process.env;

export default async (req, res) => {
	const user = await auth(req);
	if (!user) return res.status(401).send({ err: "badAuthorization" });
	if (!req.body) return res.status(400).json({ err: "badRequest" });

	const { oldPass, newPass } = req.body;
	if (typeof oldPass !== "string" || typeof newPass !== "string")
		return res.status(400).json({ err: "badRequest" });
	if (
		!oldPass ||
		!newPass ||
		oldPass.length > config.maxPasswordLength ||
		newPass.length > config.maxPasswordLength
	)
		return res.status(400).json({ err: "user.password.length" });
	if (oldPass === newPass)
		return res.status(400).json({ err: "user.password.same" });

	// Check old password
	try {
		if (
			!(
				await axios.post(
					`${NEXUS_URI}/users/${user.id}/password/verify`,
					{
						password: oldPass,
					},
					{
						auth: {
							username: NEXUS_ID,
							password: NEXUS_SECRET,
						},
					}
				)
			).data.matches
		)
			return res.status(400).json({ err: "user.password.incorrect" });
	} catch (err) {
		return res.status(400).json({ err: "user.password.incorrect" });
	}

	// Update password
	try {
		await axios.post(
			`${NEXUS_URI}/users/${user.id}/password`,
			{
				password: newPass,
			},
			{
				auth: {
					username: NEXUS_ID,
					password: NEXUS_SECRET,
				},
			}
		);
	} catch (err) {
		return res.status(500).json({ err: "internalError" });
	}

	// Response
	res.json({});
};
