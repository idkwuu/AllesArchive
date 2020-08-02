import {
	Breadcrumb,
	Popover,
	Avatar,
	Transition,
	Menu,
	Header,
	Button,
} from "@reactants/ui";
import { Circle, Bell } from "react-feather";
import Link from "next/link";
import { remove as removeCookie } from "es-cookie";
import Router from "next/router";
import { useUser, useTheme } from "../lib";

type Props = {
	authenticated?: boolean;
	breadcrumbs?: React.ReactNode;
};

export const Page: React.FC<Props> = ({
	children,
	authenticated = true,
	breadcrumbs = null,
}) => {
	const user = useUser();
	const { toggleTheme } = useTheme();

	const logOut = () => {
		removeCookie("sessionToken");
		Router.push("/login");
	};

	return (
		<>
			<Header>
				<div className="p-5 max-w-2xl w-full mx-auto flex justify-between">
					<Breadcrumb>
						<Link href="/" passHref>
							<Breadcrumb.Item className="font-medium text-lg inline-flex items-center">
								<Circle
									onClick={toggleTheme}
									className="text-gray-500 inline w-5 mr-2"
								/>
								Alles
							</Breadcrumb.Item>
						</Link>

						{breadcrumbs}
					</Breadcrumb>

					{authenticated ? (
						<div className="flex items-center space-x-3">
							<div className="select-none cursor-pointer hover:bg-danger-85 transition duration-200 ease bg-danger text-white rounded-full flex items-center justify-center py-0.5 px-2.5 space-x-1">
								<Bell size={0.35 * 37.5} />
								<span>2</span>
							</div>

							<Popover
								className="relative inline-block"
								trigger={onClick => (
									<Avatar
										onClick={onClick}
										className="select-none cursor-pointer hover:opacity-85 transition duration-200 ease"
										id={user.id}
										size={35}
									/>
								)}
								content={isOpen => (
									<Transition
										show={isOpen}
										enter="transition ease-out duration-100 transform"
										enterFrom="opacity-0 scale-95"
										enterTo="opacity-100 scale-100"
										leave="transition ease-in duration-75 transform"
										leaveFrom="opacity-100 scale-100"
										leaveTo="opacity-0 scale-95"
									>
										<Menu className="absolute origin-top-right right-0">
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
							<Link href="/login" passHref>
								<Button color="transparent">Sign In</Button>
							</Link>

							<Link href="/register" passHref>
								<Button>Get Started</Button>
							</Link>
						</div>
					)}
				</div>
			</Header>

			{children}
		</>
	);
};
