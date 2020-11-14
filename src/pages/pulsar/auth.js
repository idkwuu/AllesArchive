import { Breadcrumb, Box, Button } from "@alleshq/reactants";
import { Page } from "../../components/Page";
import axios from "axios";
import cookies from "next-cookies";
import Router, { withRouter } from "next/router";
import { useState } from "react";
import { useUser } from "../../utils/userContext";

const page = withRouter(({ token }) => {
	const user = useUser();
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const connect = () => {
		setLoading(true);
		axios
			.post(
				"/api/pulsar/connect",
				{
					token: token.token,
				},
				{
					headers: {
						Authorization: user.sessionToken,
					},
				}
			)
			.then(() => setSuccess(true))
			.catch(() => {});
	};

	return (
		<Page
			title="Sign in to Pulsar"
			breadcrumbs={[
				<Breadcrumb.Item key="pulsar">Pulsar</Breadcrumb.Item>,
				<Breadcrumb.Item key="connect">Connect</Breadcrumb.Item>,
			]}
			width="sm"
		>
			<h1 className="font-medium text-center mb-5 text-4xl">
				{success ? "Connected!" : "Connect to Pulsar"}
			</h1>

			<Box>
				<Box.Content className="px-5 py-6">
					{!token ? (
						<p>The connect token is invalid.</p>
					) : success ? (
						<p>All done - open Pulsar and start typing!</p>
					) : (
						<>
							<p>
								Would you like to link{" "}
								<span className="text-primary font-semibold">{token.name}</span>{" "}
								to your AllesID? Only continue if you just tried to sign in to
								Pulsar.
							</p>
							<div className="space-y-2 mt-5">
								<Button
									size="md"
									className="w-full"
									onClick={connect}
									loading={loading}
								>
									Let's go!
								</Button>
								<Button
									size="md"
									className="w-full"
									onClick={() => Router.push("/")}
									loading={loading}
									color="secondary"
								>
									Cancel
								</Button>
							</div>
						</>
					)}
				</Box.Content>
			</Box>
		</Page>
	);
});

page.getInitialProps = async (ctx) => {
	try {
		return {
			token: {
				token: ctx.query.token,
				...(
					await axios.get(
						`${
							process.env.NEXT_PUBLIC_ORIGIN
						}/api/pulsar/token?token=${encodeURIComponent(ctx.query.token)}`,
						{
							headers: {
								Authorization: cookies(ctx).sessionToken,
							},
						}
					)
				).data,
			},
		};
	} catch (err) {
		return {};
	}
};

export default page;
