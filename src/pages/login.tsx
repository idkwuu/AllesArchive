import {Box, Input, Button} from "@reactants/ui";
import {LogIn, Circle} from "react-feather";
import {useState, FormEvent} from "react";

export default () => {
	const [name, setName] = useState<string>();
	const [tag, setTag] = useState<string>();
	const [password, setPassword] = useState<string>();
	const [loading, setLoading] = useState<boolean>();
	const filterName = (u: string) => u.replace(/[^\w\s]/gi, "");
	const filterTag = (u: string) => u.replace(/[^\d]/gi, "");

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!name || !tag || !password) return;
		setLoading(true);
		setTimeout(() => setLoading(false), 1000);
	};

	return (
		<main className="sm:max-w-sm p-5 mx-auto mt-12 space-y-7">
			<h1 className="font-medium text-center mb-5 text-4xl">Sign In</h1>
			<Box>
				<Box.Header>Enter your credentials</Box.Header>
				<Box.Content className="px-5 py-6">
					<form action="POST" onSubmit={onSubmit} className="space-y-5">
						<label className="text-sm mb-2 block">
							Nametag<sup className="text-danger opacity-75"></sup>
						</label>

						<div className="flex space-x-3">
							<Input
								value={name}
								onChange={e => setName(filterName(e.target.value))}
								placeholder="jessica"
							/>

							<Input
								value={tag}
								onChange={e => setTag(filterTag(e.target.value))}
								placeholder="0001"
							/>
						</div>

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
