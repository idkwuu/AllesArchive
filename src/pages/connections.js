import { Box, Breadcrumb } from "@alleshq/reactants";
import { Page } from "../components/page";
import axios from "axios";
import cookies from "next-cookies";

const Connections = ({ discord }) => {
	return (
		<Page
			title="Connected Accounts"
			breadcrumbs={<Breadcrumb.Item>Connected Accounts</Breadcrumb.Item>}
		>
			<main className="sm:max-w-2xl p-5 mx-auto space-y-7">
				<Box>
					<Box.Header>Discord</Box.Header>
					<Box.Content className="space-y-5">
						<p>
							{discord ? (
								<>
									Your AllesID is connected to{" "}
									<strong>
										{discord.username}#{discord.discriminator}
									</strong>
									. If you haven't already, you should join our{" "}
									<a href="https://alles.link/discord" className="text-primary">
										discord server
									</a>
									!
								</>
							) : (
								<>
									Your AllesID isn't yet connected to a discord account. To link
									your discord account, join our{" "}
									<a href="https://alles.link/discord" className="text-primary">
										discord server
									</a>{" "}
									and follow the instructions there.
								</>
							)}
						</p>
					</Box.Content>
				</Box>
			</main>
		</Page>
	);
};

Connections.getInitialProps = async (ctx) => {
	return (
		await axios.get(`${process.env.NEXT_PUBLIC_ORIGIN}/api/connections`, {
			headers: {
				Authorization: cookies(ctx).sessionToken,
			},
		})
	).data;
};

export default Connections;
