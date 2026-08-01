import React, { useState } from 'react';
import { YouTubeChannel } from '../types';
import { 
  Tv, 
  Plus, 
  Bell, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Sun, 
  Moon, 
  ChevronDown,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface HeaderProps {
  channels: YouTubeChannel[];
  activeChannel: YouTubeChannel | null;
  onSelectChannel: (channel: YouTubeChannel | null) => void;
  onOpenNewChannelModal: () => void;
  onOpenVideoStudio: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  channels = [],
  activeChannel,
  onSelectChannel,
  onOpenNewChannelModal,
  onOpenVideoStudio,
  darkMode = true,
  onToggleDarkMode,
  searchQuery = '',
  onSearchChange,
}) => {
  const [showChannelDropdown, setShowChannelDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Video Upload Complete', desc: 'Shorts Empire: "3 Mind-Blowing AI Facts" published.', time: '10m ago', type: 'success' },
    { id: 2, title: 'API Quota Healthy', desc: 'Quota usage at 24.5% across all 4 connected channels.', time: '1h ago', type: 'info' },
    { id: 3, title: 'Re-Auth Advisory', desc: 'Wealth & Automated Freedom token expires in 22h.', time: '3h ago', type: 'warning' },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 lg:px-8 flex items-center justify-between transition-colors">
      {/* Left: Search & Active Channel Switcher */}
      <div className="flex items-center gap-4">
        {/* Active Channel Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowChannelDropdown(!showChannelDropdown)}
            className="flex items-center gap-3 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left"
            id="channel-switcher-btn"
          >
            {activeChannel ? (
              <>
                <img
                  src={activeChannel.avatarUrl}
                  alt={activeChannel.title}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-red-500/50"
                  referrerPolicy="no-referrer"
                />
                <div className="hidden sm:block">
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight flex items-center gap-1.5">
                    {activeChannel.title}
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    {(activeChannel.subscribers / 1000).toFixed(1)}k subs • {activeChannel.category}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xs">
                  <Tv className="w-4 h-4" />
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                    All Channels ({channels.length})
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    Aggregated Portfolio View
                  </div>
                </div>
              </>
            )}
            <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
          </button>

          {/* Channel Selector Menu */}
          {showChannelDropdown && (
            <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700/60">
                Connected Youtube Channels
              </div>

              <button
                onClick={() => {
                  onSelectChannel(null);
                  setShowChannelDropdown(false);
                }}
                className={`w-full px-3 py-2.5 flex items-center gap-3 text-left hover:bg-slate-100 dark:hover:bg-slate-700/60 transition ${
                  !activeChannel ? 'bg-red-500/10 text-red-600 dark:text-red-400 font-medium' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xs">
                  <Tv className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold">All Channels Overview</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">View combined metrics</div>
                </div>
                {!activeChannel && <CheckCircle2 className="w-4 h-4 text-red-500" />}
              </button>

              <div className="my-1 border-t border-slate-100 dark:border-slate-700/60" />

              {channels.map((chan) => {
                const isSelected = activeChannel?.id === chan.id;
                return (
                  <button
                    key={chan.id}
                    onClick={() => {
                      onSelectChannel(chan);
                      setShowChannelDropdown(false);
                    }}
                    className={`w-full px-3 py-2.5 flex items-center gap-3 text-left hover:bg-slate-100 dark:hover:bg-slate-700/60 transition ${
                      isSelected ? 'bg-red-500/10 text-red-600 dark:text-red-400 font-medium' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <img
                      src={chan.avatarUrl}
                      alt={chan.title}
                      className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-600"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold truncate">{chan.title}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {chan.handle} • {(chan.subscribers / 1000).toFixed(1)}k subs
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-red-500" />}
                  </button>
                );
              })}

              <div className="my-1 border-t border-slate-100 dark:border-slate-700/60" />

              <button
                onClick={() => {
                  setShowChannelDropdown(false);
                  onOpenNewChannelModal();
                }}
                className="w-full px-3 py-2.5 flex items-center gap-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
              >
                <Plus className="w-4 h-4" />
                Connect New YouTube Channel
              </button>
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="relative hidden md:block w-64 lg:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search videos, scripts, keywords..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* YouTube API Status Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>YouTube API v3 Verified</span>
        </div>

        {/* AI Create Action */}
        <button
          onClick={onOpenVideoStudio}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-md shadow-red-500/20 active:scale-95 transition"
          id="quick-ai-create-btn"
        >
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          <span>Create with AI</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition relative"
            id="notifications-btn"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-3 px-4 z-50">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2 mb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Notifications</span>
                <span className="text-[10px] text-red-500 font-medium">3 New</span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title="Toggle Dark/Light Mode"
          id="theme-toggle-btn"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>
      </div>
    </header>
  );
};
