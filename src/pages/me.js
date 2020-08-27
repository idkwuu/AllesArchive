import { Box, Input, Button } from "@alleshq/reactants";
import { Page } from "../components/page";
import { useUser } from "../utils/userContext";
import { useState } from "react";
import axios from "axios";

export default function AboutMe() {
	return (
		<Page>
			<main className="sm:max-w-2xl p-5 mx-auto space-y-7">
				<h4 className="font-medium text-3xl">About Me</h4>

				<Profile />
			</main>
		</Page>
	);
}

const Profile = () => {
	const user = useUser();
	const [error, setError] = useState();
	const [loading, setLoading] = useState(false);
	const [tag, setTag] = useState(user.tag);
	const [nickname, setNickname] = useState(user.nickname);

	const submit = () => {
		if (tag.length !== 4) return setError("Tag must be 4 digits");
		if (isNaN(tag)) return setError("Tag must be a number");
		if (Number(tag) < 1 || Number(tag) > 9999)
			return setError("Tag must be between 0001 and 9999");
		if (!Number.isInteger(Number(tag)))
			return setError("Tag must be an integer");
		if (!nickname) return setError("Nickname not specified");

		setLoading(true);
		axios
			.post("/api/profile", {
				headers: {
					authorization: user.sessionToken,
				},
			})
			.then(() => {
				setError();
				setLoading(false);
			})
			.catch(() => {
				setError("Something went wrong");
				setLoading(false);
			});
	};

	return (
		<Box>
			<Box.Header>Basic Profile</Box.Header>
			<Box.Content className="space-y-5">
				<div>
					<Input label="Name" value={user.name} disabled />
					<p className="mx-5 mt-2 text-xs text-gray-500 dark:text-gray-300">
						If you need to change your name, please contact support
					</p>
				</div>
				<div>
					<Input
						label="Tag"
						defaultValue={user.tag}
						placeholder="0000"
						disabled={!user.plus}
						maxLength={4}
						onChange={(e) => {
							setTag(e.target.value);
							setError();
						}}
					/>
					<p className="mx-5 mt-2 text-xs text-gray-500 dark:text-gray-300">
						{user.plus
							? "You can set your tag to any available number between 0001 and 9999 since you have Alles+"
							: "You'll need Alles+ to change your tag"}
					</p>
				</div>
				<div>
					<Input
						label="Nickname"
						defaultValue={user.nickname}
						placeholder="Jessica"
						onChange={(e) => {
							setNickname(e.target.value.trim());
							setError();
						}}
					/>
					<p className="mx-5 mt-2 text-xs text-gray-500 dark:text-gray-300">
						Your nickname will be used to refer to you and other users may see
						it
					</p>
				</div>
			</Box.Content>
			<Box.Footer className="flex items-center justify-between">
				<p className="text-danger">{error}</p>
				<Button size="sm" loading={loading} onClick={submit}>
					Save
				</Button>
			</Box.Footer>
		</Box>
	);
};
