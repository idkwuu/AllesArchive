// https://github.com/pacocoursey/paco/blob/master/lib/theme.ts
import { useCallback, useEffect } from "react";
import useSWR from "swr";
import * as cookies from "es-cookie";

export const themeCookieName = "theme";

const isServer = typeof window === "undefined";
const getTheme = () => {
	if (isServer) return "light";
	return cookies.get(themeCookieName) || "light";
};

const setThemeCookie = (theme) =>
	cookies.set(themeCookieName, theme, {
		expires: 365,
		...(process.env.NODE_ENV === "production" && {
			domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
			sameSite: "none",
			secure: true,
		}),
	});

const disableAnimation = () => {
	const css = document.createElement("style");
	css.type = "text/css";
	css.appendChild(
		document.createTextNode(
			`* {
        -webkit-transition: none !important;
        -moz-transition: none !important;
        -o-transition: none !important;
        -ms-transition: none !important;
        transition: none !important;
      }`
		)
	);
	document.head.appendChild(css);

	return () => {
		// Force restyle
		(() => window.getComputedStyle(css).opacity)();
		document.head.removeChild(css);
	};
};

export const useTheme = () => {
	const { data: theme, mutate } = useSWR(themeCookieName, getTheme, {
		initialData: getTheme(),
	});

	const setTheme = useCallback(
		(newTheme) => {
			mutate(newTheme, false);
		},
		[mutate]
	);

	useEffect(() => {
		const enable = disableAnimation();

		setThemeCookie(theme);

		if (theme === "dark") document.documentElement.classList.add("dark");
		else document.documentElement.classList.remove("dark");

		enable();
	}, [theme]);

	return {
		theme,
		setTheme,
		toggleTheme: () => setTheme(!theme || theme === "dark" ? "light" : "dark"),
	};
};
