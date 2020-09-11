import { Page } from "../components/page";
import { Box, Breadcrumb, Input, Button } from "@alleshq/reactants";
import { useUser } from "../utils/userContext";
import axios from "axios";
import cookies from "next-cookies";
import { useState } from "react";
import config from "../config";

const Billing = ({ billingData }) => {
	const [loading, setLoading] = useState(false);
	const user = useUser();
	const [plusActive, setPlusActive] = useState(user.plus);

	return (
		<Page
			title="Billing"
			breadcrumbs={<Breadcrumb.Item>Billing</Breadcrumb.Item>}
		>
			<main className="sm:max-w-2xl p-5 mx-auto space-y-7">
				{billingData ? (
					<>
						<BillingInfo email={billingData.email} />
						{/*
						<Box>
							<Box.Header>Customer Portal</Box.Header>
							<Box.Content>
								<p
									style={{
										marginBottom: 50,
										textAlign: "center",
									}}
								>
									You can manage your payment methods and subscriptions in the
									customer portal.
								</p>
								<Button
									loading={loading}
									primary
									fluid
									onClick={() => {
										setLoading(true);
										axios
											.get(`${process.env.NEXT_PUBLIC_APIURL}/billing/portal`, {
												headers: {
													authorization: props.user.sessionToken,
												},
											})
											.then((res) => (location.href = res.data.url));
									}}
								>
									Go
								</Button>
							</Box.Content>
						</Box>

						<Box>
							<Box.Header>Alles+</Box.Header>
							<Box.Content>
								<p>
									<strong>Status:</strong>{" "}
									{plusActive ? "Active 😃" : "Inactive 😦"}
								</p>
								{user.plus && !billingData.plusSubscription ? (
									<p style={{ color: "var(--accents-6)", fontStyle: "italic" }}>
										You have Alles+, but no active subscriptions!
									</p>
								) : (
									<></>
								)}
								{!user.plus && billingData.plusSubscription ? (
									<p style={{ color: "var(--danger)" }}>
										You have an active subscription, but Alles+ has not been
										applied to your account! Please contact support to resolve
										this issue. If you've just purchased Alles+, you might have
										to wait a few minutes.
									</p>
								) : (
									<></>
								)}
								<p>
									Alles+ gives you a bunch of exclusive features across the
									Alles platform, and it helps to support the development of
									Alles!
								</p>
								<p>
									A standard Alles+ subscription only applies to your primary
									account, but for only a little more, you can get Alles+ Max,
									which gives Alles+ to your primary account, and all of your
									secondary accounts.
								</p>
								<p>
									If you try to purchase a subscription without any payment
									methods set up and you have no credit, it will probably fail.
								</p>
								{user.plus || billingData.plusSubscription ? (
									<p>
										To manage your Alles+ subscription, visit the Customer
										Portal.
									</p>
								) : (
									<GetPlus
										sessionToken={user.sessionToken}
										showBanner={showBanner}
										onSubscribe={() => setPlusActive(true)}
									/>
								)}
							</Box.Content>
						</Box>
                                */}
					</>
				) : (
					<BillingInfo />
				)}
			</main>

			<style jsx>{`
				h1 {
					font-size: 30px;
					text-align: center;
				}
			`}</style>
		</Page>
	);
};

Billing.getInitialProps = async (ctx) => {
	try {
		const billingData = (
			await axios.get(`${process.env.NEXT_PUBLIC_ORIGIN}/api/billing`, {
				headers: {
					Authorization: cookies(ctx).sessionToken,
				},
			})
		).data;
		return billingData.registered ? { billingData } : {};
	} catch (err) {
		return {};
	}
};

export default Billing;

const plans = {
	monthly: "Alles+ ($5/month)",
	yearly: "Alles+ ($50/year)",
	"monthly-max": "🔥 Alles+ Max ($8/month)",
	"yearly-max": "🔥 Alles+ Max ($80/year)",
};

