import { Globe } from "lucide-react";

import type { Language } from "@/types";

interface LanguageSwitcherProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const LanguageSwitcher = ({
  language,
  setLanguage,
}: LanguageSwitcherProps) => {
  const toggleLanguage = () => {
    const newLang: Language = language === "en" ? "vi" : "en";
    setLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
      title="Switch Language"
    >
      <Globe size={16} />
      <span>{language.toUpperCase()}</span>
    </button>
  );
};
