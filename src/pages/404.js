import { Page } from "../components/page";
import { ConfusedCat } from "../components/confusedCat";

export default function NotFound() {
	return (
		<Page>
			<main className="sm:max-w-2xl p-5 mx-auto space-y-7">
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
						href="https://micro.alles.cx/93e0b06c-e129-415a-aa0a-476473f4d0d2"
					>
						Will Jones
					</a>
				</p>
			</main>
		</Page>
	);
}
