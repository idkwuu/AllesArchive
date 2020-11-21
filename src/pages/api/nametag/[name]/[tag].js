import axios from "axios";

const { NEXUS_URI, NEXUS_ID, NEXUS_SECRET } = process.env;

export default async (req, res) => {
	if (typeof req.query.name !== "string" || typeof req.query.tag !== "string")
		return res.status(400).json({ err: "badRequest" });

	try {
		res.json({
			id: (
				await axios.get(
					`${NEXUS_URI}/nametag?name=${encodeURIComponent(
						req.query.name
					)}&tag=${encodeURIComponent(req.query.tag)}`,
					{
						auth: {
							username: NEXUS_ID,
							password: NEXUS_SECRET,
						},
					}
				)
			).data.id,
		});
	} catch (err) {
		res.json({ err: "missingResource" });
	}
};
