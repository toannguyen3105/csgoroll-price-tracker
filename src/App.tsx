import { useEffect, useState } from 'react';
import {
  AppHeader,
  AppTabs,
  PriceRangeManager,
  IntervalSettings,
  TelegramConfig,
  TargetItemManager,
  LiveDataTableContainer
} from '@/components';
import { storageHelper } from '@/storage_helper';
import { useConfigStore } from '@/store/useConfigStore';
import { useCrawlerListener, useWithdrawQuery } from '@/hooks';
import type { AppState, PriceRange, Intervals, TelegramConfig as ITelegramConfig, TargetItem } from '@/types';
import { Loader2 } from 'lucide-react';
import './i18n/config';

const App = () => {
  const [activeTab, setActiveTab] = useState<'settings' | 'targets'>('settings');
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const _hasHydrated = useConfigStore(state => state._hasHydrated);

  useCrawlerListener();
  useWithdrawQuery();

  const [priceRanges, setPriceRanges] = useState<PriceRange[]>([]);
  const [intervals, setIntervals] = useState<Intervals>({ rangeInterval: 10, batchInterval: 10, cycleDelay: 1.1 });
  const [telegramConfig, setTelegramConfig] = useState<ITelegramConfig>({ botToken: '', chatId: '' });
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
      const state: AppState = { priceRanges, intervals, telegramConfig, targetItems };
      await storageHelper.set(state);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveStatus('error');
    }
  };

  if (loading || !_hasHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="w-[900px] h-[600px] bg-gray-50 grid grid-cols-[380px_1fr] overflow-hidden">
      <div className="flex flex-col h-full border-r border-gray-200 min-h-0">
        <AppHeader />
        <AppTabs activeTab={activeTab} setActiveTab={setActiveTab} />

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
                'Save Settings'
              )}
            </button>
          </footer>
        )}
      </div>

      <div className="h-full bg-white">
        <LiveDataTableContainer />
      </div>
    </div>
  );
}

export default App;
