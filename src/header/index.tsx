import classnames from "classnames";
import React, { memo } from "react";

type Props = React.HTMLAttributes<HTMLHeadingElement>;

export const Header: React.FC<Props> = memo(({ className, children }) => (
  <header
    className={classnames(
      "sticky top-0 w-full h-14 z-50 shadow flex items-center justify-between bg-white dark:bg-gray-750 dark:text-white",
      className
    )}
  >
    {children}
  </header>
));
