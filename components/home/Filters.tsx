import React from "react";
import Select from "../ui/Select";

interface Option {
  label: string;
  icon?: React.ReactNode;
}

interface FiltersProps {
  languages: string[];
  selectedLanguage?: string;
  onLanguageChange: (lang: string) => void;
  starsOptions: string[];
  selectedStars?: string;
  onStarsChange: (stars: string) => void;
  issuesOptions: string[];
  selectedIssues?: string;
  onIssuesChange: (issues: string) => void;
}

const Filters: React.FC<FiltersProps> = ({
  languages,
  onLanguageChange,
  starsOptions,
  onStarsChange,
  issuesOptions,
  onIssuesChange,
}) => {
  const languageOptions: Option[] = languages.map((l) => ({ label: l }));
  const starsOptionObjs: Option[] = starsOptions.map((s) => ({ label: s }));
  const issuesOptionObjs: Option[] = issuesOptions.map((i) => ({ label: i }));

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-card border border-border rounded-lg mb-4">
      <Select
        label="Language"
        options={languageOptions}
        onSelect={(opt) => onLanguageChange(opt.label)}
        className="min-w-[120px]"
        itemClassName="px-2 py-1"
      />
      <Select
        label="Stars"
        options={starsOptionObjs}
        onSelect={(opt) => onStarsChange(opt.label)}
        className="min-w-[120px]"
        itemClassName="px-2 py-1"
      />
      <Select
        label="Issues"
        options={issuesOptionObjs}
        onSelect={(opt) => onIssuesChange(opt.label)}
        className="min-w-[120px]"
        itemClassName="px-2 py-1"
      />
    </div>
  );
};

export default Filters;
