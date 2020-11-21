import { Breadcrumb, Box, Button } from "@alleshq/reactants";
import { Page } from "../../components/Page";
import axios from "axios";
import cookies from "next-cookies";
import moment from "moment";

const page = ({ clients }) => (
	<Page title="Pulsar" breadcrumbs={<Breadcrumb.Item>Pulsar</Breadcrumb.Item>}>
		<Box>
			<Box.Content className="px-5 py-6">
				<p>
					Pulsar is an app built by Alles that allows you to search for what you
					need, perform tasks with a few keystrokes, and connect your system to
					your AllesID.
				</p>
				<Button
					size="md"
					className="mt-5 w-full"
					onClick={() => (location.href = "https://files.alles.cc/Pulsar")}
				>
					Install Pulsar
				</Button>
			</Box.Content>
		</Box>

		{clients
			.sort((a, b) => a.createdAt < b.createdAt)
			.map((client) => (
				<Box key={client.id}>
					<Box.Content>
						<h1 className="text-lg font-semibold">{client.name}</h1>
						<p className="text-sm font-light">
							Added {moment(client.createdAt).fromNow()}
						</p>
					</Box.Content>
				</Box>
			))}
	</Page>
);

page.getInitialProps = async (ctx) => {
	try {
		return (
			await axios.get(`${process.env.NEXT_PUBLIC_ORIGIN}/api/pulsar/clients`, {
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
