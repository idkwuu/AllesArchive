import classnames from "classnames";
import React, { memo } from "react";

type Props = React.HTMLAttributes<HTMLDivElement>;

export const Box: React.FC<Props> = memo(
  ({ children, className, ...props }) => (
    <div
      className={classnames(
        "shadow rounded-lg bg-white dark:bg-gray-750",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
