import { Page } from "../components/Page";
import { Box, Breadcrumb, Button } from "@alleshq/reactants";
import { useUser } from "../utils/userContext";
import axios from "axios";
import { useState } from "react";
import moment from "moment";
import Link from "next/link";
import config from "../config";

const page = () => {
	const user = useUser();
	const [loading, setLoading] = useState(false);
	const [done, setDone] = useState(false);

	const subscribe = (option) => {
		setLoading(true);
		axios
			.post(
				"/api/plus",
				{
					option,
				},
				{
					headers: {
						Authorization: user.sessionToken,
					},
				}
			)
			.then(() => setDone(true))
			.catch(() => {});
	};

	return (
		<Page title="Plus" breadcrumbs={<Breadcrumb.Item>Plus</Breadcrumb.Item>}>
			<Box>
				<Box.Header>Membership Status</Box.Header>
				<Box.Content className="space-y-3">
					{user.plus.active ? (
						<>
							<p>
								You have Alles+ until{" "}
								<strong className="border-b border-primary">
									{moment(user.plus.end).format("LL")}
								</strong>
								.
							</p>
							<p>
								Thanks for supporting Alles! If you have any feedback, let me
								know on{" "}
								<a
									href="https://micro.alles.cx/p/6cdce517-8658-4f5d-875a-e9b0cb3bb01c"
									className="text-primary"
								>
									Micro
								</a>
								!
							</p>
						</>
					) : (
						<p>
							It seems like you don't have Alles+. If you'd like to get a bunch
							of extra goodies across the platform, and help support us so we
							can keep the servers humming, we'd really appreciate if you joined
							:)
						</p>
					)}
				</Box.Content>
			</Box>

			<Box>
				<Box.Header>
					{user.plus.active ? "Extend" : "Start"} Membership
				</Box.Header>
				{done ? (
					<Box.Content className="space-y-3">
						{user.plus ? (
							<p>
								Thanks, {user.nickname}! You've just extended your subscription,
								so now you get to enjoy your Alles+ benefits for even longer :)
							</p>
						) : (
							<p>
								Welcome to the club, {user.nickname}! You now get to enjoy the
								great Alles+ benefits that we've had waiting for you :)
							</p>
						)}
					</Box.Content>
				) : (
					<Box.Content className="space-y-6">
						<p>
							You can start or extend your membership. It won't renew
							automatically, you can just come back here to add some time to it.
							You get Alles+ using Coins, which you can learn more about on{" "}
							<Link href="/coins">
								<a className="text-primary">the Coins page</a>
							</Link>
							. You have{" "}
							<strong className="border-b border-primary">
								{user.coins} coin{user.coins === 1 ? "" : "s"}
							</strong>{" "}
							right now.
						</p>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							{Object.keys(config.plusOptions).map((id) => {
								const option = config.plusOptions[id];
								return (
									<Button
										key={id}
										size="md"
										className="w-full"
										onClick={() => subscribe(id)}
										loading={loading}
										disabled={user.coins < option.coins}
									>
										{option.name} ({option.coins} coin
										{option.coins === 1 ? "" : "s"})
									</Button>
								);
							})}
						</div>
					</Box.Content>
				)}
			</Box>
		</Page>
	);
};

export default page;
