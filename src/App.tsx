import { useEffect, useState } from 'react';
import { PriceRangeManager } from './components/PriceRangeManager';
import { IntervalSettings } from './components/IntervalSettings';
import { TelegramConfig } from './components/TelegramConfig';
import { TargetItemManager } from './components/TargetItemManager';
import { storageHelper } from './storage_helper';
import { CrawlFeed } from './components/CrawlFeed';
import type { AppState, PriceRange, Intervals, TelegramConfig as ITelegramConfig, TargetItem } from './types';
import { Save, Loader2, Settings, List } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'settings' | 'targets'>('settings');
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // State
  const [priceRanges, setPriceRanges] = useState<PriceRange[]>([]);
  const [intervals, setIntervals] = useState<Intervals>({ rangeInterval: 10, batchInterval: 10, cycleDelay: 1.1 });
  const [telegramConfig, setTelegramConfig] = useState<ITelegramConfig>({
    botToken: '',
    chatId: ''
  });
  const [targetItems, setTargetItems] = useState<TargetItem[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await storageHelper.get(['priceRanges', 'intervals', 'telegramConfig', 'targetItems']);
        if (data.priceRanges) setPriceRanges(data.priceRanges);
        if (data.intervals) setIntervals(data.intervals);
        if (data.telegramConfig) setTelegramConfig(data.telegramConfig);
        if (data.targetItems) setTargetItems(data.targetItems);
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSaveSettings = async () => {
    setSaveStatus('saving');
    try {
      // We explicitly save settings here. Target items are auto-saved by their manager, 
      // but including them here ensures consistency if needed, though they manage their own persistence key.
      const state: AppState = {
        priceRanges,
        intervals,
        telegramConfig,
        targetItems
      };
      await storageHelper.set(state);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveStatus('error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="w-[900px] h-[600px] bg-gray-50 grid grid-cols-[380px_1fr] overflow-hidden">
      {/* Left Panel: Config */}
      <div className="flex flex-col h-full border-r border-gray-200 min-h-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Crawler Config</h1>
            <p className="text-xs text-gray-500">CSGORoll Price Tracker</p>
          </div>
        </header>

        {/* Tabs */}
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

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin min-h-0">
          {activeTab === 'settings' ? (
            <div className="space-y-6">
              <PriceRangeManager ranges={priceRanges} setRanges={setPriceRanges} />
              <IntervalSettings intervals={intervals} setIntervals={setIntervals} />
              <TelegramConfig config={telegramConfig} setConfig={setTelegramConfig} />
            </div>
          ) : (
            <div className="h-full">
              <TargetItemManager targetItems={targetItems} setTargetItems={setTargetItems} />
            </div>
          )}
        </main>

        {/* Footer (Only for Settings Tab) */}
        {activeTab === 'settings' && (
          <footer className="bg-white border-t border-gray-200 px-6 py-4 shrink-0">
            <button
              onClick={handleSaveSettings}
              disabled={saveStatus === 'saving'}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all transform active:scale-[0.98] ${saveStatus === 'success'
                ? 'bg-green-500 text-white hover:bg-green-600'
                : saveStatus === 'error'
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                }`}
            >
              {saveStatus === 'saving' ? (
                <Loader2 className="animate-spin" size={18} />
              ) : saveStatus === 'success' ? (
                <span>Saved Successfully!</span>
              ) : (
                <>
                  <Save size={18} />
                  Save Settings
                </>
              )}
            </button>
          </footer>
        )}
      </div>

      {/* Right Panel: Feed */}
      <div className="h-full bg-white">
        <CrawlFeed />
      </div>
    </div>
  );
}

export default App;
