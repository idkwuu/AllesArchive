import axios from "axios";
import { Box, Input, Button, Toast } from "@reactants/ui";
import { LogIn, Circle } from "react-feather";
import { useState, FormEvent } from "react";
import cookies from "js-cookie";

export default function Login() {
	const [nametag, setNametag] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const [nametagError, setNametagError] = useState<string>("");
	const [passwordError, setPasswordError] = useState<string>("");

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!password || nametag.split("#").length < 2) return;

		const splitNametag = nametag.split("#");
		const tag = splitNametag.pop();
		const name = splitNametag.join("#");
		if (tag.length !== 4 || !name) return;

		setError("");
		setLoading(true);
		axios
			.post("/api/login", {
				name,
				tag,
				password,
			})
			.then(res => {
				cookies.set("sessionToken", res.data.token, {
					domain: process.env.NODE_ENV === "production" ? "alles.cx" : null,
					expires: 365,
				});
				location.href = "/";
			})
			.catch(() => {
				setError("The username or password entered is incorrect");
				setLoading(false);
			});
	};

	const REQUIRED_FIELD = (field: string) => `${field} is a required field.`;
	const INVALID_FIELD = (field: string) => `${field} is invalid or malformed.`;

	const validateNametag = ({ target }: React.FocusEvent<HTMLInputElement>) => {
		if (target.value === "") setNametagError(REQUIRED_FIELD("Nametag"));
		else if (!target.value.includes("#"))
			setNametagError(INVALID_FIELD("Nametag"));
		else setNametagError("");
	};

	const updateNametag = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNametag(e.target.value);
		validateNametag({ target: e.target } as any);
	};

	return (
		<main className="sm:max-w-sm p-5 mx-auto mt-12 space-y-7">
			<h1 className="font-medium text-center mb-5 text-4xl">Sign In</h1>
			{error && <Toast color="danger" content={error} />}
			<Box>
				<Box.Header>Enter your credentials</Box.Header>
				<Box.Content className="px-5 py-6">
					<form method="POST" onSubmit={onSubmit} className="space-y-7">
						<div className="space-y-2">
							<Input
								label="Nametag"
								value={nametag}
								onChange={e => updateNametag(e)}
								placeholder="Jessica Adams#0001"
								errored={!!nametagError}
								note={nametagError}
								onBlur={validateNametag}
								hasNote={true}
							/>

							<Input
								value={password}
								onChange={e => setPassword(e.target.value)}
								label="Password"
								type="password"
								placeholder="••••••••••"
								errored={!!passwordError}
								note={passwordError}
							/>
						</div>

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
}
