import axios from "axios";
import { Box, Input, Button, Toast, Breadcrumb } from "@reactants/ui";
import { LogIn, Circle } from "react-feather";
import { useState, FormEvent } from "react";
import Router from "next/router";
import { ParsedUrlQuery } from "querystring";
import { Page } from "../components";

export default function Login({ query }: { query: ParsedUrlQuery }) {
	const [nametag, setNametag] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!password || nametag.split("#").length < 2) return;

		const splitNametag = nametag.split("#");
		const tag = splitNametag.pop();
		const name = splitNametag.join("#");
		if (tag.length !== 4 || !name) return;

		setError("");
		setLoading(true);

		try {
			const { token }: { token: string } = await axios
				.post("/api/login", {
					name,
					tag,
					password,
				})
				.then((res) => res.data);

			const date = new Date();
			const isProduction = process.env.NODE_ENV === "production";
			date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);

			const expires = `Expires=${date.toUTCString()};`;
			const domain = `Domain=${process.env.NEXT_PUBLIC_COOKIE_DOMAIN};`;
			const value = `sessionToken=${token};`;
			const security = isProduction ? `Secure; SameSite=None;` : "";
			const path = "Path=/;";
			const cookie = value + expires + domain + path + security;
			console.log(cookie);
			document.cookie = cookie;

			const location = query?.next?.toString() ?? "/";
			/^https?:\/\/|^\/\//i.test(location)
				? (window.location.href = location)
				: Router.push(location);
		} catch (error) {
			console.log(error);
			setError("The nametag or password entered is incorrect.");
			setLoading(false);
		}
	};

	return (
		<Page
			authenticated={false}
			breadcrumbs={
				<Breadcrumb.Item className="opacity-75 pointer-events-none select-none">
					Sign In
				</Breadcrumb.Item>
			}
		>
			<main className="sm:max-w-sm p-5 mx-auto mt-12 space-y-7">
				<h1 className="font-medium text-center mb-5 text-4xl">Sign In</h1>
				{error && <Toast color="danger" content={error} />}
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
