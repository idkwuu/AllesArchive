import { Box } from "@reactants/ui";
import {
	User as UserIcon,
	Shield,
	Icon,
	Grid,
	Award,
	PlusCircle,
} from "react-feather";
import Link from "next/link";
import { Page } from "../components";
import { useUser } from "../lib";

interface Category {
	name: string;
	icon: Icon;
	links: {
		text: string;
		href: string;
		external?: boolean;
	}[];
}

interface Product {
	name: string;
	logo: React.ReactNode;
	url: string;
}

const categories: Category[] = [
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

const Micro = (
	<div className="pb-2 font-bold font-serif italic text-4xl text-primary rounded-t-lg">
		μ
	</div>
);

const Spectare = (
	<div className="flex w-full items-centers justify-center text-primary">
		<svg
			width="62"
			height="62"
			viewBox="0 0 128 128"
			className="fill-current"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M69.5542 47.3936C68.4069 47.3936 67.4786 48.6667 67.4786 50.2375C67.4786 51.8102 68.407 53.083 69.5542 53.083C70.7013 53.083 71.6289 51.8102 71.6289 50.2375C71.629 48.6667 70.7013 47.3936 69.5542 47.3936Z" />
			<path d="M69.9675 33C59.4938 33 51.0012 43.1013 51.0012 55.5595C51.0012 67.3227 51.0441 76.6716 39.4088 92.2307C39.0073 92.7655 38.951 93.4812 39.2628 94.0709C39.5707 94.6624 40.1934 95.0235 40.86 94.9989C81.0918 93.5254 88.9371 67.663 88.9371 55.5595C88.9371 43.1013 80.4452 33 69.9675 33ZM68.7331 57.7258C66.2075 57.7258 64.163 54.4647 64.163 50.4439C64.163 46.423 66.2075 43.1622 68.7331 43.1622C71.2559 43.1622 73.3031 46.423 73.3031 50.4439C73.303 54.4647 71.2559 57.7258 68.7331 57.7258ZM79.8883 57.7258C77.3654 57.7258 75.3183 54.4647 75.3183 50.4439C75.3183 46.423 77.3654 43.1622 79.8883 43.1622C82.4138 43.1622 84.4583 46.423 84.4583 50.4439C84.4583 54.4647 82.4137 57.7258 79.8883 57.7258Z" />
			<path d="M79.0671 47.3936C77.9198 47.3936 76.9924 48.6667 76.9924 50.2375C76.9924 51.8102 77.92 53.083 79.0671 53.083C80.2145 53.083 81.1427 51.8102 81.1427 50.2375C81.1426 48.6667 80.2144 47.3936 79.0671 47.3936Z" />
		</svg>
	</div>
);

const products: Product[] = [
	{
		name: "Micro",
		logo: Micro,
		url: "https://micro.alles.cx",
	},
	{
		name: "Spectare",
		logo: Spectare,
		url: "https://spectare.alles.cx",
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
