import React, { useState } from 'react';
import { YouTubeChannel, VideoProject, PipelineItem } from '../../types';
import { 
  Users, 
  Eye, 
  DollarSign, 
  TrendingUp, 
  Sparkles, 
  Play, 
  ArrowUpRight, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Tv, 
  Plus, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface DashboardViewProps {
  channels: YouTubeChannel[];
  activeChannel: YouTubeChannel | null;
  videos: VideoProject[];
  pipelines: PipelineItem[];
  onOpenVideoStudio: (topic?: string) => void;
  onNavigateToView: (view: any) => void;
  onOpenNewChannelModal: () => void;
  onSyncGoogleChannels?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  channels,
  activeChannel,
  videos,
  pipelines,
  onOpenVideoStudio,
  onNavigateToView,
  onOpenNewChannelModal,
  onSyncGoogleChannels,
}) => {
  const [quickTopic, setQuickTopic] = useState('');

  // Calculate metrics based on activeChannel or all channels
  const targetChannels = activeChannel ? [activeChannel] : channels;
  const totalSubscribers = targetChannels.reduce((acc, c) => acc + c.subscribers, 0);
  const totalViews = targetChannels.reduce((acc, c) => acc + c.totalViews, 0);
  const totalRevenue = targetChannels.reduce((acc, c) => acc + c.estMonthlyRevenue, 0);
  const avgCtr = targetChannels.length > 0 ? (targetChannels.reduce((acc, c) => acc + (c.avgCtr || 0), 0) / targetChannels.length).toFixed(1) : '0.0';

  const filteredVideos = activeChannel
    ? videos.filter((v) => v.channelId === activeChannel.id)
    : videos;

  const scheduledVideos = filteredVideos.filter((v) => v.status === 'Scheduled');
  const publishedVideos = filteredVideos.filter((v) => v.status === 'Published');

  const handleQuickCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTopic.trim()) return;
    onOpenVideoStudio(quickTopic);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner / Welcome */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 p-6 md:p-8 text-white shadow-2xl border border-slate-700/60">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Multi-Channel Automation Operating System</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight">
            {activeChannel ? `Managing ${activeChannel.title}` : 'YouTube Multi-Channel Dashboard'}
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Automate content research, scriptwriting, voiceover synthesis, thumbnail design, and compliant upload scheduling with official YouTube API v3 integration.
          </p>

          {/* Quick AI Topic Launcher Form */}
          <form onSubmit={handleQuickCreate} className="pt-2 flex flex-col sm:flex-row gap-2 max-w-xl">
            <input
              type="text"
              placeholder="e.g. 5 Autonomous AI Agent Tools in 2026..."
              value={quickTopic}
              onChange={(e) => setQuickTopic(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-600 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition active:scale-95 shrink-0"
              id="dashboard-quick-generate-btn"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Generate Video</span>
            </button>
          </form>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-red-600/10 blur-3xl pointer-events-none"></div>
      </div>

      {channels.length === 0 && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-red-500/10 via-amber-500/5 to-slate-900/10 border-2 border-dashed border-red-500/30 dark:border-red-500/20 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold shrink-0 shadow-lg shadow-red-500/20">
              <Tv className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                Link Your YouTube Channel
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
                Connect your real YouTube channel via Google OAuth 2.0 or link by channel handle to sync subscriber stats, videos, and automated publishing.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            {onSyncGoogleChannels && (
              <button
                onClick={onSyncGoogleChannels}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 transition active:scale-95"
                id="link-yt-google-oauth-btn"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Link Google YouTube Account</span>
              </button>
            )}
            <button
              onClick={onOpenNewChannelModal}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-slate-100 font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 transition"
              id="link-yt-custom-modal-btn"
            >
              <Plus className="w-4 h-4" />
              <span>Link Custom Handle</span>
            </button>
          </div>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Subscribers */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Audience</span>
            <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {totalSubscribers.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+12.4% this month</span>
            </div>
          </div>
        </div>

        {/* Total Views */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Lifetime Views</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {(totalViews / 1000000).toFixed(2)}M
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.9% 30-day velocity</span>
            </div>
          </div>
        </div>

        {/* Est Revenue */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Est Monthly Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
              ${totalRevenue.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+14.2% monetized RPM</span>
            </div>
          </div>
        </div>

        {/* Average CTR */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Avg Impression CTR</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {avgCtr}%
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Optimized with AI Thumbnails</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Connected Channels & Scheduled Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Connected Channels List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Tv className="w-5 h-5 text-red-500" />
              <span>Connected YouTube Channels ({channels.length})</span>
            </h2>
            <button
              onClick={onOpenNewChannelModal}
              className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Channel</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {channels.map((chan) => (
              <div
                key={chan.id}
                className={`p-5 rounded-2xl border transition-all ${
                  activeChannel?.id === chan.id
                    ? 'bg-red-500/5 border-red-500/50 shadow-md ring-1 ring-red-500/30'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={chan.avatarUrl}
                    alt={chan.title}
                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{chan.title}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {chan.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{chan.handle}</p>
                    <div className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span>{(chan.subscribers / 1000).toFixed(1)}k subs</span>
                      <span className="text-emerald-600 dark:text-emerald-400">${chan.estMonthlyRevenue}/mo</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>OAuth Valid</span>
                  </div>
                  <button
                    onClick={() => onNavigateToView('channels')}
                    className="font-bold text-red-600 dark:text-red-400 hover:underline"
                  >
                    Manage & Settings &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (1 col): Scheduled Uploads & Active Pipelines */}
        <div className="space-y-6">
          {/* Scheduled Queue */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-red-500" />
                <span>Scheduled Uploads</span>
              </h2>
              <button
                onClick={() => onNavigateToView('publishing')}
                className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
              >
                View All ({scheduledVideos.length})
              </button>
            </div>

            {scheduledVideos.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">
                No videos currently scheduled for release.
              </div>
            ) : (
              <div className="space-y-3">
                {scheduledVideos.map((vid) => (
                  <div key={vid.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 space-y-2">
                    <div className="flex items-start gap-3">
                      {vid.thumbnailUrl ? (
                        <img
                          src={vid.thumbnailUrl}
                          alt={vid.title}
                          className="w-14 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-14 h-10 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                          <Play className="w-4 h-4" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
                          {vid.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                          <Clock className="w-3 h-3 text-amber-500" />
                          <span>{vid.scheduledPublishTime ? new Date(vid.scheduledPublishTime).toLocaleDateString() : 'Auto Queue'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Pipelines */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Automated Pipelines</span>
              </h2>
              <button
                onClick={() => onNavigateToView('kanban')}
                className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
              >
                Kanban
              </button>
            </div>

            <div className="space-y-3">
              {pipelines.map((p) => (
                <div key={p.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{p.name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{p.trigger} • Stage: {p.currentStage}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
