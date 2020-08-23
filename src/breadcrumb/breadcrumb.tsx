import React, { Children, isValidElement, HTMLAttributes, memo } from "react";

type Props = HTMLAttributes<unknown>;

const Divider: React.FC = () => (
  <span className="mx-2.5 opacity-25 dark:opacity-50 text-xl font-light select-none">
    /
  </span>
);

export const Breadcrumb: React.FC<Props> = memo(({ children }) => {
  const items = Children.toArray(children)
    .filter((child) => isValidElement(child))
    .map((child, index) => (
      <li className="items-center flex h-full" key={index}>
        {index != 0 && <Divider />}
        {child}
      </li>
    ));

  return <ul className="flex items-center">{items}</ul>;
});
