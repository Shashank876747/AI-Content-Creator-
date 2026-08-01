import React, { useState } from 'react';
import { YouTubeChannel, VideoProject, PipelineItem } from '../../types';
import { 
  Kanban as KanbanIcon, 
  Plus, 
  Play, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  MoveRight, 
  MoveLeft,
  Tv,
  ListFilter
} from 'lucide-react';

interface KanbanViewProps {
  channels: YouTubeChannel[];
  activeChannel: YouTubeChannel | null;
  videos: VideoProject[];
  pipelines: PipelineItem[];
  onUpdateVideoStatus: (videoId: string, newStatus: VideoProject['status']) => void;
  onOpenVideoStudioWithTopic: (topic: string) => void;
  onOpenNewPipelineModal: () => void;
}

export const KanbanView: React.FC<KanbanViewProps> = ({
  channels,
  activeChannel,
  videos,
  pipelines,
  onUpdateVideoStatus,
  onOpenVideoStudioWithTopic,
  onOpenNewPipelineModal,
}) => {
  const [selectedChannelFilter, setSelectedChannelFilter] = useState<string>('ALL');

  const stages: VideoProject['status'][] = [
    'Idea',
    'Scripting',
    'Audio & Visuals',
    'Review & Approval',
    'Scheduled',
    'Published',
  ];

  const filteredVideos = videos.filter((v) => {
    if (selectedChannelFilter !== 'ALL' && v.channelId !== selectedChannelFilter) return false;
    if (activeChannel && selectedChannelFilter === 'ALL' && v.channelId !== activeChannel.id) return false;
    return true;
  });

  const getNextStage = (curr: VideoProject['status']): VideoProject['status'] | null => {
    const idx = stages.indexOf(curr);
    return idx < stages.length - 1 ? stages[idx + 1] : null;
  };

  const getPrevStage = (curr: VideoProject['status']): VideoProject['status'] | null => {
    const idx = stages.indexOf(curr);
    return idx > 0 ? stages[idx - 1] : null;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <KanbanIcon className="w-7 h-7 text-red-500" />
            <span>Content Production Board & Pipelines</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track video pipeline stages from idea generation to automated YouTube publication.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Channel Filter */}
          <select
            value={selectedChannelFilter}
            onChange={(e) => setSelectedChannelFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Channels ({videos.length})</option>
            {channels.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>

          <button
            onClick={onOpenNewPipelineModal}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Pipeline</span>
          </button>
        </div>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-6">
        {stages.map((stage) => {
          const stageVideos = filteredVideos.filter((v) => v.status === stage);
          return (
            <div
              key={stage}
              className="p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 min-w-[220px] flex flex-col space-y-3"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-2 py-1 border-b border-slate-200 dark:border-slate-700/60">
                <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  {stage}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  {stageVideos.length}
                </span>
              </div>

              {/* Column Content */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                {stageVideos.map((vid) => {
                  const channelObj = channels.find((c) => c.id === vid.channelId);
                  const prev = getPrevStage(vid.status);
                  const next = getNextStage(vid.status);

                  return (
                    <div
                      key={vid.id}
                      className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-2.5 hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                        <Tv className="w-3 h-3 text-red-500" />
                        <span className="truncate">{channelObj?.title || 'TechPulse'}</span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2">
                        {vid.title}
                      </h4>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-700/60">
                        <span>{vid.videoType}</span>
                        <span>{vid.targetLength}</span>
                      </div>

                      {/* Stage Movement Controls */}
                      <div className="flex items-center justify-between pt-1">
                        {prev ? (
                          <button
                            onClick={() => onUpdateVideoStatus(vid.id, prev)}
                            className="p-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-red-500"
                            title={`Move back to ${prev}`}
                          >
                            <MoveLeft className="w-3.5 h-3.5" />
                          </button>
                        ) : <div />}

                        {next && (
                          <button
                            onClick={() => onUpdateVideoStatus(vid.id, next)}
                            className="p-1 rounded bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white transition"
                            title={`Move forward to ${next}`}
                          >
                            <MoveRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
