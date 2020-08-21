import { Box } from "@reactants/ui";
import { User as UserIcon, Shield, Icon, Grid, EyeOff } from "react-feather";
import { Fragment } from "react";
import Link from "next/link";
import { Page } from "../components";
import { useUser } from "../lib";

interface Category {
	name: string;
	icon: Icon;
	links: { text: string; href: string }[];
}

const categories: Category[] = [
	{
		name: "Profile",
		icon: UserIcon,
		links: [
			{
				text: "Personal info",
				href: "/info",
			},
			{
				text: "Contact details",
				href: "/contact",
			},
		],
	},
	{
		name: "Security",
		icon: Shield,
		links: [
			{ text: "Logging in", href: "/auth" },
			{ text: "Sessions", href: "/sessions" },
		],
	},
	{
		name: "Applications",
		icon: Grid,
		links: [
			{ text: "Authorized apps", href: "/apps" },
			{ text: "Notifications", href: "/notifications" },
		],
	},
	{
		name: "Privacy",
		icon: EyeOff,
		links: [
			{ text: "Telemetry", href: "/telemetry" },
			{ text: "Export your data", href: "/data" },
		],
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

				<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
					{categories.map((category, i) => (
						<Box key={i}>
							<Box.Header className="flex items-center space-x-2">
								<category.icon size={18.5} className="text-primary" />
								<span>{category.name}</span>
							</Box.Header>

							<div className="py-1.5">
								{category.links.map((link, i) => (
									<Fragment key={i}>
										<Link href={link.href}>
											<a className="block px-4 py-2.5 text-sm leading-5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark-hover:bg-gray-700 focus:bg-gray-100 dark-focus:bg-gray-700">
												{link.text}
											</a>
										</Link>
									</Fragment>
								))}
							</div>
						</Box>
					))}
				</div>
			</main>
		</Page>
	);
}
