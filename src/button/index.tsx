import classnames from "classnames";
import React, { HTMLAttributes, cloneElement, forwardRef } from "react";

interface Props extends HTMLAttributes<unknown> {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "danger" | "inverted" | "transparent";
  icon?: React.ReactElement;
  as?: keyof JSX.IntrinsicElements;
  href?: string;
  disabled?: boolean;
  loading?: boolean;
}

export const Button: React.FC<Props> = forwardRef<any, Props>(
  (
    {
      color = "primary",
      size = "md",
      icon,
      children,
      className,
      href,
      loading,
      as = "button",
      ...props
    },
    ref
  ) => {
    if (loading) props.disabled = true;
    icon = icon
      ? cloneElement(icon, {
          className: classnames(
            "opacity-75",
            size == "sm" && ["mr-1.5", "h-3.5", "w-3.5"],
            size == "md" && ["mr-1.5", "h-3.5", "w-3.5"],
            size == "lg" && ["mr-1.5", "h-4", "w-4"]
          ),
        })
      : null;

    const Component: any = href ? "a" : as;

    return (
      <Component
        {...props}
        ref={ref}
        href={href}
        className={classnames(
          "rounded-full",
          "transition",
          "ease-in-out",
          "duration-150",
          "transform",
          "active:scale-95",
          "font-medium",
          "inline-flex",
          "items-center",
          "justify-center",
          "focus:outline-none",
          "select-none",
          "text-sm",
          "border",
          "border-transparent",
          "disabled:pointer-events-none",
          "disabled:bg-gray-100",
          "disabled:text-gray-300",
          "disabled:border-gray-200",
          "dark-disabled:bg-gray-700",
          "dark-disabled:text-gray-500",
          "dark-disabled:border-gray-600",
          color == "primary" && [
            "text-white",
            "bg-primary",
            "hover:bg-primary-85",
            "active:bg-primary-75",
          ],
          color == "danger" && [
            "text-white",
            "bg-danger",
            "hover:bg-danger-85",
            "active:bg-danger-75",
          ],
          color == "secondary" && [
            "text-black",
            "bg-gray-200",
            "dark:bg-gray-600",
            "dark:text-white",
            "hover:bg-opacity-85",
            "active:bg-opacity-75",
          ],
          color == "inverted" && [
            "text-white",
            "bg-black",
            "dark:bg-white",
            "dark:text-black",
            "hover:bg-opacity-85",
            "active:bg-opacity-75",
          ],
          color == "transparent" && [
            "text-gray-600",
            "bg-transparent",
            "dark:text-gray-300",
            "hover:opacity-85",
            "active:opacity-75",
          ],
          size == "sm" && ["py-1", "px-3.5"],
          size == "md" && ["py-1.5", "px-5"],
          size == "lg" && ["py-2.5", "px-7"],
          className
        )}
      >
        <span className={classnames({ invisible: loading })}>{icon}</span>
        <span className={classnames({ invisible: loading })}>{children}</span>

        <span className={classnames("absolute", { invisible: !loading })}>
          <span style={{ animation: "loading-blink 1.4s infinite both" }}>
            •
          </span>
          <span
            style={{
              animation: "loading-blink 1.4s infinite both",
              animationDelay: "0.2s",
            }}
          >
            •
          </span>
          <span
            style={{
              animation: "loading-blink 1.4s infinite both",
              animationDelay: "0.4s",
            }}
          >
            •
          </span>
        </span>
      </Component>
    );
  }
);
