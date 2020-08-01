import axios from "axios";
import { Box, Input, Button } from "@reactants/ui";
import { LogIn, Circle } from "react-feather";
import { useState, FormEvent } from "react";
import { Session } from "../types";

export default () => {
	const [nametag, setNametag] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!password || nametag.split("#").length < 2) return;

		const splitNametag = nametag.split("#");
		const tag = splitNametag.pop();
		const name = splitNametag.join("#");
		if (tag.length !== 4 || !name) return;

		setLoading(true);
		axios.post("/api/login", {
			name,
			tag,
			password,
		});
	};

	return (
		<main className="sm:max-w-sm p-5 mx-auto mt-12 space-y-7">
			<h1 className="font-medium text-center mb-5 text-4xl">Sign In</h1>
			<Box>
				<Box.Header>Enter your credentials</Box.Header>
				<Box.Content className="px-5 py-6">
					<form method="POST" onSubmit={onSubmit} className="space-y-5">
						<Input
							label="Nametag"
							value={nametag}
							onChange={e => setNametag(e.target.value)}
							placeholder="Jessica Adams#0001"
						/>

						<Input
							value={password}
							onChange={e => setPassword(e.target.value)}
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
	);
};
