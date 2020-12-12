import React from "react";
import { Spectrum } from "./spectrum";

export const Pulsar = ({ query, answer, items = [], selection = 0 }) => (
  <div className="pulsar-app">
    <form>
      <input placeholder="What's up?" value={query} disabled />
    </form>

    {!query && <Spectrum />}

    {answer && <div className="answer">{answer}</div>}

    {items.map((item, i) => (
      <div className={`item ${selection === i ? "selected" : ""}`} key={i}>
        {item}
      </div>
    ))}
  </div>
);
