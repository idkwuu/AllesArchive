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
	clearSessionToken?: boolean;
} & AppProps;

function Hub({ Component, pageProps, user, clearSessionToken = false }: Props) {
	useEffect(() => {
		if (clearSessionToken) {
			removeCookie("sessionToken");
			location.reload();
		}
	});

	return clearSessionToken ? (
		<></>
	) : (
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
		case "/login":
			if (cookies.sessionToken) redirect(ctx.query.next?.toString() ?? "/");
			return { ...props };
		default:
			if (!cookies.sessionToken) redirect(`/login?next=${ctx.pathname}`);

			try {
				const cookie = ctx.req?.headers.cookie ?? "";
				const headers = isServer ? { cookie } : {};
				const user: User = await axios
					.get(`${process.env.PUBLIC_URI ?? ""}/api/me`, { headers })
					.then((res) => res.data);

				return { ...props, user };
			} catch (error) {
				return { ...props, clearSessionToken: true };
			}
	}
};

export default Hub;
