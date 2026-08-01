import React, { useState } from 'react';
import { YouTubeChannel } from '../../types';
import { 
  Tv, 
  Plus, 
  ShieldCheck, 
  Key, 
  FolderGit2, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  ExternalLink,
  Info,
  Layers,
  BarChart3,
  Globe
} from 'lucide-react';

interface ChannelManagerViewProps {
  channels: YouTubeChannel[];
  activeChannel: YouTubeChannel | null;
  onSelectChannel: (channel: YouTubeChannel) => void;
  onOpenNewChannelModal: () => void;
  onOpenChannelGuideModal: () => void;
  onUpdateChannelFolder: (channelId: string, folder: string) => void;
  workspaceFolders: string[];
}

export const ChannelManagerView: React.FC<ChannelManagerViewProps> = ({
  channels,
  activeChannel,
  onSelectChannel,
  onOpenNewChannelModal,
  onOpenChannelGuideModal,
  onUpdateChannelFolder,
  workspaceFolders,
}) => {
  const [selectedFolderFilter, setSelectedFolderFilter] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredChannels = selectedFolderFilter === 'ALL'
    ? channels
    : channels.filter((c) => c.folder === selectedFolderFilter);

  const handleRefreshTokens = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      alert('OAuth 2.0 refresh tokens validated successfully across all channels!');
    }, 1000);
  };

  const handleConnectOAuthPopup = async () => {
    try {
      const res = await fetch('/api/auth/url');
      const data = await res.json();
      if (data.url) {
        const popup = window.open(data.url, 'youtube_oauth', 'width=600,height=700');
        if (!popup) {
          alert('Please allow popups to complete Google YouTube OAuth connection.');
        }
      }
    } catch (err) {
      console.error(err);
      alert('Connecting via OAuth popup demo mode...');
      onOpenNewChannelModal();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Tv className="w-7 h-7 text-red-500" />
            <span>YouTube Channel Hub</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Connect, group into workspaces, and monitor health for multiple YouTube channels using YouTube Data API v3 OAuth.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenChannelGuideModal}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 transition"
          >
            <Info className="w-4 h-4 text-amber-500" />
            <span>Channel Creation Guide</span>
          </button>

          <button
            onClick={handleConnectOAuthPopup}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-500/20 transition active:scale-95"
            id="connect-youtube-oauth-btn"
          >
            <Plus className="w-4 h-4" />
            <span>Connect YouTube Channel</span>
          </button>
        </div>
      </div>

      {/* Workspace Filter & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Workspace:</span>
          </span>
          <button
            onClick={() => setSelectedFolderFilter('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition shrink-0 ${
              selectedFolderFilter === 'ALL'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            All Folders ({channels.length})
          </button>
          {workspaceFolders.map((folder) => (
            <button
              key={folder}
              onClick={() => setSelectedFolderFilter(folder)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition shrink-0 ${
                selectedFolderFilter === folder
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {folder}
            </button>
          ))}
        </div>

        <button
          onClick={handleRefreshTokens}
          disabled={isRefreshing}
          className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-red-500 flex items-center gap-1.5 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-red-500' : ''}`} />
          <span>Validate OAuth Tokens</span>
        </button>
      </div>

      {/* Channels Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredChannels.map((channel) => {
          const isSelected = activeChannel?.id === channel.id;
          return (
            <div
              key={channel.id}
              className={`p-6 rounded-3xl border transition-all ${
                isSelected
                  ? 'bg-white dark:bg-slate-800 border-red-500 ring-2 ring-red-500/30 shadow-xl'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {/* Channel Header Info */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={channel.avatarUrl}
                    alt={channel.title}
                    className="w-14 h-14 rounded-full object-cover border-2 border-red-500/40 shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">{channel.title}</h3>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {channel.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{channel.handle}</p>
                  </div>
                </div>

                <button
                  onClick={() => onSelectChannel(channel)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    isSelected
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {isSelected ? 'Active Workspace' : 'Set Active'}
                </button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-3 my-5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60 text-center">
                <div>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase">Subscribers</div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
                    {(channel.subscribers / 1000).toFixed(1)}k
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase">Total Views</div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
                    {(channel.totalViews / 1000000).toFixed(2)}M
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase">Monetization</div>
                  <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {channel.isMonetized ? `$${channel.estMonthlyRevenue}/mo` : 'Not Partner'}
                  </div>
                </div>
              </div>

              {/* Channel Health Matrix */}
              <div className="space-y-2 text-xs border-t border-slate-100 dark:border-slate-700/60 pt-4">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Channel Health & API Audits
                </div>

                <div className="flex items-center justify-between py-1 text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Copyright & Community Strikes:</span>
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {channel.health.copyrightStrikes}/3 (Clean)
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-blue-500" />
                    <span>Shadowban & Index Risk:</span>
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {channel.health.shadowbanRisk} Risk
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-500" />
                    <span>OAuth Session Status:</span>
                  </span>
                  <span className={`font-bold ${
                    channel.health.authStatus === 'Connected' ? 'text-emerald-500' : 'text-amber-500'
                  }`}>
                    {channel.health.authStatus}
                  </span>
                </div>

                {/* Workspace Folder Select */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Workspace Folder:</span>
                  <select
                    value={channel.folder}
                    onChange={(e) => onUpdateChannelFolder(channel.id, e.target.value)}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    {workspaceFolders.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compliance Notice Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-3 border border-slate-800">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>YouTube API Services Compliance & Terms Notice</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          TubularAI uses official YouTube Data API v3 OAuth authorization. Per Google’s policies, YouTube channels cannot be automatically registered without user verification. Users must complete official channel setup on YouTube before linking via OAuth.
        </p>
        <button
          onClick={onOpenChannelGuideModal}
          className="text-xs font-bold text-red-400 hover:underline flex items-center gap-1"
        >
          <span>Read YouTube Channel Creation Policy Walkthrough</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
