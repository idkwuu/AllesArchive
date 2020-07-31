import { Box, Input, Button } from "@reactants/ui";
import { LogIn, Circle } from "react-feather";
import { useState, FormEvent } from "react";

export default () => {
	const [nametag, setNametag] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!nametag || !password) return;
		setLoading(true);
		fetch("/api/login", {
			method: "POST",
			body: JSON.stringify({ nametag, password }),
			headers: [["Content-Type", "application/json"]],
		});
	};

	const updateNametag = (value: string) => {
		const isLastCharSeperator = value[value.length - 1] == "#";
		const hasOneSeperator = value.split("#").length - 1 === 1;
		const isFirstCharLetter =
			((value[0] || "").match(/\w/gi) || []).length >= 1;

		// TODO: These two need to actually set the nametag minus the excluded value
		// or the behaviour of the cursor is strange.
		if (value.includes("#") && !hasOneSeperator) return;
		if (isLastCharSeperator && !isFirstCharLetter) return;

		if (isLastCharSeperator && hasOneSeperator) return setNametag(value);
		if (!value.includes("#")) return setNametag(value.replace(/[^\w# ]/gi, ""));

		const splitTokens = value.split("#");
		if (splitTokens[1].length >= 5) return;
		const tokens = splitTokens[0] + "#" + splitTokens[1].replace(/[^\d]/gi, "");
		setNametag(tokens);
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
							onChange={e => updateNametag(e.target.value)}
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
