import classnames from "classnames";
import React, {
  HTMLAttributes,
  useRef,
  useState,
  useEffect,
  memo,
} from "react";

interface AvatarProps extends HTMLAttributes<HTMLImageElement> {
  src?: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = memo(
  ({ src, size = 100, className, ...props }) => {
    const [ready, setReady] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
    useEffect(() => {
      imgRef?.current?.complete && setReady(true);
    }, []);

    return (
      <span
        className={classnames(
          className,
          "rounded-full",
          "border",
          "inline-block",
          "border-gray-200",
          "bg-gray-100",
          "dark:border-gray-600",
          "dark:bg-gray-700",
          "select-none"
        )}
      >
        <img
          className={classnames("transition", "rounded-full", "duration-200", {
            "opacity-0": !ready,
          })}
          src={src}
          ref={imgRef}
          onLoad={(): void => setReady(true)}
          height={size}
          width={size}
          {...props}
        />
      </span>
    );
  }
);

interface AvatarStackProps extends HTMLAttributes<HTMLImageElement> {
  srcs?: string[];
  size?: number;
}

export const AvatarStack: React.FC<AvatarStackProps> = memo(
  ({ srcs = [], size = 50 }) => {
    const ml = size > 25 ? 4 : size ? (50 ? 3 : size ? 75 : 2) : 5;

    return (
      <div>
        {srcs.map((src, i) => (
          <Avatar
            src={src}
            className={i !== 0 ? `-ml-${ml}` : null}
            size={size}
          />
        ))}
      </div>
    );
  }
);
