import "@reactants/ui/dist/index.css";
import App from "next/app";
import type { AppProps, AppContext } from "next/app";
import axios from "axios";
import nextCookies from "next-cookies";
import { remove as removeCookie } from "es-cookie";
import Router from "next/router";
import { UserContext } from "../lib";
import type { User } from "../types";
import { useEffect } from "react";

type Props = {
	user: User;
} & AppProps;

function Hub({ Component, pageProps, user }: Props) {
	return (
		<UserContext.Provider value={user}>
			<Component {...pageProps} />
		</UserContext.Provider>
	);
}

Hub.getInitialProps = async (appContext: AppContext) => {
	const props = await App.getInitialProps(appContext);

	const { ctx } = appContext;
	const cookies = nextCookies(ctx);
	const isServer = typeof window === "undefined";

	const redirect = (location: string) =>
		isServer
			? ctx.res.writeHead(302, { location }).end()
			: /^https?:\/\/|^\/\//i.test(location)
			? (window.location.href = location)
			: Router.push(location);

	switch (ctx.pathname) {
		case "/_error":
			return { ...props };
		default:
			if (!cookies.sessionToken)
				try {
					const cookie = ctx.req?.headers.cookie ?? "";
					const headers = isServer ? { cookie } : {};
					const user: User = await axios
						.get(`${process.env.PUBLIC_URI ?? ""}/api/me`, { headers })
						.then((res) => res.data);

					// At this point the token is valid, if we're at
					// the login page, we're already logged in, so we
					// redirect to home or ?next.
					if (ctx.pathname === "/login")
						redirect(ctx.query.next?.toString() ?? "/");

					return { ...props, user };
				} catch (error) {
					// At this point the token is invalid, we don't want
					// to redirect login to login because that's a bad idea.
					if (ctx.pathname !== "/login")
						redirect(`/login?next=${ctx.pathname}`);
					return { ...props };
				}
	}
};

export default Hub;
