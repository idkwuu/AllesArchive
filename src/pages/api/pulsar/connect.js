import auth from "../../../utils/auth";
import axios from "axios";

const { PULSAR_API, PULSAR_SECRET } = process.env;

export default async (req, res) => {
	const user = await auth(req);
	if (!user) return res.status(401).send({ err: "badAuthorization" });

	if (!req.body || typeof req.body.token !== "string")
		return res.status(400).json({ err: "badRequest" });

	try {
		res.json(
			(
				await axios.post(
					`${PULSAR_API}/connect`,
					{
						token: req.body.token,
						user: user.id,
					},
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
