import classnames from "classnames";
import React, { memo } from "react";

type Props = React.HTMLAttributes<HTMLDivElement>;

export const Content: React.FC<Props> = memo(
  ({ children, className, ...props }) => (
    <div className={classnames("py-4 px-3", className)} {...props}>
      {children}
    </div>
  )
);
