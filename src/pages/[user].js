import { Page } from "../components/Page";
import { withRouter } from "next/router";
import { Breadcrumb, Avatar, Box } from "@alleshq/reactants";
import axios from "axios";
import NotFound from "./404";
import { MicroPost } from "../components/MicroPost";
import cookies from "next-cookies";
import { useState, useEffect } from "react";
import moment from "moment";
import { Map, Award, AtSign, Play, Pause } from "react-feather";
import countries from "../data/countries";

const UserPage = withRouter(({ user: u }) => {
	if (!u) return <NotFound />;

	return (
		<Page
			title={u.name}
			breadcrumbs={
				<Breadcrumb.Item>
					<Avatar src={`https://avatar.alles.cc/${u.id}?size=25`} size={25} />
				</Breadcrumb.Item>
			}
			head={
				<>
					<meta property="og:title" content={u.name} />
					<meta
						name="og:description"
						content={`${u.nickname} uses Alles, and you should too!`}
					/>
					<meta
						property="og:url"
						content={`${process.env.NEXT_PUBLIC_ORIGIN}/${u.id}`}
					/>
					<meta property="og:type" content="profile" />
					<meta
						property="og:image"
						content={`${process.env.NEXT_PUBLIC_ORIGIN}/api/users/${u.id}/img`}
					/>

					<meta name="twitter:card" content="summary_large_image" />
					<meta name="twitter:site" content="@alleshq" />
				</>
			}
		>
			<div
				className="flex space-x-5"
				style={{
					minHeight: 180,
				}}
			>
				<div className="flex-shrink-0">
					<Avatar src={`https://avatar.alles.cc/${u.id}?size=150`} size={150} />
				</div>
				<div className="min-w-0 space-y-2">
					<div>
						<h1 className="text-3xl font-medium mt-2">
							{u.name}
							<span className="text-primary text-sm">#{u.tag}</span>
						</h1>
						{u.country && countries[u.country] && (
							<InfoLabel icon={Map}>{countries[u.country]}</InfoLabel>
						)}
						<InfoLabel icon={Award}>
							Level {u.xp.level} ({u.xp.total}xp)
						</InfoLabel>
						{u.username && <InfoLabel icon={AtSign}>{u.username}</InfoLabel>}
					</div>

					<Status id={u.id} />
				</div>
			</div>

			<Music id={u.id} />

			{u.micro && u.micro.latest && (
				<div>
					<MicroPost
						url={`https://micro.alles.cx/p/${u.micro.latest.id}`}
						authorId={u.id}
						authorName={u.name}
						authorPlus={u.plus}
						score={u.micro.latest.vote.score}
						content={u.micro.latest.content}
						image={u.micro.latest.image}
						link={u.micro.latest.url}
						date={u.micro.latest.createdAt}
						replies={u.micro.latest.children.count}
					/>
					<div className="flex justify-between p-5">
						<p>
							<strong>{u.micro.followers}</strong> Follower
							{u.micro.followers === 1 ? "" : "s"}
						</p>
						<p>
							<strong>{u.micro.posts}</strong> Post
							{u.micro.posts === 1 ? "" : "s"}
						</p>
					</div>
				</div>
			)}
		</Page>
	);
});

UserPage.getInitialProps = async (ctx) => {
	let id = ctx.query.user;
	const { sessionToken } = cookies(ctx);

	try {
		if (id.length < 36)
			id = (
				await axios.get(
					`${process.env.NEXT_PUBLIC_ORIGIN}/api/username/${encodeURIComponent(
						id
					)}`
				)
			).data.id;
	} catch (err) {}

	try {
		return {
			user: (
				await axios.get(
					`${process.env.NEXT_PUBLIC_ORIGIN}/api/users/${encodeURIComponent(
						id
					)}`,
					{
						headers: sessionToken
							? {
									Authorization: sessionToken,
							  }
							: {},
					}
				)
			).data,
		};
	} catch (err) {
		if (ctx.res) ctx.res.statusCode = 404;
		return {};
	}
};

export default UserPage;

const InfoLabel = ({ icon: Icon, children }) => (
	<p className="flex text-gray-700 dark:text-gray-300">
		<Icon className="text-primary mr-1 my-auto" height={18} /> {children}
	</p>
);

const Status = ({ id }) => {
	const [status, setStatus] = useState();
	useEffect(() => {
		const fetchStatus = async () => {
			try {
				setStatus(
					(await axios.get(`https://wassup.alles.cc/${encodeURIComponent(id)}`))
						.data.status
				);
			} catch (err) {}
		};
		fetchStatus();
		const interval = setInterval(fetchStatus, 5000);
		return () => clearInterval(interval);
	}, []);

	return status ? (
		<div>
			<p className="italic break-words">“{status.content}”</p>
			<p className="text-xs text-gray-600 dark:text-gray-400">
				{moment(status.date).fromNow()}
			</p>
		</div>
	) : (
		<></>
	);
};

const Music = ({ id }) => {
	const [music, setMusic] = useState();
	useEffect(() => {
		const fetchMusic = async () => {
			try {
				setMusic(
					(
						await axios.get(
							`https://spotify.alles.cc/alles/${encodeURIComponent(id)}`
						)
					).data
				);
			} catch (err) {}
		};
		fetchMusic();
		const interval = setInterval(fetchMusic, 5000);
		return () => clearInterval(interval);
	}, []);
	if (!music || !music.item) return <></>;

	const Icon = music.item.playing ? Pause : Play;

	return (
		<Box>
			<Box.Content className="flex space-x-3">
				<Icon className="text-primary my-auto flex-shrink-0" height={25} />
				<div className="flex-grow">
					<h1 className="text-xl">{music.item.name}</h1>
					{music.item.artists.length > 0 && (
						<h2 className="text-gray-700 dark:text-gray-300 text-xs">
							{music.item.artists.map((a) => a.name).join(", ")}
						</h2>
					)}
					<div
						className="h-1 bg-primary rounded-full mt-2"
						style={{
							width: `${(music.item.progress / music.item.duration) * 100}%`,
						}}
					></div>
				</div>
			</Box.Content>
		</Box>
	);
};
