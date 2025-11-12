import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { BsMoon, BsSun, BsLaptop } from "react-icons/bs";
import Select from "@/components/ui/Select";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const options = [
    { label: "Light", icon: <BsSun size={16} /> },
    { label: "Dark", icon: <BsMoon size={16} /> },
    { label: "System", icon: <BsLaptop size={16} /> },
  ];

  const current =
    theme === "light" ? options[0] : theme === "dark" ? options[1] : options[2];

  return (
    <Select
      label={current}
      options={options}
      onSelect={(option) => setTheme(option.label.toLowerCase())}
      itemClassName="flex items-center gap-2"
    />
  );
}
