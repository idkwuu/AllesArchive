import classnames from "classnames";
import React, { HTMLAttributes, memo, forwardRef } from "react";

interface Props extends HTMLAttributes<unknown> {
  href?: string;
}

export const Item = memo(
  forwardRef<HTMLAnchorElement, Props>(
    ({ children, className, ...props }, ref) => (
      <a
        ref={ref}
        className={classnames(
          "hover:opacity-75 transition duration-100 flex items-center cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </a>
    )
  )
);
