import {
	Breadcrumb,
	Popover,
	Avatar,
	Transition,
	Menu,
	Header,
	Button,
} from "@alleshq/reactants";
import { Circle } from "react-feather";
import Link from "next/link";
import Router from "next/router";
import Head from "next/head";
import { remove as removeCookie } from "es-cookie";
import { useUser } from "../utils/userContext";
import { useTheme } from "../utils/theme";

export const Page = ({ children, title, breadcrumbs, head, width }) => {
	const user = useUser();
	useTheme();

	const logOut = () => {
		const isProduction = process.env.NODE_ENV === "production";
		const domain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN;
		removeCookie("sessionToken", isProduction && { domain });
		Router.push("/login");
	};

	return (
		<div style={{ position: "relative", minHeight: "100vh" }}>
			<Head>
				<title>Alles{title ? ` • ${title}` : ``}</title>
				{head}
			</Head>

			<Header>
				<div className="p-5 max-w-2xl w-full mx-auto flex justify-between">
					<Breadcrumb>
						<Link href="/" passHref>
							<Breadcrumb.Item className="font-medium text-lg inline-flex items-center">
								<Circle className="text-gray-500 inline w-5 mr-2" />
								Alles
							</Breadcrumb.Item>
						</Link>

						{breadcrumbs}
					</Breadcrumb>

					{user ? (
						<div className="flex items-center space-x-3">
							<Popover
								className="relative inline-block flex"
								trigger={(onClick) => (
									<Avatar
										onClick={onClick}
										className="select-none cursor-pointer hover:opacity-85 transition duration-200 ease"
										src={`https://avatar.alles.cc/${user.id}?size=35`}
										size={35}
									/>
								)}
								content={(isOpen) => (
									<Transition
										show={isOpen}
										enter="transition ease-out duration-100 transform"
										enterFrom="opacity-0 scale-95"
										enterTo="opacity-100 scale-100"
										leave="transition ease-in duration-75 transform"
										leaveFrom="opacity-100 scale-100"
										leaveTo="opacity-0 scale-95"
									>
										<Menu className="absolute origin-top-right right-0 top-10">
											<Link
												href="/[user]"
												as={`/${encodeURIComponent(user.username || user.id)}`}
												passHref
											>
												<Menu.Item>Profile Page</Menu.Item>
											</Link>
											<Menu.Item
												onClick={() => logOut()}
												className="cursor-pointer"
											>
												Log out
											</Menu.Item>
										</Menu>
									</Transition>
								)}
							/>
						</div>
					) : (
						<div className="flex items-center space-x-3">
							{/*<Link href="/login" passHref>
								<Button color="transparent">Sign In</Button>
							</Link>

							<Link href="/register" passHref>
								<Button>Join Alles</Button>
							</Link>*/}

							<Link href="/login" passHref>
								<Button>Sign In</Button>
							</Link>
						</div>
					)}
				</div>
			</Header>

			<div className={`sm:max-w-${width || "2xl"} p-5 pb-15 mx-auto space-y-7`}>
				{children}
			</div>

			<footer className="border-gray-400 flex items-center justify-center text-sm absolute bottom-0 w-full h-15 text-gray-500 dark:text-gray-400">
				<div className="w-full max-w-2xl px-5">
					<div className="float-right space-x-7">
						<a
							href="https://code.alles.cx/alles/hub"
							className="text-primary hover:opacity-75 transition duration-200 ease"
						>
							Source
						</a>

						<a
							href="https://files.alles.cc/Documents/Privacy%20Policy.txt"
							className="text-primary hover:opacity-75 transition duration-200 ease"
						>
							Privacy
						</a>

						<a
							href="https://files.alles.cc/Documents/Terms%20of%20Service.txt"
							className="text-primary hover:opacity-75 transition duration-200 ease"
						>
							Terms
						</a>
					</div>
				</div>
			</footer>
		</div>
	);
};
