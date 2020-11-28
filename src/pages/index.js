import { Avatar, Box } from "@alleshq/reactants";
import {
	User as UserIcon,
	Shield,
	Award,
	PlusCircle,
	Hash,
	Terminal,
} from "react-feather";
import Link from "next/link";
import { Page } from "../components/Page";
import { useUser } from "../utils/userContext";
import axios from "axios";
import cookies from "next-cookies";

const categories = [
	{
		name: "Profile",
		icon: UserIcon,
		links: [
			{
				text: "About Me",
				href: "/me",
			},
			{
				text: "Connected Accounts",
				href: "/connections",
			},
			{
				text: "Friends",
				href: "/friends",
			},
		],
	},
	{
		name: "Privacy and Security",
		icon: Shield,
		links: [
			{
				text: "Signing in",
				href: "/auth",
			},
			{
				text: "Active Sessions",
				href: "/comingsoon",
			},
			{
				text: "Export your data",
				href: "/comingsoon",
			},
		],
	},
	{
		name: "Payments and Subscriptions",
		icon: PlusCircle,
		links: [
			{
				text: "Alles+ and Billing",
				href: "/billing",
			},
			{
				text: "Coins",
				href: "/coins",
			},
		],
	},
	{
		name: "Rewards",
		icon: Award,
		links: [
			{
				text: "Earn XP",
				href: "/comingsoon",
			},
			{
				text: "Deals",
				href: "/comingsoon",
			},
		],
	},
];

const IconLogo = ({ icon: Icon }) => (
	<div className="p-5 font-bold text-4xl text-primary">
		<Icon className="m-auto" />
	</div>
);

const products = [
	{
		name: "Micro",
		logo: <IconLogo icon={Hash} />,
		url: "https://micro.alles.cx",
		external: true,
	},
	{
		name: "Pulsar",
		logo: <IconLogo icon={Terminal} />,
		url: "/pulsar",
	},
];

const page = ({ friends }) => {
	const user = useUser();

	return (
		<Page>
			<h4 className="font-medium text-3xl">
				Hey, {user.nickname}
				{user.plus && <sup className="select-none text-primary">+</sup>}
			</h4>

			{friends.length > 0 && (
				<div className="grid grid-cols-6 gap-3">
					{friends.map((u) => (
						<div className="flex justify-center" key={u.id}>
							<Link
								href="/[user]"
								as={`/${encodeURIComponent(u.username || u.id)}`}
							>
								<a className="flex">
									<Avatar
										src={`https://avatar.alles.cc/${u.id}?size=50`}
										size={50}
									/>
								</a>
							</Link>
						</div>
					))}
				</div>
			)}

			<div className="grid grid-cols-2 md:grid-cols-6 gap-3">
				{products.map((product, i) =>
					product.external ? (
						<a href={product.url} key={i}>
							<Box className="hover:shadow-lg transition duration-100 ease text-center">
								{product.logo}
								<div className="rounded-b-lg py-1.5 w-full border-t text-sm text-gray-500 dark:text-gray-300 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-750">
									{product.name}
								</div>
							</Box>
						</a>
					) : (
						<Link href={product.url} key={i}>
							<a>
								<Box className="hover:shadow-lg transition duration-100 ease text-center">
									{product.logo}
									<div className="rounded-b-lg py-1.5 w-full border-t text-sm text-gray-500 dark:text-gray-300 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-750">
										{product.name}
									</div>
								</Box>
							</a>
						</Link>
					)
				)}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
				{categories.map((category, i) => (
					<Box key={i}>
						<Box.Header className="flex items-center space-x-2">
							<category.icon size={18.5} className="text-primary" />
							<span>{category.name}</span>
						</Box.Header>

						<div className="py-1.5">
							{category.links.map((link, i) =>
								link.external ? (
									<a
										href={link.href}
										key={i}
										target="_blank"
										className="block px-4 py-2.5 text-sm leading-5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark-hover:bg-gray-700 focus:bg-gray-100 dark-focus:bg-gray-700"
									>
										{link.text}
									</a>
								) : (
									<Link href={link.href} key={i}>
										<a className="block px-4 py-2.5 text-sm leading-5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark-hover:bg-gray-700 focus:bg-gray-100 dark-focus:bg-gray-700">
											{link.text}
										</a>
									</Link>
								)
							)}
						</div>
					</Box>
				))}
			</div>
		</Page>
	);
};

page.getInitialProps = async (ctx) => {
	try {
		return (
			await axios.get(`${process.env.NEXT_PUBLIC_ORIGIN}/api/friends`, {
				headers: {
					Authorization: cookies(ctx).sessionToken,
				},
			})
		).data;
	} catch (err) {
		return {};
	}
};

export default page;
