import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import nextCookies from "next-cookies";
import classnames from "classnames";

export default class Document extends NextDocument {
	static async getInitialProps(ctx) {
		const initialProps = await NextDocument.getInitialProps(ctx);
		const cookies = nextCookies(ctx);
		return { ...initialProps, theme: cookies.theme ?? "light" };
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
