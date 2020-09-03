import { Breadcrumb } from "@alleshq/reactants";
import { Page } from "../components/page";
import classnames from "classnames";
import { useTheme } from "../utils/theme";

export default function Preferences() {
	const { theme, setTheme } = useTheme();

	return (
		<Page
			title="Preferences"
			breadcrumbs={<Breadcrumb.Item>Preferences</Breadcrumb.Item>}
		>
			<main className="sm:max-w-2xl p-5 mx-auto space-y-7">
				<h4 className="font-medium text-3xl">Preferences</h4>
				<div className="space-y-2">
					<Option
						className="bg-white"
						selected={theme === "light"}
						onClick={() => setTheme("light")}
					>
						Light Mode
					</Option>
					<Option
						className="bg-gray-700"
						selected={theme === "dark"}
						onClick={() => setTheme("dark")}
					>
						Dark Mode
					</Option>
				</div>
			</main>
		</Page>
	);
}

const Option = ({ children, selected, className, onClick, ...props }) => (
	<div className="flex space-x-2 items-center cursor-pointer" onClick={onClick}>
		<div
			className={classnames(
				"w-5",
				"h-5",
				"rounded-full",
				"border-2",
				"border-primary",
				{
					"border-solid": selected,
					"border-none": !selected,
				},
				className
			)}
			{...props}
		/>
		<p>{children}</p>
	</div>
);
