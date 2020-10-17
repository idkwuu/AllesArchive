import getUser from "../../../utils/getUser";
import sharp from "sharp";
import axios from "axios";

export default async (req, res) => {
  if (typeof req.query.id !== "string")
    return res.status(400).json({ err: "badRequest" });

  // Get user
  const user = await getUser(req.query.id);
  if (!user) return res.status(404).json({ err: "missingResource" });

  try {
    // Get Avatar
    const avatar = (
      await axios.get(`https://avatar.alles.cc/${user.id}?size=500`, {
        responseType: "arraybuffer",
      })
    ).data;

    // Create SVG
    const svg = `
      <svg
        width="1000"
        height="1000"
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
        font-family="sans serif"
      >
        <defs>
          <clipPath id="clip">
            <circle cx="500" cy="400" r="150" fill="#000000" />
          </clipPath>
        </defs>

        <rect
          x="0"
          y="0"
          width="1000"
          height="1000"
          fill="#ffffff"
        />

        <image
          x="350"
          y="250"
          width="300"
          height="300"
          href="data:image/png;base64,${avatar.toString("base64")}"
          clip-path="url(#clip)"
        />

        <text
          x="500"
          y="625"
          dominant-baseline="middle"
          text-anchor="middle"
          fill="#000000"
          font-weight="bold"
          font-size="70"
        >
          ${encodeHTML(user.name)}
        </text>

        <polygon
          points="1000,600 0,900 0,1000 1000,1000"
          fill="#23539b"
        />
      </svg>
    `;

    // Convert to PNG
    const img = await sharp(Buffer.from(svg)).png();

    // Response
    res.setHeader("Content-Type", "image/png");
    res.send(img);
  } catch (err) {
    res.status(500).json({ err: "internalError" });
  }
};

const encodeHTML = (str) =>
  str
    .replace(/[\u00A0-\u9999<>&](?!#)/gim, (i) => "&#" + i.charCodeAt(0) + ";")
    .replace(/\u0008/gim, "");
