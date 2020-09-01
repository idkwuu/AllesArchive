import axios from "axios";

export default async (id) =>
	(
		await axios.get(
			`https://discord.com/api/v6/users/${encodeURIComponent(id)}`,
			{
				headers: {
					Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
				},
			}
		)
	).data;
