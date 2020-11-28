import axios from "axios";

const { NEXUS_URI, NEXUS_ID, NEXUS_SECRET } = process.env;

export default async (req, res) => {
	if (typeof req.query.id !== "string")
		return res.status(400).json({ err: "badRequest" });

	// Get user
	let u;
	try {
		u = (
			await axios.get(
				`${NEXUS_URI}/users/${encodeURIComponent(req.query.id)}`,
				{
					auth: {
						username: NEXUS_ID,
						password: NEXUS_SECRET,
					},
				}
			)
		).data;
	} catch (err) {
		return res.status(404).json({ err: "missingResource" });
	}

	// Micro
	let micro;
	try {
		const data = (
			await axios.get(
				`https://micro.alles.cx/api/users/${encodeURIComponent(u.id)}`
			)
		).data;
		micro = {
			posts: data.posts.count,
			followers: data.followers.count,
			latest: data.posts.recent[0]
				? (
						await axios.get(
							`https://micro.alles.cx/api/posts/${encodeURIComponent(
								data.posts.recent[0]
							)}`
						)
				  ).data
				: null,
		};
	} catch (err) {}

	// Response
	res.json({
		id: u.id,
		name: u.name,
		tag: u.tag,
		username: u.username,
		plus: u.plus.active,
		nickname: u.nickname,
		createdAt: u.createdAt,
		xp: u.xp,
		country: u.country,
		micro,
	});
};
