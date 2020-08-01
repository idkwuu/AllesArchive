import { Box, Input, Button } from "@reactants/ui";
import { LogIn, Circle } from "react-feather";
import { useState, FormEvent } from "react";
import axios from "axios";

export default () => {
	const [nametag, setNametag] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!nametag || !password || nametag.split("#").length < 2) return;
		const nt = nametag.split("#");
		const tag = nt.pop();
		const username = nt.join("#");
		if (tag.length !== 4) return;


		setLoading(true);
		axios.post("/api/login", {
			body: {
				name: username,
				tag
			}
		});
	};

	return (
		<main className="sm:max-w-sm p-5 mx-auto mt-12 space-y-7">
			<h1 className="font-medium text-center mb-5 text-4xl">Sign In</h1>
			<Box>
				<Box.Header>Enter your credentials</Box.Header>
				<Box.Content className="px-5 py-6">
					<form action="POST" onSubmit={onSubmit} className="space-y-5">
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
