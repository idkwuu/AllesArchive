import classnames from "classnames";
import React, { HTMLAttributes, memo } from "react";

interface Props extends HTMLAttributes<any> {
  color?: "default" | "primary" | "danger";
  content?: string | React.ReactNode;
}

export const Toast: React.FC<Props> = memo(({ color = "default", content }) => (
  <div
    className={classnames(
      "rounded",
      "border-t-4",
      "shadow-md",
      "bg-white",
      "dark:bg-gray-750",
      "dark:text-white",
      "py-3",
      "px-3.5",
      {
        "border-primary": color == "primary",
        "border-danger": color == "danger",
      }
    )}
  >
    {content}
  </div>
));
