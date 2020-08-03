/// <reference types="next" />
/// <reference types="next/types/global" />

// Extend the NodeJS namespace with Next.js-defined properties
declare namespace NodeJS {
	interface ProcessEnv {
		readonly NODE_ENV: "development" | "production" | "test";
		readonly NEXUS_ID: string;
		readonly NEXUS_SECRET: string;
		readonly NEXUS_URI: string;
		readonly PUBLIC_URI: string;
		readonly NEXT_PUBLIC_COOKIE_DOMAIN: string;
	}
}
