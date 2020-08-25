import axios from "axios";
import {
	Box,
	Input,
	Button,
	Toast,
	Breadcrumb,
	Transition,
} from "@alleshq/reactants";
import { LogIn, Circle } from "react-feather";
import { useState, FormEvent } from "react";
import Router from "next/router";
import { ParsedUrlQuery } from "querystring";
import { set as setCookie } from "es-cookie";
import { Page } from "../components";

export default function Login({ query }: { query: ParsedUrlQuery }) {
	const [nametag, setNametag] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const [showError, setShowError] = useState<boolean>(false);

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!password || nametag.split("#").length < 2) return;

		const splitNametag = nametag.split("#");
		const tag = splitNametag.pop();
		const name = splitNametag.join("#");
		if (tag.length !== 4 || !name) return;

		setShowError(false);
		setLoading(true);

		try {
			const { token }: { token: string } = await axios
				.post("/api/login", {
					name,
					tag,
					password,
				})
				.then((res) => res.data);

			const isProduction = process.env.NODE_ENV === "production";
			const domain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN;
			setCookie("sessionToken", token, {
				expires: 365,
				...(isProduction && {
					domain,
					sameSite: "none",
					secure: true,
				}),
			});

			const location = query?.next?.toString() ?? "/";
			/^https?:\/\/|^\/\//i.test(location)
				? (window.location.href = location)
				: Router.push(location);
		} catch (error) {
			setError("The nametag or password entered is incorrect.");
			setShowError(true);
			setLoading(false);
		}
	};

	return (
		<Page
			authenticated={false}
			title="Sign in"
			breadcrumbs={
				<Breadcrumb.Item className="opacity-75 pointer-events-none select-none">
					Sign In
				</Breadcrumb.Item>
			}
		>
			<main className="sm:max-w-sm p-5 mx-auto space-y-7">
				<h1 className="font-medium text-center mb-5 text-4xl">Sign In</h1>

				<Transition
					show={showError}
					enter="transition ease-out duration-100 transform"
					enterFrom="opacity-0 scale-95"
					enterTo="opacity-100 scale-100"
					leave="transition ease-in duration-75 transform"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-0 scale-95"
				>
					<Toast color="danger" content={error} />
				</Transition>

				<Box>
					<Box.Header>Enter your credentials</Box.Header>
					<Box.Content className="px-5 py-6">
						<form method="POST" onSubmit={onSubmit} className="space-y-5">
							<Input
								label="Nametag"
								value={nametag}
								onChange={(e) => setNametag(e.target.value)}
								placeholder="Jessica Adams#0001"
							/>

							<Input
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								label="Password"
								type="password"
								placeholder="••••••••••"
							/>

							<Button
								loading={loading}
								icon={<LogIn />}
								size="lg"
								className="w-full"
								color="primary"
							>
								Sign In
							</Button>
						</form>
					</Box.Content>
				</Box>

				<Box>
					<Box.Header>Sign in another way</Box.Header>
					<Box.Content className="space-y-5 px-5 py-6">
						<Button
							disabled={true}
							icon={<Circle />}
							size="lg"
							className="w-full"
							color="inverted"
						>
							Sign In With Pulsar
						</Button>
					</Box.Content>
				</Box>
			</main>
		</Page>
	);
}

Login.getInitialProps = ({ query }) => {
	return { query };
};
