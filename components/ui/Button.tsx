import React from "react";

interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "destructive";
  size?: "small" | "medium" | "large";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "medium",
  type = "button",
  disabled = false,
  onClick,
}) => {
  const variantStyles = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  };
  const sizeStyles = {
    small: "px-3 py-1 text-sm rounded",
    medium: "px-4 py-2 text-base rounded-md",
    large: "px-5 py-3 text-lg rounded-lg",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center justify-center gap-2 cursor-pointer font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className ?? ""}`}
    >
      {children}
    </button>
  );
};

export default Button;
