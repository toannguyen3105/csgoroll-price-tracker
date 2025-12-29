import { LanguageSwitcher } from '../LanguageSwitcher';

export const AppHeader = () => {
    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
            <div>
                <h1 className="text-xl font-bold text-gray-800">Crawler Config</h1>
                <p className="text-xs text-gray-500">CSGORoll Price Tracker</p>
            </div>
            <LanguageSwitcher />
        </header>
    );
};
