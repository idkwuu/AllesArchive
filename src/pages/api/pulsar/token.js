import auth from "../../../utils/auth";
import axios from "axios";

const { PULSAR_API, PULSAR_SECRET } = process.env;

export default async (req, res) => {
	const user = await auth(req);
	if (!user) return res.status(401).send({ err: "badAuthorization" });

	if (typeof req.query.token !== "string")
		return res.status(400).json({ err: "badRequest" });

	try {
		res.json(
			(
				await axios.get(
					`${PULSAR_API}/connect?token=${encodeURIComponent(req.query.token)}`,
					{
						headers: {
							Authorization: PULSAR_SECRET,
						},
					}
				)
			).data
		);
	} catch (err) {
		res.status(400).json({ err: "pulsar.connectToken" });
	}
};
