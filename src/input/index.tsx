import classnames from "classnames";
import React, {
  InputHTMLAttributes,
  cloneElement,
  useState,
  memo,
} from "react";
import { Eye, EyeOff } from "react-feather";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactElement;
  iconRight?: React.ReactElement;
  onIconClick?: React.MouseEventHandler<unknown>;
  onIconRightClick?: React.MouseEventHandler<unknown>;
  label?: string;
  note?: string;
  hasNote?: boolean;
  errored?: boolean;
}

export const Input: React.FC<Props> = memo(
  ({
    icon,
    onIconClick,
    iconRight,
    onIconRightClick,
    type,
    placeholder,
    label,
    note,
    hasNote,
    required,
    errored,
    ...props
  }) => {
    const [focused, setFocused] = useState(false);
    const [hidden, setHidden] = useState(true);
    const toggle = (): void => setHidden(!hidden);

    iconRight = type === "password" ? hidden ? <Eye /> : <EyeOff /> : iconRight;
    onIconRightClick = type === "password" ? toggle : onIconRightClick;
    placeholder = type === "password" ? "••••••••••" : placeholder;
    type = type === "password" ? (hidden ? "password" : "text") : type;

    icon = icon
      ? cloneElement(icon, {
          onClick: onIconClick,
          className: classnames(
            "ml-2.5 -mr-1.5 w-5 h-5 opacity-50 select-none",
            {
              "cursor-default": !onIconClick,
              "cursor-pointer": onIconClick,
            }
          ),
        })
      : null;

    iconRight = iconRight
      ? cloneElement(iconRight, {
          onClick: onIconRightClick,
          className: classnames(
            "mr-2.5 -ml-1.5 w-5 h-5 opacity-50 select-none",
            {
              "cursor-default": !onIconRightClick,
              "cursor-pointer": onIconRightClick,
            }
          ),
        })
      : null;

    const onFocus: React.FocusEventHandler<HTMLInputElement> = (e): void => {
      setFocused(true);
      if (props.onFocus) props.onFocus(e);
    };

    const onBlur: React.FocusEventHandler<HTMLInputElement> = (e): void => {
      setFocused(false);
      if (props.onBlur) props.onBlur(e);
    };

    return (
      <fieldset>
        {label && (
          <label className="text-sm mb-2 block">
            {label}
            <sup className="text-danger opacity-75">{required && "*"}</sup>
          </label>
        )}

        <div
          className={classnames(
            "flex",
            "items-center",
            "dark:text-white",
            "transition",
            "duration-200",
            "rounded-full",
            "w-full",
            "text-sm",
            "border",
            {
              "bg-gray-100": !errored,
              "dark:bg-gray-700": !errored,
              "bg-danger-5": errored,
              "border-gray-200": !focused && !errored,
              "border-gray-400": focused && !errored,
              "border-danger-50": !focused && errored,
              "border-danger": focused && errored,
              "dark:border-gray-600": !focused && !errored,
              "dark:border-gray-400": focused && !errored,
            }
          )}
        >
          {icon}

          <input
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            type={type}
            required={required}
            className={classnames(
              "py-2.5",
              "px-3.5",
              "w-full",
              "bg-transparent",
              "placeholder-gray-400",
              "dark-placeholder:placeholder-gray-400",
              "focus:outline-none"
            )}
            {...props}
          />

          {iconRight}
        </div>

        {(hasNote || note) && (
          <p
            className={classnames("text-xs", "block", "h-4", "mt-2", {
              "text-danger": errored,
              "text-gray-500": !errored,
              "dark:text-gray-400": !errored,
            })}
          >
            <span>{note}</span>
          </p>
        )}
      </fieldset>
    );
  }
);
