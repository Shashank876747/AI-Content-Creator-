import React, { useState } from 'react';
import { YouTubeChannel, ChannelCategory } from '../../types';
import { Tv, X, Plus, Sparkles, Youtube, CheckCircle2, ShieldCheck, Key } from 'lucide-react';

interface NewChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddChannel: (channel: YouTubeChannel) => void;
  workspaceFolders: string[];
  onOpenChannelGuide: () => void;
}

export const NewChannelModal: React.FC<NewChannelModalProps> = ({
  isOpen,
  onClose,
  onAddChannel,
  workspaceFolders,
  onOpenChannelGuide,
}) => {
  const [channelTitle, setChannelTitle] = useState('');
  const [handle, setHandle] = useState('');
  const [category, setCategory] = useState<ChannelCategory>('Tech & AI');
  const [folder, setFolder] = useState(workspaceFolders[0] || 'Main Tech Portfolio');

  if (!isOpen) return null;

  const handleConnectOAuth = async () => {
    try {
      const res = await fetch('/api/auth/url');
      const data = await res.json();
      if (data.url) {
        window.open(data.url, 'youtube_oauth', 'width=600,height=700');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelTitle.trim()) return;

    const newChan: YouTubeChannel = {
      id: `chan-${Date.now()}`,
      title: channelTitle,
      handle: handle.startsWith('@') ? handle : `@${handle || channelTitle.replace(/\s+/g, '')}`,
      avatarUrl: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80`,
      subscribers: 1200,
      totalViews: 45000,
      videoCount: 8,
      category,
      folder,
      health: {
        apiQuotaUsed: 150,
        apiQuotaLimit: 10000,
        copyrightStrikes: 0,
        communityStrikes: 0,
        shadowbanRisk: 'Low',
        authStatus: 'Connected',
        lastSyncedAt: 'Just now',
      },
      isMonetized: false,
      estMonthlyRevenue: 0,
      avgCtr: 7.8,
      connectedAt: new Date().toISOString().split('T')[0],
    };

    onAddChannel(newChan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 border border-slate-200 dark:border-slate-700 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center font-bold mb-2">
            <Youtube className="w-6 h-6 fill-current" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            Connect YouTube Channel
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Authorize your existing YouTube channel via Google OAuth 2.0 or link a new channel.
          </p>
        </div>

        {/* OAuth Button */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
          <button
            type="button"
            onClick={handleConnectOAuth}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 transition active:scale-95"
            id="modal-oauth-connect-btn"
          >
            <Key className="w-4 h-4" />
            <span>Connect with Google OAuth 2.0</span>
          </button>
          <p className="text-[10px] text-slate-400 text-center">
            Redirects securely to Google's official sign-in consent screen.
          </p>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
          <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-400 uppercase">Or Link Existing Channel Details</span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleManualAdd} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              YouTube Channel Title
            </label>
            <input
              type="text"
              required
              value={channelTitle}
              onChange={(e) => setChannelTitle(e.target.value)}
              placeholder="e.g. AI Frontier Daily"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Handle
              </label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@AIFrontier"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
              >
                <option value="Tech & AI">Tech & AI</option>
                <option value="Gaming">Gaming</option>
                <option value="Education">Education</option>
                <option value="Documentary">Documentary</option>
                <option value="Shorts">Shorts</option>
                <option value="Finance">Finance</option>
                <option value="Lifestyle">Lifestyle</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Workspace Folder
            </label>
            <select
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
            >
              {workspaceFolders.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div className="pt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={onOpenChannelGuide}
              className="text-xs text-red-500 font-bold hover:underline"
            >
              Need to create a YouTube channel first?
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md"
              >
                Connect Channel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
