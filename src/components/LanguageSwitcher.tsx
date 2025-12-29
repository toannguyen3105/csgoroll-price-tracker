import React from 'react';
import { Globe } from 'lucide-react';
import { useConfigStore } from '@/store/useConfigStore';
import type { Language } from '@/store/useConfigStore';

export const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useConfigStore();

    const toggleLanguage = () => {
        const newLang: Language = language === 'en' ? 'vi' : 'en';
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
