import NextDocument, {
	Html,
	Head,
	Main,
	NextScript,
	DocumentContext,
	DocumentInitialProps,
} from "next/document";
import nextCookies from "next-cookies";
import classnames from "classnames";
import { Theme } from "../lib";

export default class Document extends NextDocument<{ theme: Theme }> {
	static async getInitialProps(ctx) {
		const initialProps = await NextDocument.getInitialProps(ctx);
		const cookies = nextCookies(ctx);
		return { ...initialProps, theme: (cookies.theme as Theme) ?? "light" };
	}

	render() {
		return (
			<Html className={classnames({ dark: this.props.theme === "dark" })}>
				<Head />
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
