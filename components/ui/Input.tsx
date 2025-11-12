import React from "react";

interface InputProps {
  type?: "text" | "email" | "password" | "number";
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  label?: string;
}

const Input: React.FC<InputProps> = ({
  type = "text",
  placeholder,
  value,
  onChange,
  className,
  disabled,
  required,
  name,
  id,
  label,
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={id} className="text-lg font-medium">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`${className} outline-none text-sm font-normal bg-accent border border-border rounded-md focus:border-primary p-2 w-full transition-colors duration-200`}
        disabled={disabled}
        required={required}
        name={name}
        id={id}
      />
    </div>
  );
};

export default Input;
