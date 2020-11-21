import auth from "../../../utils/auth";
import axios from "axios";

const { FRIENDS_API, FRIENDS_SECRET } = process.env;

export default async (req, res) => {
	const user = await auth(req);
	if (!user) return res.status(401).send({ err: "badAuthorization" });

	if (!req.body) return res.status(400).json({ err: "badRequest" });
	if (typeof req.body.user !== "string")
		return res.status(400).json({ err: "badRequest" });

	// Remove Friendship
	try {
		await axios.delete(
			`${FRIENDS_API}/${user.id}/${encodeURIComponent(req.body.user)}`,
			{
				headers: {
					Authorization: FRIENDS_SECRET,
				},
			}
		);

		// Response
		res.json({});
	} catch (err) {
		console.log(err);
		res.status(500).json({ err: "internalError" });
	}
};
