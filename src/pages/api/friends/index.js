import auth from "../../../utils/auth";
import axios from "axios";

const { FRIENDS_API, FRIENDS_SECRET, HORIZON_API } = process.env;

export default async (req, res) => {
	const user = await auth(req);
	if (!user) return res.status(401).send({ err: "badAuthorization" });

	try {
		res.json({
			friends: (
				await Promise.all(
					(
						await axios.get(`${FRIENDS_API}/${user.id}`, {
							headers: {
								Authorization: FRIENDS_SECRET,
							},
						})
					).data.friends.map(async ({ user }) => {
						try {
							return (
								await axios.get(
									`${HORIZON_API}/users/${encodeURIComponent(user)}`
								)
							).data;
						} catch (err) {}
					})
				)
			).filter((u) => !!u),
		});
	} catch (err) {
		res.status(500).json({ err: "internalError" });
	}
};
