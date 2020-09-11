import { Box, Input, Button, Breadcrumb } from "@alleshq/reactants";
import { Page } from "../components/page";
import { useUser } from "../utils/userContext";
import { useState, createRef } from "react";
import axios from "axios";
import config from "../config";

export default function SigningIn() {
	return (
		<Page
			title="Signing in"
			breadcrumbs={<Breadcrumb.Item>Signing in</Breadcrumb.Item>}
		>
			<main className="sm:max-w-2xl p-5 mx-auto space-y-7">
				<h4 className="font-medium text-3xl">Signing in</h4>

				<Password />
			</main>
		</Page>
	);
}

const Password = () => {
	const user = useUser();
	const [error, setError] = useState();
	const [loading, setLoading] = useState(false);
	const [oldPass, setOldPass] = useState("");
	const [newPass, setNewPass] = useState("");
	const [newPass2, setNewPass2] = useState("");
	const form = createRef();

	const submit = (e) => {
		e.preventDefault();
		if (loading || !oldPass || !newPass || !newPass2) return;
		if (newPass !== newPass2) return setError("New passwords do not match");
		if (oldPass === newPass)
			return setError("You can't set your new password to your old one!");

		const f = form.current;
		setLoading(true);
		axios
			.post(
				"/api/password",
				{
					oldPass,
					newPass,
				},
				{
					headers: {
						Authorization: user.sessionToken,
					},
				}
			)
			.then(() => {
				setError();
				f.reset();
				setLoading(false);
			})
			.catch((err) => {
				if (err.response && err.response.data.err === "user.password.incorrect")
					setError("The old password is not correct");
				else setError("Something went wrong");
				setLoading(false);
			});
	};

	return (
		<Box>
			<Box.Header>Change Password</Box.Header>
			<Box.Content>
				<form method="POST" onSubmit={submit} className="space-y-5" ref={form}>
					<Input
						label="Old Password"
						type="password"
						maxLength={config.maxPasswordLength}
						onChange={(e) => {
							setOldPass(e.target.value);
							setError();
						}}
					/>

					<Input
						label="New Password"
						type="password"
						maxLength={config.maxPasswordLength}
						onChange={(e) => {
							setNewPass(e.target.value);
							setError();
						}}
					/>

					<Input
						label="Confirm Password"
						type="password"
						maxLength={config.maxPasswordLength}
						onChange={(e) => {
							setNewPass2(e.target.value);
							setError();
						}}
					/>
				</form>
			</Box.Content>
			<Box.Footer className="flex items-center justify-between">
				<p className="text-danger">{error}</p>
				<Button size="sm" loading={loading} onClick={submit}>
					Update
				</Button>
			</Box.Footer>
		</Box>
	);
};
