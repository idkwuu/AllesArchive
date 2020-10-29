import { Page } from "../components/Page";
import { Box, Breadcrumb, Input, Button } from "@alleshq/reactants";
import { useUser } from "../utils/userContext";
import axios from "axios";
import cookies from "next-cookies";
import { useState } from "react";
import config from "../config";

const Billing = ({ billingData }) => (
	<Page
		title="Billing"
		breadcrumbs={<Breadcrumb.Item>Billing</Breadcrumb.Item>}
	>
		{billingData.registered ? (
			<>
				<Email email={billingData.email} />
				<Balance balance={billingData.balance} />
				<Portal />
			</>
		) : (
			<>
				<h4 className="font-medium text-3xl">Register for Billing</h4>
				<Email />
			</>
		)}
	</Page>
);

Billing.getInitialProps = async (ctx) => {
	try {
		const billingData = (
			await axios.get(`${process.env.NEXT_PUBLIC_ORIGIN}/api/billing`, {
				headers: {
					Authorization: cookies(ctx).sessionToken,
				},
			})
		).data;
		return { billingData };
	} catch (err) {
		return {};
	}
};

export default Billing;

const Email = ({ email: currentEmail }) => {
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
			<Box.Header>Email Address</Box.Header>
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

const Balance = ({ balance }) => {
	return (
		<Box>
			<Box.Header>Balance</Box.Header>
			<Box.Content>
				<p>
					Your account balance is currently ${((0 - balance) / 100).toFixed(2)}
				</p>
			</Box.Content>
		</Box>
	);
};

const Portal = () => {
	const [loading, setLoading] = useState(false);
	const user = useUser();

	const openPortal = () => {
		setLoading(true);
		axios
			.get("/api/billing/portal", {
				headers: {
					Authorization: user.sessionToken,
				},
			})
			.then((res) => (location.href = res.data.url))
			.catch(() => setLoading(false));
	};

	return (
		<Box>
			<Box.Header>Portal</Box.Header>
			<Box.Content>
				<p>
					You can manage your subscriptions and payment methods in the billing
					portal, which is hosted by our payments processor, Stripe.
				</p>
			</Box.Content>
			<Box.Footer className="flex items-center justify-end">
				<Button size="sm" loading={loading} onClick={openPortal}>
					Open
				</Button>
			</Box.Footer>
		</Box>
	);
};
