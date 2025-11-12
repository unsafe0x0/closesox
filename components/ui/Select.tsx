"use client";
import React, { useState, useEffect, useRef } from "react";

interface Option {
  label: string;
  icon?: React.ReactNode;
}

interface SelectProps {
  label: string | Option;
  options: Option[];
  onSelect: (value: Option) => void;
  className?: string;
  itemClassName?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  onSelect,
  className = "",
  itemClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);
  const SelectRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: Option) => {
    setSelected(option);
    onSelect(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        SelectRef.current &&
        !SelectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderLabel = () => {
    const content =
      selected?.label ??
      (typeof label === "object" ? label.label : (label ?? ""));
    const icon =
      selected?.icon ?? (typeof label === "object" ? label.icon : null);

    return (
      <>
        {icon && <span className="text-lg shrink-0">{icon}</span>}
        <span className="truncate">{content}</span>
      </>
    );
  };

  return (
    <div
      ref={SelectRef}
      className="relative inline-block text-left min-w-30 max-w-56"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 justify-start w-full px-4 py-2 text-sm font-medium text-foreground bg-accent border border-border focus:outline-none transition-all ${
          isOpen
            ? "rounded-t-md rounded-b-none border-b-0"
            : "rounded-md hover:ring-1 hover:ring-primary"
        }`}
      >
        {renderLabel()}
      </button>

      {isOpen && (
        <div
          className={`absolute top-full left-0 z-10 w-full bg-accent border border-border border-t-0 rounded-b-md overflow-hidden animate-in fade-in zoom-in ${className}`}
        >
          <ul className="py-1 max-h-[400px] overflow-y-auto">
            {options.map((option) => (
              <li
                key={option.label}
                onClick={() => handleSelect(option)}
                title={option.label}
                className={`flex items-center gap-2 px-4 py-2 text-sm cursor-pointer text-foreground transition-colors duration-200 truncate ${
                  selected?.label === option.label
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-primary hover:text-primary-foreground"
                } ${itemClassName}`}
              >
                {option.icon && (
                  <span className="text-lg shrink-0">{option.icon}</span>
                )}
                <span className="truncate">{option.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Select;
