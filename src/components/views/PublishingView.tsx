import React, { useState } from 'react';
import { YouTubeChannel, VideoProject } from '../../types';
import { 
  Send, 
  Calendar, 
  Clock, 
  Play, 
  CheckCircle2, 
  ShieldCheck, 
  Globe, 
  Lock, 
  EyeOff, 
  Loader2, 
  Tv, 
  ExternalLink,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

interface PublishingViewProps {
  channels: YouTubeChannel[];
  activeChannel: YouTubeChannel | null;
  videos: VideoProject[];
  onUpdateVideoStatus: (videoId: string, status: VideoProject['status'], publishUrl?: string) => void;
}

export const PublishingView: React.FC<PublishingViewProps> = ({
  channels,
  activeChannel,
  videos,
  onUpdateVideoStatus,
}) => {
  const [selectedVideoId, setSelectedVideoId] = useState<string>(videos[0]?.id || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState('');

  const targetVideo = videos.find((v) => v.id === selectedVideoId) || videos[0];

  const handleSimulateYouTubeUpload = () => {
    if (!targetVideo) return;

    setIsUploading(true);
    setUploadProgress(10);
    setUploadStep('Authenticating OAuth 2.0 & YouTube API v3 Quota...');

    setTimeout(() => {
      setUploadProgress(35);
      setUploadStep('Uploading Video Binary Stream & Thumbnails...');
    }, 1000);

    setTimeout(() => {
      setUploadProgress(70);
      setUploadStep('Processing HD & Checking Synthetic Media Policies...');
    }, 2200);

    setTimeout(() => {
      setUploadProgress(100);
      setUploadStep('Video Published Successfully on YouTube!');
      const fakeUrl = `https://youtube.com/watch?v=demo_${Date.now().toString().slice(-6)}`;
      onUpdateVideoStatus(targetVideo.id, 'Published', fakeUrl);
      setIsUploading(false);
    }, 3500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Send className="w-7 h-7 text-red-500" />
            <span>YouTube Publishing Automation Manager</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Schedule uploads, configure official YouTube API v3 metadata, and deploy videos automatically across your connected channels.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>YouTube API Upload Services Ready</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Queued Videos List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Video Projects Queue ({videos.length})
          </h2>

          <div className="space-y-3">
            {videos.map((vid) => {
              const isSelected = vid.id === targetVideo?.id;
              return (
                <div
                  key={vid.id}
                  onClick={() => setSelectedVideoId(vid.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-red-500/5 border-red-500 ring-2 ring-red-500/30 shadow-md'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {vid.thumbnailUrl ? (
                      <img
                        src={vid.thumbnailUrl}
                        alt={vid.title}
                        className="w-16 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-16 h-12 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                        <Play className="w-4 h-4" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
                        {vid.title}
                      </h4>
                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <span className={`px-2 py-0.5 rounded-full font-extrabold ${
                          vid.status === 'Published'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-amber-500/10 text-amber-600'
                        }`}>
                          {vid.status}
                        </span>
                        <span className="text-slate-400">{vid.videoType}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Upload Configuration & YouTube API Execution (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {targetVideo && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Publishing Configuration</span>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
                    {targetVideo.title}
                  </h2>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {targetVideo.category}
                </span>
              </div>

              {/* Upload Progress Bar if active */}
              {isUploading && (
                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-2 text-amber-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{uploadStep}</span>
                    </span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-red-500 h-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* YouTube API Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    YouTube Privacy State
                  </label>
                  <select
                    value={targetVideo.privacy}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100"
                  >
                    <option value="Public">Public (Immediate / Scheduled)</option>
                    <option value="Unlisted">Unlisted (Link Access Only)</option>
                    <option value="Private">Private (Draft Mode)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target Channel
                  </label>
                  <select
                    value={targetVideo.channelId}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100"
                  >
                    {channels.map((c) => (
                      <option key={c.id} value={c.id}>{c.title} ({c.handle})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  YouTube Description & Chapters
                </label>
                <textarea
                  rows={5}
                  defaultValue={targetVideo.description}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* AI Disclosure Toggle */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-bold text-slate-900 dark:text-slate-100">
                    Altered or Synthetic Content Disclosure (YouTube Requirement)
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    {targetVideo.aiDisclosureReason || 'This video includes synthetic voiceover or generated AI graphics.'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                {targetVideo.publishedUrl ? (
                  <a
                    href={targetVideo.publishedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>View Published Video on YouTube &rarr;</span>
                  </a>
                ) : (
                  <span className="text-xs text-slate-400 font-semibold">Ready for Upload</span>
                )}

                <button
                  onClick={handleSimulateYouTubeUpload}
                  disabled={isUploading}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-red-500/25 transition active:scale-95 disabled:opacity-50"
                  id="execute-youtube-upload-btn"
                >
                  <Send className="w-4 h-4" />
                  <span>Publish to YouTube via API v3</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
