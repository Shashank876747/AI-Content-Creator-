import React, { useState } from 'react';
import { PipelineItem } from '../../types';
import { Sparkles, X, Plus } from 'lucide-react';

interface NewPipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPipeline: (pipeline: PipelineItem) => void;
}

export const NewPipelineModal: React.FC<NewPipelineModalProps> = ({
  isOpen,
  onClose,
  onAddPipeline,
}) => {
  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState('Daily Schedule at 09:00 EST');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPipeline: PipelineItem = {
      id: `pipe-${Date.now()}`,
      name,
      channelId: 'chan-1',
      trigger: trigger as any,
      currentStage: 'Topic Research',
      autoApprove: false,
      lastRunAt: 'Just now',
      nextRunAt: 'Tomorrow 09:00',
      itemsProcessed: 1,
      status: 'Active',
    };

    onAddPipeline(newPipeline);
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-slate-700 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Create Automation Pipeline</h3>
            <p className="text-xs text-slate-500">Auto-trigger scriptwriting, rendering, and uploads.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Pipeline Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Daily Tech News Shorts Pipeline"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Trigger Condition</label>
            <select
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
            >
              <option value="Daily Schedule at 09:00 EST">Daily Schedule at 09:00 EST</option>
              <option value="On Trending Topic Outlier (>200% growth)">On Trending Topic Outlier (&gt;200% growth)</option>
              <option value="Every Mon, Wed, Fri at 17:00 EST">Every Mon, Wed, Fri at 17:00 EST</option>
              <option value="Manual Trigger Only">Manual Trigger Only</option>
            </select>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md"
            >
              Create Pipeline
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
