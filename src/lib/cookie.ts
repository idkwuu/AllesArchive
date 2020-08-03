type CookieAttributes = BaseCookieAttributes & SameSiteCookieAttributes;

interface BaseCookieAttributes {
	expires?: Date;
	domain?: string;
	path?: string;
	secure?: boolean;
}

type SameSiteCookieAttributes =
	| LaxStrictSameSiteCookieAttributes
	| NoneSameSiteCookieAttributes;

interface LaxStrictSameSiteCookieAttributes {
	sameSite?: "strict" | "lax";
}

interface NoneSameSiteCookieAttributes {
	sameSite: "none";
	secure: true;
}

export const setCookie = (
	name: string,
	value: string,
	{
		domain = null,
		expires = new Date(),
		sameSite = null,
		secure = false,
		path = "/",
	}: CookieAttributes
) => {
	let cookie = `${name}=${value}; Path=${path}; Expires=${expires.toUTCString()};`;
	if (domain) cookie += `Domain=${domain};`;
	if (secure) cookie += `Secure;`;
	if (sameSite) cookie += `SameSite=${sameSite};`;
	document.cookie = cookie;
};
