import { Breadcrumb, Box } from "@alleshq/reactants";
import { Page } from "../components/Page";
import { useUser } from "../utils/userContext";

const page = () => {
	const user = useUser();

	return (
		<Page title="Coins" breadcrumbs={<Breadcrumb.Item>Coins</Breadcrumb.Item>}>
			<div>
				<h4 className="font-medium text-3xl">Alles Coins</h4>
				<p>
					You currently have{" "}
					<strong className="border-b border-primary">
						{user.coins} coin{user.coins === 1 ? "" : "s"}
					</strong>
					.
				</p>
			</div>

			<p>
				Coins are how you can get more stuff from Alles. You use them to
				purchase upgrades such as Alles+, and you can purchase them whenever you
				want, or earn them with xp.
			</p>

			<Box>
				<Box.Content className="space-y-3">
					<div className="flex space-x-5">
						<p className="flex-grow">Level {user.xp.level}</p>
						<p className="text-right">{user.xp.total} xp</p>
					</div>

					<div className="w-full h-5 rounded-full overflow-hidden border border-gray-200 bg-gray-100 dark:border-gray-600 dark:bg-gray-700">
						<div
							className="h-full bg-primary"
							style={{
								width: `${user.xp.levelProgress * 100}%`,
							}}
						/>
					</div>
				</Box.Content>
				<Box.Footer>You earn 10 coins every time you level up</Box.Footer>
			</Box>
		</Page>
	);
};

export default page;
