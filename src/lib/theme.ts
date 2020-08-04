// https://github.com/pacocoursey/paco/blob/master/lib/theme.ts
import { useCallback, useEffect } from "react";
import useSWR from "swr";
import * as cookies from "es-cookie";

export type Theme = "dark" | "light";

export const themeCookieName = "theme";

const isServer = typeof window === "undefined";
const getTheme = (): Theme => {
	if (isServer) return "light";
	return (cookies.get(themeCookieName) as Theme) || "light";
};

const setDarkMode = () => {
	try {
		cookies.set(themeCookieName, "dark");
		document.documentElement.classList.add("dark");
	} catch (err) {
		console.error(err);
	}
};

const setLightMode = () => {
	try {
		cookies.set(themeCookieName, "light");
		document.documentElement.classList.remove("dark");
	} catch (err) {
		console.error(err);
	}
};

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
		(newTheme: Theme) => {
			mutate(newTheme, false);
		},
		[mutate]
	);

	useEffect(() => {
		const enable = disableAnimation();

		if (theme === "dark") {
			setDarkMode();
		} else {
			setLightMode();
		}

		enable();
	}, [theme]);

	return {
		theme,
		setTheme,
		toggleTheme: () => setTheme(!theme || theme === "dark" ? "light" : "dark"),
	};
};
