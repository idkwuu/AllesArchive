import classnames from "classnames";
import React, { TextareaHTMLAttributes, memo } from "react";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea: React.FC<Props> = memo(
  ({ label, required, className, ...props }) => (
    <fieldset>
      {label && (
        <label className="text-sm mb-2 block">
          {label}
          <sup className="text-danger opacity-75">{required && "*"}</sup>
        </label>
      )}

      <textarea
        className={classnames(
          "block bg-gray-100 dark:bg-gray-700 dark:text-white transition duration-200 rounded-lg w-full text-sm border border-gray-200 focus:border-gray-400 dark:border-gray-600 dark-focus:border-gray-400 p-3 resize-none placeholder-gray-400 focus:outline-none",
          className
        )}
        required={required}
        {...props}
      ></textarea>
    </fieldset>
  )
);
