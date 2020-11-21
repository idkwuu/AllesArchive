import auth from "../../../utils/auth";
import axios from "axios";

const { PULSAR_API, PULSAR_SECRET } = process.env;

export default async (req, res) => {
	const user = await auth(req);
	if (!user) return res.status(401).send({ err: "badAuthorization" });

	try {
		res.json(
			(
				await axios.get(`${PULSAR_API}/user/${user.id}`, {
					headers: {
						Authorization: PULSAR_SECRET,
					},
				})
			).data
		);
	} catch (err) {
		res.status(500).json({ err: "internalError" });
	}
};
