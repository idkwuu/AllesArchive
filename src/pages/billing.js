import { Page } from "../components/Page";
import { Breadcrumb } from "@alleshq/reactants";

const page = () => (
	<Page
		title="Billing"
		breadcrumbs={<Breadcrumb.Item>Billing</Breadcrumb.Item>}
	>
		<p>
			Hey! If you're looking for your billing settings, we've got good news and
			bad news!
		</p>
		<p>The bad news? The Alles Cat ate the page.</p>
		<p>
			The good news? We're transitioning from a subscription system tied to
			Stripe to our own system with Alles Coins. You'll be able to purchase them
			using normal money, cryptocurrencies, or earn them from xp, and use them
			to pay for Alles+, and other things in the future.
		</p>
		<p>
			We'll send you an email when we have an update for you. In the meantime,
			if you wish to cancel your Alles+ subscription, contact{" "}
			<a href="mailto:archie@abaer.dev" className="text-primary">
				archie@abaer.dev
			</a>{" "}
			:)
		</p>
	</Page>
);

export default page;
