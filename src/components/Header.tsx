import React, { useState } from 'react';
import { YouTubeChannel } from '../types';
import { User } from 'firebase/auth';
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
  LogOut,
  UserCheck
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
  user?: User | null;
  onSignInGoogle?: () => void;
  onSignOut?: () => void;
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
  user,
  onSignInGoogle,
  onSignOut,
}) => {
  const [showChannelDropdown, setShowChannelDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

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

        {/* Google Account Auth Button / Status */}
        <div className="relative">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition"
                id="google-user-profile-btn"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'Google User'} className="w-6 h-6 rounded-full ring-2 ring-emerald-500/50" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                    {user.displayName?.[0] || 'G'}
                  </div>
                )}
                <div className="hidden lg:block text-left">
                  <div className="text-[11px] font-bold leading-tight truncate max-w-[100px]">{user.displayName || 'Google User'}</div>
                  <div className="text-[9px] text-emerald-500/80 flex items-center gap-1">
                    <UserCheck className="w-2.5 h-2.5" /> Google Sync Active
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-3 px-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-3 mb-2">
                    {user.photoURL && <img src={user.photoURL} alt={user.displayName || ''} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />}
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{user.displayName || 'Google User'}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.email}</div>
                      <span className="inline-flex items-center gap-1 text-[9px] text-emerald-500 font-semibold mt-1 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Google Account Linked
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onSignOut?.();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition text-left mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out Google Account
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onSignInGoogle}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition shadow-sm active:scale-95"
              id="connect-google-account-btn"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Connect Google Account</span>
            </button>
          )}
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

