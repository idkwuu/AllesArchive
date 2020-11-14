import { Page } from "../components/Page";
import { ConfusedCat } from "../components/ConfusedCat";

export default function NotFound() {
	return (
		<Page>
			<div>
				<h1 className="text-5xl font-medium">404</h1>
				<p>
					We're having trouble finding that page! Maybe go to the{" "}
					<a className="text-primary" href="/">
						homepage
					</a>
					.
				</p>
			</div>

			<ConfusedCat />
			<p className="text-right text-sm">
				Confused Alles Cat by{" "}
				<a
					className="text-primary"
					href="https://alles.cx/93e0b06c-e129-415a-aa0a-476473f4d0d2"
				>
					Will Jones
				</a>
			</p>
		</Page>
	);
}
