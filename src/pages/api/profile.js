import auth from "../../utils/auth";
import config from "../../config";
import axios from "axios";

const { NEXUS_URI, NEXUS_ID, NEXUS_SECRET } = process.env;

export default async (req, res) => {
	const user = await auth(req);
	if (!user) return res.status(401).send({ err: "badAuthorization" });

	if (!req.body) return res.status(400).json({ err: "badRequest" });
	if (typeof req.body.tag !== "string" || typeof req.body.nickname !== "string")
		return res.status(400).json({ err: "badRequest" });

	const tag = Number(req.body.tag);
	const nickname = req.body.nickname.trim();

	if (isNaN(tag) || tag < 1 || tag > 9999 || !Number.isInteger(tag))
		return res.status(400).json({ err: "profile.tag.invalid" });

	const tagString = "0".repeat(4 - tag.toString().length) + tag.toString();

	if (nickname.length < 1)
		return res.status(400).json({ err: "profile.nickname.tooShort" });
	if (nickname.length > config.maxNicknameLength)
		return res.status(400).json({ err: "profile.nickname.tooLong" });
	if (tagString !== user.tag && !user.plus.active)
		return res.status(400).json({ err: "plusOnly" });

	// Avoid name#tag conflicts
	if (tagString !== user.tag) {
		try {
			await axios.get(
				`${NEXUS_URI}/nametag?name=${encodeURIComponent(
					user.name
				)}&tag=${encodeURIComponent(tagString)}`,
				{
					auth: {
						username: NEXUS_ID,
						password: NEXUS_SECRET,
					},
				}
			);
			return res.status(400).json({ err: "profile.tag.unavailable" });
		} catch (err) {
			if (!err.response || err.response.data.err !== "missingResource")
				return res.status(500).json({ err: "internalError" });
		}
	}

	// Update user
	try {
		await axios.post(
			`${NEXUS_URI}/users/${user.id}`,
			{
				nickname,
				tag: tagString,
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
