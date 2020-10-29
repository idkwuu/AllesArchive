import axios from "axios";

const { DISCORD_TOKEN } = process.env;

export default async (id) =>
	(
		await axios.get(
			`https://discord.com/api/v6/users/${encodeURIComponent(id)}`,
			{
				headers: {
					Authorization: `Bot ${DISCORD_TOKEN}`,
				},
			}
		)
	).data;
