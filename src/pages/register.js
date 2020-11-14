import { Box, Button, Breadcrumb } from "@alleshq/reactants";
import { Page } from "../components/Page";

const page = () => {
	return (
		<Page
			authenticated={false}
			title="Sign up"
			breadcrumbs={
				<Breadcrumb.Item className="opacity-75 pointer-events-none select-none">
					Sign up
				</Breadcrumb.Item>
			}
			width="sm"
		>
			<h1 className="font-medium text-center mb-5 text-4xl">Join Alles!</h1>

			<Box>
				<Box.Content className="px-5 py-6">
					<p>
						Sorry, you can't make an account here just yet, but you can ask and
						if we're feeling nice, we'll probably make you one!
					</p>
					<div className="space-y-2 mt-5">
						<Button
							size="md"
							className="w-full"
							onClick={() => (location.href = "https://alles.link/discord")}
						>
							Join our Discord
						</Button>
						<Button
							size="md"
							className="w-full"
							onClick={() => (location.href = "https://alles.link/twitterdm")}
						>
							DM us on Twitter
						</Button>
					</div>
				</Box.Content>
			</Box>
		</Page>
	);
};

export default page;
