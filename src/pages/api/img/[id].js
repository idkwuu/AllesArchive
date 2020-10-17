import getUser from "../../../utils/getUser";
import sharp from "sharp";

export default async (req, res) => {
  if (typeof req.query.id !== "string")
    return res.status(400).json({ err: "badRequest" });

  // Get user
  const user = await getUser(req.query.id);
  if (!user) return res.status(404).json({ err: "missingResource" });

  // Create SVG
  const svg = `
    <svg
      width="500"
      height="500"
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
      font-family="sans serif"
    >
      <rect
        x="0"
        y="0"
        width="500"
        height="500"
        fill="#ffffff"
      />
      <text x="50" y="75" fill="#000000" font-weight="bold" font-size="25">
        <tspan>${encodeHTML(user.name)}</tspan>
        <tspan fill="#23539b" font-size="15">#${user.tag}</tspan>
      </text>
    </svg>
  `;

  // Convert to PNG
  const img = await sharp(Buffer.from(svg)).png();

  // Response
  res.setHeader("Content-Type", "image/png");
  res.send(img);
};

const encodeHTML = (str) =>
  str
    .replace(/[\u00A0-\u9999<>&](?!#)/gim, (i) => "&#" + i.charCodeAt(0) + ";")
    .replace(/\u0008/gim, "");
