import axios from "axios";
import App from "next/app";
import Router from "next/router";
import { UserContext } from "../utils/userContext";
import NProgress from "nprogress";
import cookies from "next-cookies";

import "@alleshq/reactants/dist/index.css";
import "../nprogress.css";

const app = ({ Component, pageProps, user }) => (
  <UserContext.Provider value={user}>
    <Component {...pageProps} />
  </UserContext.Provider>
);

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

  if (ctx.pathname === "/_error") return props;

  try {
    const user = (
      await axios.get(`${process.env.NEXT_PUBLIC_ORIGIN}/api/me`, {
        headers: {
          Authorization: sessionToken,
        },
      })
    ).data;

    return {
      ...props,
      user: {
        ...user,
        sessionToken,
      },
    };
  } catch (err) {
    if (ctx.pathname === "/[user]") return props;
    else {
      redirect(
        `https://alles.cx/login?next=${encodeURIComponent(
          process.env.NEXT_PUBLIC_ORIGIN + ctx.asPath
        )}`
      );
      return {};
    }
  }
};

export default app;

// Progress Bar
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());
