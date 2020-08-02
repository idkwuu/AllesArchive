import axios from "axios";
import { NextPage } from "next";
import nextCookies from "next-cookies";
import { User } from "../types";

export const withAuth = (Component: NextPage) => {
	Component.getInitialProps = async ctx => {
		const cookies = nextCookies(ctx);
		if (!cookies.sessionToken)
			ctx.res.writeHead(302, { Location: `/login?next=${ctx.pathname}` }).end();

		const cookie = ctx.req?.headers.cookie ?? "";
		const isServer = typeof window === "undefined";
		const headers = isServer ? { cookie } : {};

		const user: User = await axios
			.get(`${process.env.PUBLIC_URI ?? ""}/api/me`, { headers })
			.then(res => res.data);

		return { user };
	};

	return Component;
};
