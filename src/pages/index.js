import { Box } from "@alleshq/reactants";
import {
	User as UserIcon,
	Shield,
	Grid,
	Award,
	PlusCircle,
} from "react-feather";
import Link from "next/link";
import { Page } from "../components/page";
import { useUser } from "../utils/user";
import { Spectare } from "../logos/spectare";
import { Pulsar } from "../logos/pulsar";

const categories = [
	{
		name: "Profile and Personalisation",
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
				text: "Preferences",
				href: "/preferences",
			},
		],
	},
	{
		name: "Privacy and Security",
		icon: Shield,
		links: [
			{
				text: "Signing in",
				href: "/security",
			},
			{
				text: "Active Sessions",
				href: "/sessions",
			},
			{
				text: "Export your data",
				href: "/data",
			},
		],
	},
	{
		name: "Applications",
		icon: Grid,
		links: [
			{
				text: "Authorized Applications",
				href: "/apps",
			},
			{
				text: "Developer Services",
				href: "https://developer.alles.cx",
				external: true,
			},
		],
	},
	{
		name: "Coins and Subscriptions",
		icon: PlusCircle,
		links: [
			{
				text: "Alles+",
				href: "/plus",
			},
			{
				text: "Manage Coins",
				href: "/coins",
			},
		],
	},
	{
		name: "XP and Rewards",
		icon: Award,
		links: [
			{
				text: "Earn XP",
				href: "/xp",
			},
			{
				text: "Deals",
				href: "https://deals.alles.cx",
				external: true,
			},
		],
	},
];

const TextLogo = ({ children }) => (
	<div className="pb-2 font-bold font-serif italic text-4xl text-primary rounded-t-lg">
		{children}
	</div>
);

const products = [
	{
		name: "Micro",
		logo: <TextLogo>μ</TextLogo>,
		url: "https://micro.alles.cx",
	},
	{
		name: "Spectare",
		logo: Spectare,
		url: "https://spectare.alles.cx",
	},
	{
		name: "Pulsar",
		logo: Pulsar,
		url: "https://pulsar.alles.cx",
	},
	{
		name: "Input",
		logo: <TextLogo>I</TextLogo>,
		url: "https://input.alles.cx",
	},
];

export default function Index() {
	const user = useUser();

	return (
		<Page>
			<main className="sm:max-w-2xl p-5 mx-auto space-y-7">
				<h4 className="font-medium text-3xl">
					Hey, {user.nickname}
					{user.plus && <sup className="select-none text-primary">+</sup>}
				</h4>

				<div className="grid grid-cols-2 md:grid-cols-6 gap-3">
					{products.map((product, i) => (
						<a href={product.url} key={i}>
							<Box className="hover:shadow-lg transition duration-100 ease text-center">
								{product.logo}
								<div className="rounded-b-lg py-1.5 w-full border-t text-sm text-gray-500 dark:text-gray-300 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-750">
									{product.name}
								</div>
							</Box>
						</a>
					))}
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
			</main>
		</Page>
	);
}
