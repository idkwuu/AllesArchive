import React, { useState, useEffect } from "react";
import { Pulsar } from "./pulsar";
import { getUser } from "./user";
import moment from "moment";

import "./style.css";
import "./inter/inter.css";

export const Page = () => {
  const [user, setUser] = useState();
  useEffect(
    () =>
      getUser()
        .then(setUser)
        .catch(() => {}),
    []
  );

  return (
    <main>
      <h1>This is Pulsar</h1>
      <h2>The Smart Search Box by Alles</h2>
      <Pulsar placeholder={`What's up${user ? `, ${user.nickname}` : ``}?`} />

      <Pulsar
        query="Visual St"
        items={[
          "Launch Visual Studio Code",
          "Visual Studio Code",
          "Visual Studio Professional",
          "Visual Studio vs Atom",
          "How to use Visual Studio",
        ]}
      />
      <p className="caption">Pulsar can launch your applications</p>

      <Pulsar query="round(pi * 2 ^ 2 * 5.5)" answer="69" />
      <p className="caption">Find the volume of a cylinder</p>

      <Pulsar
        query="What song is this?"
        answer={
          user && user.music ? user.music.name : "The Cut That Always Bleeds"
        }
        items={[
          "What song is the most popular in 2020?",
          "What song was released by Taylor Swift?",
        ]}
      />
      <p className="caption">You can link your AllesID to Spotify</p>

      <Pulsar
        query="What time is it?"
        answer={`It's ${moment().format("H:mm A")}`}
        items={[
          "What time is it in London?",
          "What time is it in New York?",
          "What time is it in California?",
          "What time is it in Berlin?",
          "What time is it in Paris?",
        ]}
      />
      <p className="caption">Tell you the time</p>

      <Pulsar
        query="/status Editing videos!"
        items={[
          "Set as status for 1h",
          "Set as status for 6h",
          "Set as status for 12h",
          "Set as status for 24h",
        ]}
        selection={2}
      />
      <p className="caption">
        And you can use plugins to do even more cool stuff
      </p>
    </main>
  );
};
