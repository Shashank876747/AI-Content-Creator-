import React from 'react';
import { Youtube, X, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ChannelGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChannelGuideModal: React.FC<ChannelGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      step: '1',
      title: 'Sign in to Google Account',
      description: 'Visit YouTube.com or Google Account portal and sign in with your target Google account credentials.',
    },
    {
      step: '2',
      title: 'Go to YouTube Channel Switcher',
      description: 'Navigate to youtube.com/channel_switcher to view existing channels or create a new Brand Account channel.',
    },
    {
      step: '3',
      title: 'Click "Create a channel"',
      description: 'Choose a distinct channel name (e.g. "TechPulse AI"), upload your profile image, and confirm custom handle.',
    },
    {
      step: '4',
      title: 'Connect Channel to TubularAI via OAuth',
      description: 'Return to TubularAI, click "Connect YouTube Channel", and grant YouTube Data API v3 permissions.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-6 border border-slate-200 dark:border-slate-700 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center font-bold">
            <Youtube className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              Official YouTube Channel Creation Guide
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Compliant walkthrough following Google OAuth & YouTube API policies.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {steps.map((s) => (
            <div key={s.step} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/60 flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-red-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {s.step}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{s.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{s.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[11px]">
            <strong>Note on Google Terms of Service:</strong> Automated Google or YouTube account registration without user verification is prohibited by Google. TubularAI strictly respects this policy by integrating via official OAuth authorization once your channel is created.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <a
            href="https://www.youtube.com/channel_switcher"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2"
          >
            <span>Open YouTube Channel Switcher</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
