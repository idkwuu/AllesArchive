import auth from "../../utils/auth";
import axios from "axios";
import getDiscord from "../../utils/discord";

export default async (req, res) => {
	const user = await auth(req);
	if (!user) return res.status(401).send({ err: "badAuthorization" });

	// Get Discord
	let discord = null;
	try {
		discord = await getDiscord(
			(await axios.get(`${process.env.DISCORD_API}/alles/${user.id}`)).data
				.discord
		);
	} catch (err) {}

	// Response
	res.json({ discord });
};
