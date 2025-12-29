import { Settings, List } from 'lucide-react';

interface AppTabsProps {
    activeTab: 'settings' | 'targets';
    setActiveTab: (tab: 'settings' | 'targets') => void;
}

export const AppTabs = ({ activeTab, setActiveTab }: AppTabsProps) => {
    return (
        <div className="bg-white px-6 pb-2 pt-0 shrink-0">
            <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'settings'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Settings size={14} /> Settings
                </button>
                <button
                    onClick={() => setActiveTab('targets')}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'targets'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <List size={14} /> Target List
                </button>
            </div>
        </div>
    );
};
