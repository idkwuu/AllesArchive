import React from "react";
import { Spectrum } from "./spectrum";

const latest = "0.0.3";
const ua = navigator.userAgent;
const platform = ua.includes("Windows NT")
  ? ["win32", "Windows"]
  : ua.includes("Linux") && !ua.includes("Mobile")
  ? ["linux", "Linux"]
  : ua.includes("Macintosh")
  ? ["darwin", "macOS"]
  : null;

export const Pulsar = ({
  query,
  placeholder,
  answer,
  items = [],
  selection = 0,
}) => (
  <div className="pulsar-app">
    <form>
      <input placeholder={placeholder} value={query} disabled />
    </form>

    {!query && (
      <>
        <Spectrum />
        <div className="banner">
          <p>
            Get Pulsar v{latest}{platform && ` for ${platform[1]}`} to start searching
          </p>
          <a
            className="button"
            href={`https://files.alles.cc/Pulsar/${latest}${
              platform ? `/pulsar-${platform[0]}-x64.zip` : ``
            }`}
          >
            Download
          </a>
        </div>
      </>
    )}

    {answer && <div className="answer">{answer}</div>}

    {items.map((item, i) => (
      <div className={`item ${selection === i ? "selected" : ""}`} key={i}>
        {item}
      </div>
    ))}
  </div>
);