const GetPlus = ({ sessionToken, showBanner, onSubscribe }) => {
	const [plan, setPlan] = useState();
	const [loading, setLoading] = useState(false);
	const [purchased, setPurchased] = useState(false);

	const PlanButton = ({ id }) => (
		<Button fluid onClick={() => setPlan(id)}>
			{plans[id]}
		</Button>
	);

	const purchase = () => {
		setLoading(true);

		axios
			.post(
				`${process.env.NEXT_PUBLIC_APIURL}/billing/plus?plan=${plan}`,
				{},
				{
					headers: {
						authorization: sessionToken,
					},
				}
			)
			.then(() => {
				setPurchased(true);
				onSubscribe();
			})
			.catch(() => {
				setLoading(false);
				showBanner("Something went wrong while subscribing to Alles+");
			});
	};

	return purchased ? (
		<div>
			<p>
				<strong>You are now subscribed to Alles+!</strong>
			</p>

			<p>
				Welcome to the club! You can make changes to your subscription in the
				Customer Portal.
			</p>

			<style jsx>{`
				div {
					margin-top: 50px;
				}

				p {
					text-align: center;
				}
			`}</style>
		</div>
	) : plan ? (
		<div>
			<p>
				Are you sure you want to subscribe to <strong>{plans[plan]}</strong>?
			</p>

			<Button primary fluid onClick={() => purchase()} loading={loading}>
				Let's do it!
			</Button>

			<Spacer y={0.5} />

			<Button secondary fluid onClick={() => setPlan()} loading={loading}>
				No, I don't want to support Alles
			</Button>

			<p className="footnote">
				You will be charged the specified price immediately. The subscription
				will automatically renew, but you can change plans or manage your
				subscription in the Customer Portal.
			</p>

			<style jsx>{`
				div {
					margin-top: 50px;
				}

				p {
					text-align: center;
				}

				.footnote {
					font-size: 12px;
					color: var(--accents-6);
				}
			`}</style>
		</div>
	) : (
		<div>
			<PlanButton id="monthly" />
			<PlanButton id="yearly" />
			<PlanButton id="monthly-max" />
			<PlanButton id="yearly-max" />

			<style jsx>{`
				div {
					margin-top: 50px;
					display: grid;
					grid-template-columns: calc(50% - 5px) calc(50% - 5px);
					grid-template-rows: 50% 50%;
					grid-gap: 10px;
				}

				.plan {
					padding: 10px;
				}
			`}</style>
		</div>
	);
};

const BillingInfo = ({ email: currentEmail }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState();
	const [email, setEmail] = useState(currentEmail);
	const user = useUser();

	const submit = (e) => {
		e.preventDefault();
		if (loading || !email) return;

		setLoading(true);
		axios
			.post(
				"/api/billing/update",
				{ email },
				{
					headers: {
						Authorization: user.sessionToken,
					},
				}
			)
			.then(() => {
				setError();
				if (currentEmail) setLoading(false);
				else location.reload();
			})
			.catch((err) => {
				if (err.response && err.response.data.err === "email.invalid")
					setError("This email address can't be used");
				else setError("Something went wrong");
				setLoading(false);
			});
	};

	return (
		<Box>
			<Box.Header>{currentEmail ? "Email" : "Register for Billing"}</Box.Header>
			<Box.Content>
				<form onSubmit={submit}>
					<Input
						label="Billing Email"
						maxLength={config.maxEmailLength}
						placeholder="jessica@alles.cx"
						defaultValue={currentEmail}
						onChange={(e) => {
							setError();
							setEmail(e.target.value.trim());
						}}
					/>
				</form>
			</Box.Content>
			<Box.Footer className="flex items-center justify-between">
				<p className={error && "text-danger"}>
					{error
						? error
						: !currentEmail && (
								<>
									We store your payment information securely in{" "}
									<a
										href="https://stripe.com"
										className="text-primary"
										target="_blank"
									>
										Stripe
									</a>
									.
								</>
						  )}
				</p>
				<Button size="sm" loading={loading} onClick={submit}>
					{currentEmail ? "Save" : "Register"}
				</Button>
			</Box.Footer>
		</Box>
	);
};
