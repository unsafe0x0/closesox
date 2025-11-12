import React, { useState, useRef } from "react";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = "top",
}) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const show = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), 100);
  };
  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  let positionClass = "";
  switch (placement) {
    case "top":
      positionClass = "bottom-full left-1/2 -translate-x-1/2 mb-2";
      break;
    case "bottom":
      positionClass = "top-full left-1/2 -translate-x-1/2 mt-2";
      break;
    case "left":
      positionClass = "right-full top-1/2 -translate-y-1/2 mr-2";
      break;
    case "right":
      positionClass = "left-full top-1/2 -translate-y-1/2 ml-2";
      break;
  }

  return (
    <span
      className="relative inline-block"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}
      {visible && (
        <span
          className={`absolute z-50 ${positionClass} px-3 py-1.5 bg-card border border-border rounded shadow text-sm text-foreground transition-all duration-150 whitespace-nowrap pointer-events-none animate-in fade-in zoom-in`}
        >
          {content}
        </span>
      )}
    </span>
  );
};

export default Tooltip;
