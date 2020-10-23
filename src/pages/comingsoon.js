import { Page } from "../components/page";

export default function ComingSoon() {
	return (
		<Page>
			<main className="sm:max-w-2xl p-5 mx-auto space-y-7">
				<div>
					<h1 className="text-5xl font-medium">Coming Soon</h1>
					<p>
						Sorry. This page isn't done yet. If you want us to make it sooner,{" "}
						<a className="text-primary" href="https://alles.link/discord">
							let us know
						</a>
						.
					</p>
				</div>
			</main>
		</Page>
	);
}
