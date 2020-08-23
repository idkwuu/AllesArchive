import classnames from "classnames";
import React, { HTMLAttributes } from "react";

export const Menu: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div
    className={classnames(
      "rounded shadow bg-white dark:bg-gray-750 w-56 mt-2",
      className
    )}
    {...props}
  >
    <div className="py-1">{children}</div>
  </div>
);
