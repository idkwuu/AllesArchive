import { Box, Avatar, Input, Button, Breadcrumb } from "@alleshq/reactants";
import { Page } from "../components/Page";
import { useUser } from "../utils/userContext";
import { useState, createRef } from "react";
import axios from "axios";
import config from "../config";

const page = () => (
	<Page
		title="About Me"
		breadcrumbs={<Breadcrumb.Item>About Me</Breadcrumb.Item>}
	>
		<h4 className="font-medium text-3xl">About Me</h4>
		<Profile />
		<Username />
	</Page>
);

export default page;

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
			.post(
				"/api/profile",
				{
					nickname,
					tag,
				},
				{
					headers: {
						Authorization: user.sessionToken,
					},
				}
			)
			.then(() => {
				setError();
				setLoading(false);
			})
			.catch((err) => {
				if (err.response && err.response.data.err === "profile.tag.unavailable")
					setError("This tag is unavailable");
				else setError("Something went wrong");
				setLoading(false);
			});
	};

	return (
		<Box>
			<Box.Header>Basic Profile</Box.Header>
			<Box.Content className="space-y-10 md:space-y-5">
				<div className="flex justify-center">
					<AvatarUpload />
				</div>

				<Input
					label="Name"
					value={user.name}
					disabled
					note="If you need to change your name, please contact support"
				/>

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
					note={
						user.plus
							? "You can set your tag to any available number between 0001 and 9999 since you have Alles+"
							: "You'll need Alles+ to change your tag"
					}
				/>

				<Input
					label="Nickname"
					defaultValue={user.nickname}
					placeholder="Jessica"
					maxLength={config.maxNicknameLength}
					onChange={(e) => {
						setNickname(e.target.value.trim());
						setError();
					}}
					note="Your nickname will be used to refer to you and other users may see it"
				/>
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

const AvatarUpload = () => {
	const user = useUser();
	const input = createRef();
	const [r, setR] = useState(0);

	return (
		<div
			className="hover:opacity-50 duration-150 cursor-pointer"
			onClick={() => input.current.click()}
		>
			<Avatar
				src={`https://avatar.alles.cc/${user.id}?size=200&r=${r}`}
				size={200}
			/>

			<input
				ref={input}
				type="file"
				accept="image/png, image/jpeg"
				className="hidden"
				onChange={(e) => {
					const f = e.target.files[0];
					const reader = new FileReader();
					reader.onload = (e) =>
						axios
							.post(
								"/api/avatar",
								{
									image: e.target.result,
								},
								{
									headers: {
										Authorization: user.sessionToken,
									},
								}
							)
							.then(() => setR(Math.random()))
							.catch(() => {});
					reader.readAsDataURL(f);
				}}
			/>
		</div>
	);
};

const Username = () => {
	const user = useUser();
	const [error, setError] = useState();
	const [loading, setLoading] = useState(false);
	const [username, setUsername] = useState(user.username);
	const [disabled, setDisabled] = useState(
		user.username || user.xp.level < config.minUsernameLevel
	);

	const submit = () => {
		if (!username) return setError("Username not specified");
		if (username.length < config.minUsernameLength)
			return setError(
				`Usernames must be at least ${config.minUsernameLength} characters`
			);

		setLoading(true);
		axios
			.post(
				"/api/username",
				{ username },
				{
					headers: {
						Authorization: user.sessionToken,
					},
				}
			)
			.then(() => {
				setDisabled(true);
				setError();
				setLoading(false);
			})
			.catch((err) => {
				if (err.response) {
					if (err.response.data.err === "profile.username.unavailable")
						setError("This username is unavailable");
					else if (err.response.data.err === "profile.username.invalid")
						setError("Usernames must be alphanumeric");
					else setError("Something went wrong");
				} else setError("Something went wrong");
				setLoading(false);
			});
	};

	return (
		<Box>
			<Box.Content className="space-y-10 md:space-y-5">
				<Input
					label="Username"
					defaultValue={user.username ? user.username : undefined}
					placeholder="jessica"
					maxLength={config.maxUsernameLength}
					onChange={(e) => {
						setUsername(e.target.value.trim());
						setError();
					}}
					note={
						user.username
							? `Your username cannot be changed`
							: user.xp.level < config.minUsernameLevel
							? `You need to be on level ${config.minUsernameLevel} to claim a username`
							: `Choose wisely! Your username cannot be changed.`
					}
					disabled={disabled}
				/>
			</Box.Content>
			<Box.Footer className="flex items-center justify-between">
				<p className="text-danger">{error}</p>
				<Button
					size="sm"
					loading={loading}
					onClick={submit}
					disabled={disabled}
				>
					Save
				</Button>
			</Box.Footer>
		</Box>
	);
};
