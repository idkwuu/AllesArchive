import { Avatar, Box, Breadcrumb, Input, Button } from "@alleshq/reactants";
import Link from "next/link";
import { Page } from "../components/Page";
import { useUser } from "../utils/userContext";
import axios from "axios";
import cookies from "next-cookies";
import { useState } from "react";

const page = ({ friends }) => {
	const user = useUser();

	return (
		<Page
			title="Pulsar"
			breadcrumbs={<Breadcrumb.Item>Friends</Breadcrumb.Item>}
		>
			<FriendRequest sessionToken={user.sessionToken} />

			{friends.length > 0 && (
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
					{friends.map((u) => (
						<Link
							href="/[user]"
							as={`/${encodeURIComponent(u.username || u.id)}`}
							key={u.id}
						>
							<a>
								<Box className="py-5 space-y-5">
									<div className="flex justify-center">
										<Avatar
											src={`https://avatar.alles.cc/${u.id}?size=100`}
											size={100}
										/>
									</div>
									<div className="text-center">
										<h1 className="font-semibold">
											{u.name}
											{u.plus && (
												<sup className="select-none text-primary">+</sup>
											)}
										</h1>
										{u.username && (
											<h2 className="text-primary">@{u.username}</h2>
										)}
									</div>
								</Box>
							</a>
						</Link>
					))}
				</div>
			)}
		</Page>
	);
};

page.getInitialProps = async (ctx) => {
	try {
		return (
			await axios.get(`${process.env.NEXT_PUBLIC_ORIGIN}/api/friends`, {
				headers: {
					Authorization: cookies(ctx).sessionToken,
				},
			})
		).data;
	} catch (err) {
		return {};
	}
};

export default page;

const FriendRequest = ({ sessionToken }) => {
	const [loading, setLoading] = useState(false);
	const [nametag, setNametag] = useState("");
	const [response, setResponse] = useState();

	const addFriend = () => {
		let name = nametag.split("#");
		const tag = name.pop();
		name = name.join("#");

		if (!name || tag.length !== 4)
			return setResponse(
				"Please use the format name#tag, with a 4-digit numeric tag."
			);

		setLoading(true);
		setResponse();
		axios
			.post(
				"/api/friends/add",
				{ name, tag },
				{
					headers: {
						Authorization: sessionToken,
					},
				}
			)
			.then((res) => {
				setResponse(
					res.data.requested
						? "Friend request sent! Ask this user to add you back."
						: "This user is now your friend!"
				);
				setLoading(false);
			})
			.catch((err) => {
				if (err.response) {
					if (err.response.data.err === "missingResource")
						setResponse("This user doesn't exist.");
					else if (err.response.data.err === "user.friend.self")
						setResponse("You can't friend yourself!");
					else if (err.response.data.err === "user.friend.tooMany")
						setResponse("You've reached your friend limit.");
					else setResponse("Something went wrong.");
				} else setResponse("Something went wrong.");
				setLoading(false);
			});
	};

	return (
		<Box>
			<Box.Content>
				<Input
					placeholder="Jessica Adams#0000"
					onChange={(e) => setNametag(e.target.value)}
				/>
			</Box.Content>
			<Box.Footer className="flex items-center justify-between">
				<p>{response}</p>
				<Button size="sm" loading={loading} onClick={addFriend}>
					Add Friend
				</Button>
			</Box.Footer>
		</Box>
	);
};
