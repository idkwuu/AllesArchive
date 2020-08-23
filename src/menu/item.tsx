import React, { forwardRef } from "react";
import classnames from "classnames";

type Props = {
  as?: keyof JSX.IntrinsicElements;
} & React.AllHTMLAttributes<any>;

export const Item: React.FC<Props> = forwardRef(
  ({ as = "a", children, className, ...props }, ref) => {
    const Component = as as any;

    return (
      <Component
        {...props}
        ref={ref}
        className={classnames(
          "block",
          "px-4",
          "py-2",
          "text-sm",
          "leading-5",
          "text-gray-700",
          "dark:text-gray-200",
          "hover:bg-gray-100",
          "dark-hover:bg-gray-700",
          "focus:outline-none",
          "focus:bg-gray-100",
          "focus:text-gray-900",
          className
        )}
      >
        {children}
      </Component>
    );
  }
);
