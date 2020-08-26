import axios from "axios";

export default async (req, res) => {
	if (!req.cookies.sessionToken) {
		return res.status(401).send({ err: "badAuthorization" });
	}

	const token = req.cookies.sessionToken;
	const { NEXUS_ID, NEXUS_SECRET, NEXUS_URI } = process.env;
	const auth = { username: NEXUS_ID, password: NEXUS_SECRET };

	try {
		// Get session from token
		const session = await axios
			.post(`${NEXUS_URI}/sessions/token`, { token }, { auth })
			.then((res) => res.data);

		// Get user by id
		const user = await axios
			.get(`${NEXUS_URI}/users/${session.user}`, { auth })
			.then((res) => res.data);

		res.json({
			id: user.id,
			name: user.name,
			tag: user.tag,
			nickname: user.nickname,
			xp: user.xp,
			plus: user.plus,
			createdAt: user.createdAt,
		});
	} catch (err) {
		res.status(500).send({ err: "internalError" });
	}
};
