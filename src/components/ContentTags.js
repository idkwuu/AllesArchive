import Link from "next/link";

const chars = {
	"@": "user",
};

export const ContentTags = ({ children }) => {
	const segments = parseContent(children);
	return segments.map(
		(segment, i) =>
			({
				text: segment.string,
				user: (
					<Link
						href="/[user]"
						as={`/${encodeURIComponent(segment.string)}`}
						key={i}
					>
						<a className="text-primary" onClick={(e) => e.stopPropagation()}>
							@{segment.string}
						</a>
					</Link>
				),
			}[segment.type])
	);
};

const chars2 = {};
for (let i = 0; i < Object.keys(chars).length; i++)
	chars2[chars[Object.keys(chars)[i]]] = Object.keys(chars)[i];

const parseContent = (text) => {
	const segments = [];

	let segment = {
		type: "text",
		string: "",
	};

	const endSegment = () => {
		// Push to segments if string has value or is text
		if (segment.string || segment.type === "text") segments.push(segment);
		// No new segment, add character to end of previous
		else if (chars2[segment.type]) {
			segments[segments.length - 1].string += chars2[segment.type];
		}
	};

	for (let i = 0; i < text.length; i++) {
		if (segment.type === "text") {
			if (chars[text[i]]) {
				// Start of non-text segment
				endSegment();
				segment = {
					type: chars[text[i]],
					string: "",
				};
			} else {
				// Continue
				segment.string += text[i];
			}
		} else {
			if (text[i].match(/[^a-zA-Z0-9-]/)) {
				// Non-Alphanumeric, switch back to string
				endSegment();
				segment = {
					type: "text",
					string: "",
				};
				i -= 1;
			} else {
				// Continue
				segment.string += text[i];
			}
		}
	}
	endSegment();

	return segments;
};
