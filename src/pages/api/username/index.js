import auth from "../../../utils/auth";
import config from "../../../config";
import axios from "axios";

const { NEXUS_URI, NEXUS_ID, NEXUS_SECRET } = process.env;

export default async (req, res) => {
	const user = await auth(req);
	if (!user) return res.status(401).send({ err: "badAuthorization" });

	// Prevent updating username if already set
	if (user.username) return res.status(400).json({ err: "alreadySet" });

	// Minimum XP level
	if (user.xp.level < config.minUsernameLevel)
		return res.status(400).json({ err: "user.xp.notEnough" });

	// Validate Username
	if (!req.body) return res.status(400).json({ err: "badRequest" });
	if (typeof req.body.username !== "string")
		return res.status(400).json({ err: "badRequest" });

	const username = req.body.username.trim().toLowerCase();
	if (username.length < config.minUsernameLength)
		return res.status(400).json({ err: "profile.username.tooShort" });
	if (username.length > config.maxUsernameLength)
		return res.status(400).json({ err: "profile.username.tooLong" });
	if (!/^[a-z0-9]+$/i.test(username))
		return res.status(400).json({ err: "profile.username.invalid" });

	// Avoid conflicts
	try {
		await axios.get(`${NEXUS_URI}/username/${encodeURIComponent(username)}`, {
			auth: {
				username: NEXUS_ID,
				password: NEXUS_SECRET,
			},
		});
		return res.status(400).json({ err: "profile.username.unavailable" });
	} catch (err) {
		if (!err.response || err.response.data.err !== "missingResource")
			return res.status(500).json({ err: "internalError" });
	}

	// Update user
	try {
		await axios.post(
			`${NEXUS_URI}/users/${user.id}`,
			{
				username,
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
