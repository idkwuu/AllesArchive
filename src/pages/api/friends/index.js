import auth from "../../../utils/auth";
import axios from "axios";

const { FRIENDS_API, FRIENDS_SECRET, HORIZON_API } = process.env;

export default async (req, res) => {
	const user = await auth(req);
	if (!user) return res.status(401).send({ err: "badAuthorization" });

	try {
		res.json({
			friends: await getFriends(user.id, false),
			requests: await getFriends(user.id, true),
		});
	} catch (err) {
		res.status(500).json({ err: "internalError" });
	}
};

const getFriends = async (id, requests) =>
	(
		await Promise.all(
			(
				await axios.get(`${FRIENDS_API}/${id}${requests ? "?requests" : ""}`, {
					headers: {
						Authorization: FRIENDS_SECRET,
					},
				})
			).data.friends.map(async ({ user, incoming }) => {
				try {
					return {
						...(
							await axios.get(
								`${HORIZON_API}/users/${encodeURIComponent(user)}`
							)
						).data,
						incoming: requests ? incoming : undefined,
					};
				} catch (err) {}
			})
		)
	).filter((u) => !!u);
