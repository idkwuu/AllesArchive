import { Avatar, Box, Breadcrumb, Input, Button } from "@alleshq/reactants";
import Link from "next/link";
import { Page } from "../components/Page";
import { useUser } from "../utils/userContext";
import axios from "axios";
import cookies from "next-cookies";
import { useState } from "react";
import { Check, X } from "react-feather";

const page = ({ friends, requests }) => {
	const user = useUser();

	return (
		<Page
			title="Friends"
			breadcrumbs={<Breadcrumb.Item>Friends</Breadcrumb.Item>}
		>
			<FriendRequest sessionToken={user.sessionToken} />

			{friends.length > 0 && (
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
					{friends.map((u) => (
						<Friend key={u.id} sessionToken={user.sessionToken} {...u} />
					))}
				</div>
			)}

			{requests.length > 0 && (
				<div className="space-y-3">
					{requests.map((u) => (
						<Request key={u.id} sessionToken={user.sessionToken} {...u} />
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
			.get(
				`/api/nametag/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`
			)
			.then((res) => {
				axios
					.post(
						"/api/friends/add",
						{ user: res.data.id },
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
							if (err.response.data.err === "user.friend.self")
								setResponse("You can't friend yourself!");
							else if (err.response.data.err === "user.friend.tooMany")
								setResponse("You've reached your friend limit.");
							else setResponse("Something went wrong.");
						} else setResponse("Something went wrong.");
						setLoading(false);
					});
			})
			.catch(() => {
				setResponse("This user doesn't exist.");
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

const Friend = ({ id, name, plus, username, sessionToken }) => {
	const [loading, setLoading] = useState(false);
	const [removed, setRemoved] = useState(false);

	const remove = () => {
		setLoading(true);
		axios
			.post(
				"/api/friends/remove",
				{ user: id },
				{
					headers: {
						Authorization: sessionToken,
					},
				}
			)
			.then(() => setRemoved(true))
			.catch(() => {});
	};

	return (
		!removed && (
			<Box className="py-5 space-y-5 text-center" key={id}>
				<Link href="/[user]" as={`/${encodeURIComponent(username || id)}`}>
					<a className="space-y-5">
						<div className="flex justify-center">
							<Avatar
								src={`https://avatar.alles.cc/${id}?size=100`}
								size={100}
							/>
						</div>
						<div>
							<h1 className="font-semibold">
								{name}
								{plus && <sup className="select-none text-primary">+</sup>}
							</h1>
							{username && <h2 className="text-primary">@{username}</h2>}
						</div>
					</a>
				</Link>
				<Button size="sm" color="secondary" loading={loading} onClick={remove}>
					Remove
				</Button>
			</Box>
		)
	);
};

const Request = ({ id, name, tag, incoming, sessionToken }) => {
	const [removed, setRemoved] = useState(false);

	const action = (accept) => {
		setRemoved(true);
		axios
			.post(
				`/api/friends/${accept ? "add" : "remove"}`,
				{ user: id },
				{
					headers: {
						Authorization: sessionToken,
					},
				}
			)
			.catch(() => {});
	};

	return (
		!removed && (
			<Box>
				<Box.Content className="flex justify-between">
					<div className="flex flex-col justify-center">
						<div className="flex">
							<div className="flex flex-col justify-center">
								<Avatar
									src={`https://avatar.alles.cc/${id}?size=40`}
									size={40}
								/>
							</div>
							<div className="ml-3">
								<p className="text-lg font-semibold">
									{name}
									<span className="text-primary text-xs font-normal">
										#{tag}
									</span>
								</p>
								<p className="text-xs font-light">
									{incoming ? "Incoming" : "Outgoing"} friend request
								</p>
							</div>
						</div>
					</div>
					<div className="flex flex-col justify-center">
						<div className="flex space-x-2">
							{incoming && (
								<Button
									size="sm"
									color="primary"
									className="w-8 h-8"
									onClick={() => action(true)}
								>
									<Check size={20} />
								</Button>
							)}
							<Button
								size="sm"
								color="secondary"
								className="w-8 h-8"
								onClick={() => action(false)}
							>
								<X size={20} />
							</Button>
						</div>
					</div>
				</Box.Content>
			</Box>
		)
	);
};
