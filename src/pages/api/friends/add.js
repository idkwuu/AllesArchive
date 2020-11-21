import auth from "../../../utils/auth";
import axios from "axios";

const { FRIENDS_API, FRIENDS_SECRET, HORIZON_API } = process.env;

export default async (req, res) => {
	const user = await auth(req);
	if (!user) return res.status(401).send({ err: "badAuthorization" });

	if (!req.body || typeof req.body.user !== "string")
		return res.status(400).json({ err: "badRequest" });

	// Get User
	let u;
	try {
		u = (
			await axios.get(
				`${HORIZON_API}/users/${encodeURIComponent(req.body.user)}`
			)
		).data;
	} catch (err) {
		return res.status(404).json({ err: "missingResource" });
	}

	// Create Friendship
	try {
		const friendship = (
			await axios.post(
				`${FRIENDS_API}/${user.id}/${u.id}`,
				{},
				{
					headers: {
						Authorization: FRIENDS_SECRET,
					},
				}
			)
		).data;

		// Response
		res.json({ requested: !friendship.acceptedAt });
	} catch (err) {
		if (err.response) res.status(400).json({ err: err.response.data.err });
		else res.status(500).json({ err: "internalError" });
	}
};
