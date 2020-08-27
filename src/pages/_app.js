import axios from "axios";
import App from "next/app";
import Router from "next/router";
import { UserContext } from "../utils/userContext";
import cookies from "next-cookies";

import "@alleshq/reactants/dist/index.css";

export default function app({ Component, pageProps, user }) {
	return (
		<UserContext.Provider value={user}>
			<Component {...pageProps} />
		</UserContext.Provider>
	);
}

// User data
app.getInitialProps = async (appContext) => {
	const props = await App.getInitialProps(appContext);
	const { ctx } = appContext;
	const { sessionToken } = cookies(ctx);
	const isServer = typeof window === "undefined";

	const redirect = (location) =>
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
		const user = (
			await axios.get(
				`${
					process.env.NEXT_PUBLIC_ORIGIN ? process.env.NEXT_PUBLIC_ORIGIN : ""
				}/api/me`,
				{
					headers: {
						Authorization: sessionToken,
					},
				}
			)
		).data;

		if (redirectIfLoggedInPaths.includes(ctx.pathname)) redirect("/");

		return { ...props, user: { ...user, sessionToken } };
	} catch (err) {
		console.log(
			`${
				process.env.NEXT_PUBLIC_ORIGIN ? process.env.NEXT_PUBLIC_ORIGIN : ""
			}/api/me`
		);
		if (
			!redirectIfLoggedInPaths.includes(ctx.pathname) &&
			!allowGuestPaths.includes(ctx.pathname)
		)
			redirect(`/login?next=${ctx.pathname}`);

		return { ...props };
	}
};
