import { Page } from "../components/page";
import { Box, Breadcrumb, Button } from "@alleshq/reactants";
import { useUser } from "../utils/userContext";
import axios from "axios";
import cookies from "next-cookies";
import { useState } from "react";
import Link from "next/link";
import moment from "moment";

const Plus = ({ subscription }) => {
	const user = useUser();

	return (
		<Page title="Plus" breadcrumbs={<Breadcrumb.Item>Plus</Breadcrumb.Item>}>
			<main className="sm:max-w-2xl p-5 mx-auto space-y-7">
				{user.plus ? (
					<>
						<SubscriptionStatus subscription={subscription} />
					</>
				) : !subscription.registered ? (
					<NotRegistered />
				) : subscription.plan ? (
					<SubscriptionError />
				) : (
					<JoinPlus />
				)}
			</main>
		</Page>
	);
};

Plus.getInitialProps = async (ctx) => {
	try {
		const subscription = (
			await axios.get(`${process.env.NEXT_PUBLIC_ORIGIN}/api/plus`, {
				headers: {
					Authorization: cookies(ctx).sessionToken,
				},
			})
		).data;
		return { subscription };
	} catch (err) {
		return {};
	}
};

export default Plus;

const NotRegistered = () => (
	<Box>
		<Box.Header>Join Alles+</Box.Header>
		<Box.Content>
			<p>
				It seems you aren't registered in our billing system. If you want to get
				Alles+, you'll need to visit the{" "}
				<Link href="/billing">
					<a className="text-primary">billing page</a>
				</Link>{" "}
				and register yourself first.
			</p>
		</Box.Content>
	</Box>
);

const SubscriptionError = () => (
	<Box>
		<Box.Header>Oh no!</Box.Header>
		<Box.Content>
			<p>
				Something is probably broken, because you have an active Alles+
				subscription, but your AllesID doesn't have plus features enabled. If
				you purchased Alles+ within the last few minutes, wait a bit and see if
				it fixes itself, otherwise contact{" "}
				<a href="mailto:archie@abaer.dev" className="text-primary">
					archie@abaer.dev
				</a>{" "}
				and we'll sort it out!
			</p>
		</Box.Content>
	</Box>
);

const JoinPlus = () => {
	const [loading, setLoading] = useState(false);
	const [plus, setPlus] = useState(false);
	const [error, setError] = useState();
	const user = useUser();

	const subscribe = (plan) => {
		setLoading(true);
		setError();
		axios
			.post(
				"/api/plus/subscribe",
				{
					plan,
				},
				{
					headers: {
						Authorization: user.sessionToken,
					},
				}
			)
			.then(() => setPlus(true))
			.catch(() => {
				setError(
					"Something went wrong! Make sure you have an active payment method set in the billing portal."
				);
				setLoading(false);
			});
	};

	return (
		<Box>
			<Box.Header>Join Alles+</Box.Header>
			{plus ? (
				<Box.Content>
					<p>
						Welcome to the club! Your Alles+ subscription gives you a ton of
						benefits, and we're really happy you've decided to support us!
					</p>
				</Box.Content>
			) : (
				<Box.Content className="space-y-6">
					<p>
						Alles+ gets you cool features such as a custom tag, larger image
						uploads, and early access to new services, and helps support the
						development and operating costs of the platform! You'll also get a
						special role in our{" "}
						<a href="https://alles.link/discord" className="text-primary">
							discord server
						</a>
						!
					</p>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<Button
							size="md"
							className="w-full"
							onClick={() => subscribe("monthly")}
							loading={loading}
						>
							Join Alles+ Monthly ($5/month)
						</Button>

						<Button
							size="md"
							className="w-full"
							onClick={() => subscribe("yearly")}
							loading={loading}
						>
							Join Alles+ Yearly ($50/year)
						</Button>
					</div>
					{error ? <p className="text-danger">{error}</p> : <></>}
				</Box.Content>
			)}
		</Box>
	);
};

const SubscriptionStatus = ({ subscription }) => (
	<Box>
		<Box.Header>Subscription Status</Box.Header>
		<Box.Content className="space-y-3">
			{subscription.registered && subscription.plan ? (
				<>
					<p>
						You are subscribed to the {subscription.plan} plan. Your
						subscription will {subscription.renew ? "renew" : "end"} on{" "}
						{moment(subscription.end * 1000).format("LL")}. If you need to
						update your subscription or payment methods, see the{" "}
						<Link href="/billing">
							<a className="text-primary">billing page</a>
						</Link>
						.
					</p>
					<p>
						Thanks for supporting Alles! If you have any feedback, @ me on{" "}
						<a href="https://micro.alles.cx/Archie" className="text-primary">
							Micro
						</a>
						!
					</p>
				</>
			) : (
				<p>
					Your Alles+ status isn't connected to a subscription in our payments
					system.
				</p>
			)}
		</Box.Content>
	</Box>
);
