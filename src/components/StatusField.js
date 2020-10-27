import { Box, Textarea, Button } from "@alleshq/reactants";
import { useState } from "react";
import axios from "axios";
import { useUser } from "../utils/userContext";

export default function StatusField() {
  const user = useUser();
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [placeholder, setPlaceholder] = useState(
    user.status ? user.status.content : "What's up?"
  );

  // Form Submit
  const submit = () => {
    if (value.trim().length < 3) return setError("Your status is too short");

    setLoading(true);
    setError();
    axios
      .post(
        "https://wassup.alles.cc",
        {
          content: value.trim(),
          time: 24 * 60 * 60,
        },
        {
          headers: {
            Authorization: user.sessionToken,
          },
        }
      )
      .then(() => {
        setPlaceholder(value);
        setValue("");
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError("Something went wrong.");
      });
  };

  return (
    <Box>
      <Textarea
        placeholder={placeholder}
        className="text-base border-none pb-0"
        rows={2}
        value={value}
        maxLength={100}
        onChange={(e) => {
          setValue(e.target.value.replaceAll("\n", ""));
          setError();
        }}
        style={{
          background: "transparent",
        }}
      />

      <Box.Footer className="flex items-center justify-between mt-5">
        <p className="text-danger">{error}</p>
        <Button
          disabled={!value.trim()}
          loading={loading}
          size="sm"
          onClick={submit}
        >
          Update Status
        </Button>
      </Box.Footer>
    </Box>
  );
}
