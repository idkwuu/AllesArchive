import classnames from "classnames";
import React, { memo } from "react";

type Props = React.HTMLAttributes<HTMLDivElement>;

export const Header: React.FC<Props> = memo(
  ({ children, className, ...props }) => (
    <div
      className={classnames(
        "cursor-default rounded-t-lg text-sm border-b text-gray-500 dark:text-gray-300 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-750 px-3 py-2.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
