import { Breadcrumb, Box, Button } from "@alleshq/reactants";
import { Page } from "../components/Page";
import { useUser } from "../utils/userContext";
import config from "../config";
import { useState } from "react";
import axios from "axios";

const { NEXT_PUBLIC_STRIPE_PK: STRIPE_PK } = process.env;

const page = () => {
	const user = useUser();

	return (
		<Page title="Coins" breadcrumbs={<Breadcrumb.Item>Coins</Breadcrumb.Item>}>
			<div>
				<h4 className="font-medium text-3xl">Alles Coins</h4>
				<p>
					You currently have{" "}
					<strong className="border-b border-primary">
						{user.coins} coins
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

			<PurchaseCoins sessionToken={user.sessionToken} />

			<p>
				<strong>Note:</strong> It could take a couple of minutes for your coins
				to update after you purchase more. If something doesn't seem right,
				contact us!
			</p>
		</Page>
	);
};

const PurchaseCoins = ({ sessionToken }) => {
	const [loading, setLoading] = useState(false);

	const checkout = (option) => {
		setLoading(true);
		axios
			.post(
				"/api/coins/stripe",
				{ option },
				{
					headers: {
						Authorization: sessionToken,
					},
				}
			)
			.then(({ data }) =>
				Stripe(STRIPE_PK).redirectToCheckout({ sessionId: data.session })
			)
			.catch(() => {});
	};

	return (
		<Box>
			<script src="https://js.stripe.com/v3"></script>
			<Box.Header>Purchase Coins</Box.Header>
			<Box.Content className="space-y-6">
				<p>
					If you want, you can purchase some more coins here. This really helps
					to support Alles, so if you do, thanks a lot!
				</p>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
					{Object.keys(config.coinsOptions).map((id) => {
						const option = config.coinsOptions[id];
						return (
							<Button
								key={id}
								size="md"
								className="w-full"
								onClick={() => checkout(id)}
								loading={loading}
							>
								{option.coins} coins (${option.price / 100})
							</Button>
						);
					})}
				</div>
			</Box.Content>
			<Box.Footer>We use Stripe to process payments</Box.Footer>
		</Box>
	);
};

export default page;
