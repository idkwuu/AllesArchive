import "@reactants/ui/dist/index.css";
import App from "next/app";
import type { AppProps, AppContext } from "next/app";
import axios from "axios";
import Router from "next/router";
import { UserContext } from "../lib";
import type { User } from "../types";

type Props = {
	user: User;
} & AppProps;

export default function Hub({ Component, pageProps, user }: Props) {
	return (
		<UserContext.Provider value={user}>
			<Component {...pageProps} />
		</UserContext.Provider>
	);
}

export async function getInitialProps(appContext: AppContext) {
	const props = await App.getInitialProps(appContext);

	const { ctx } = appContext;
	const isServer = typeof window === "undefined";

	const redirect = (location: string) =>
		isServer
			? ctx.res.writeHead(302, { location }).end()
			: /^https?:\/\/|^\/\//i.test(location)
			? (window.location.href = location)
			: Router.push(location);

	const excludedPaths = ["/_error"];
	const redirectIfLoggedInPaths = ["/login", "/register"];
	const allowGuestPaths = [];

	// Don't do authentication for excluded paths
	if (excludedPaths.includes(ctx.pathname)) {
		return { ...props };
	}

	try {
		const cookie = ctx.req?.headers.cookie ?? "";
		const headers = isServer ? { cookie } : {};
		const user: User = await axios
			.get(`${process.env.PUBLIC_URI ?? ""}/api/me`, { headers })
			.then((res) => res.data);

		// At this point we're 100% sure the token is valid.
		if (redirectIfLoggedInPaths.includes(ctx.pathname))
			redirect(ctx.query.next?.toString() ?? "/");

		return { ...props, user };
	} catch (error) {
		// At this point we're 100% sure the token is invalid.
		if (!redirectIfLoggedInPaths.includes(ctx.pathname))
			redirect(`/login?next=${ctx.pathname}`);

		return { ...props };
	}
}
