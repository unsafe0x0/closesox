import React from "react";

interface BadgeProps {
  children?: React.ReactNode;
}

const Badge = ({ children }: BadgeProps) => {
  return (
    <span className="px-3 py-1 text-sm font-medium inline-flex justify-center items-center gap-1 rounded bg-primary/10 border-border text-primary-foreground">
      {children}
    </span>
  );
};

export default Badge;
