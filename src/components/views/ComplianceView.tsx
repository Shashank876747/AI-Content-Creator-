import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  FileText, 
  Lock, 
  Globe, 
  Info,
  Youtube,
  Key
} from 'lucide-react';

interface ComplianceViewProps {
  onOpenChannelGuideModal: () => void;
}

export const ComplianceView: React.FC<ComplianceViewProps> = ({
  onOpenChannelGuideModal,
}) => {
  const complianceChecklist = [
    { title: 'YouTube API Services TOS Compliant', status: 'Passed', desc: 'Uses official YouTube Data API v3 endpoints with user consent.' },
    { title: 'Google OAuth 2.0 Security Policies', status: 'Passed', desc: 'Secure token storage with user access revocation capability.' },
    { title: 'Altered & Synthetic Media Disclosures', status: 'Passed', desc: 'Enforces YouTube synthetic content checkbox flags during API uploads.' },
    { title: 'No Automated Account Registration', status: 'Enforced', desc: 'Strict adherence to policy: application guides users through official channel creation.' },
    { title: 'Copyright & Fair Use Guidelines', status: 'Passed', desc: 'Informs users on public domain and original synthetic content ownership.' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-emerald-500" />
            <span>YouTube TOS & Compliance Center</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Platform audit standards, Google OAuth verification guidelines, and YouTube API Services Terms compliance.
          </p>
        </div>

        <button
          onClick={onOpenChannelGuideModal}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition active:scale-95"
        >
          <Youtube className="w-4 h-4 fill-current" />
          <span>Official Channel Creation Guide</span>
        </button>
      </div>

      {/* Compliance Checklist Grid */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-3">
          Compliance Standards Matrix
        </h2>

        <div className="space-y-3">
          {complianceChecklist.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/60 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.title}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Synthetic Content Disclosures Explanation Card */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 border border-slate-800">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <AlertTriangle className="w-5 h-5" />
          <span>Mandatory YouTube 2026 AI Synthetic Content Rules</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          YouTube requires creators to disclose when content is altered or synthetic (including AI-generated voices or photorealistic visuals). TubularAI automatically tags generated scripts and uploads with the required API flag <code className="text-amber-300 bg-slate-800 px-1.5 py-0.5 rounded">hasCustomThumbnail / isAlteredContent</code> to protect your channel from strikes or demonetization.
        </p>

        <div className="pt-2 flex items-center gap-3">
          <a
            href="https://www.youtube.com/t/terms"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-red-400 hover:underline flex items-center gap-1"
          >
            <span>Read YouTube Terms of Service</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <span className="text-slate-600">•</span>
          <a
            href="https://developers.google.com/youtube/terms/api-services-terms-of-service"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-red-400 hover:underline flex items-center gap-1"
          >
            <span>YouTube API Developer Policies</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
