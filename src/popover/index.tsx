import React, {
  HTMLAttributes,
  useState,
  MouseEventHandler,
  memo,
  useRef,
  useEffect,
} from "react";

interface Props extends HTMLAttributes<any> {
  trigger: (onClick: MouseEventHandler<HTMLElement>) => React.ReactNode;
  content: (toggled: boolean) => React.ReactNode;
}

export const Popover: React.FC<Props> = memo(
  ({ trigger, content, ...props }) => {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          isOpen &&
          contentRef.current &&
          !contentRef.current.contains(event.target) &&
          !triggerRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [contentRef, isOpen]);

    return (
      <div {...props}>
        <div className="inline-flex" ref={triggerRef}>
          {trigger(() => setIsOpen(!isOpen))}
        </div>

        <div className="inline-flex" ref={contentRef}>
          {content(isOpen)}
        </div>
      </div>
    );
  }
);
