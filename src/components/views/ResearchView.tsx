import React, { useState } from 'react';
import { ResearchTopic, CompetitorChannel } from '../../types';
import { 
  Sparkles, 
  Search, 
  TrendingUp, 
  BarChart2, 
  Eye, 
  Plus, 
  Calendar as CalendarIcon, 
  ArrowUpRight, 
  Save, 
  Check, 
  Loader2,
  Users,
  Compass
} from 'lucide-react';

interface ResearchViewProps {
  researchTopics: ResearchTopic[];
  competitors: CompetitorChannel[];
  onSaveTopicToIdeas: (topic: ResearchTopic) => void;
  onOpenVideoStudioWithTopic: (topicTitle: string) => void;
}

export const ResearchView: React.FC<ResearchViewProps> = ({
  researchTopics,
  competitors,
  onSaveTopicToIdeas,
  onOpenVideoStudioWithTopic,
}) => {
  const [selectedNiche, setSelectedNiche] = useState('Tech & AI');
  const [keywordQuery, setKeywordQuery] = useState('');
  const [isLoadingAiResearch, setIsLoadingAiResearch] = useState(false);
  const [localTopics, setLocalTopics] = useState<ResearchTopic[]>(researchTopics);
  const [activeTab, setActiveTab] = useState<'trends' | 'competitors' | 'calendar'>('trends');

  const handleRunAiResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingAiResearch(true);

    try {
      const res = await fetch('/api/gemini/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche: selectedNiche, searchKeyword: keywordQuery }),
      });
      const data = await res.json();

      if (data.trendingTopics && Array.isArray(data.trendingTopics)) {
        const mapped: ResearchTopic[] = data.trendingTopics.map((item: any, idx: number) => ({
          id: `res-gen-${Date.now()}-${idx}`,
          topic: item.topic,
          niche: selectedNiche,
          searchVolume: item.searchVolume || 180000,
          competition: item.competition || 'Medium',
          searchGrowthRate: item.searchGrowthRate || '+115%',
          ctrPotential: item.ctrPotential || '10.2%',
          videoAngle: item.videoAngle || 'In-depth analysis with visual benchmarks.',
          savedToIdeas: false,
        }));
        setLocalTopics(mapped);
      }
    } catch (err) {
      console.error('Error running AI research:', err);
    } finally {
      setIsLoadingAiResearch(false);
    }
  };

  const calendarDays = [
    { day: 'Mon 03', topic: 'How AI Automation Replaces Office Software', status: 'Scheduled' },
    { day: 'Wed 05', topic: 'Top 5 AI Voice Models Tested Live', status: 'Drafting' },
    { day: 'Fri 07', topic: 'Shorts: 3 Mind-Blowing AI Facts', status: 'Published' },
    { day: 'Mon 10', topic: 'Building a $10,000/Mo Channel Empire', status: 'Planned' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Sparkles className="w-7 h-7 text-amber-500 fill-amber-500/20" />
            <span>AI Content Research & Topic Finder</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Discover high-CTR video topics, analyze search demand, monitor competitor channels, and build your content calendar.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('trends')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'trends' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Trending Topics
          </button>
          <button
            onClick={() => setActiveTab('competitors')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'competitors' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Competitors
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'calendar' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Content Calendar
          </button>
        </div>
      </div>

      {activeTab === 'trends' && (
        <div className="space-y-6">
          {/* AI Search & Filter Panel */}
          <form onSubmit={handleRunAiResearch} className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Target Niche
                </label>
                <select
                  value={selectedNiche}
                  onChange={(e) => setSelectedNiche(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Tech & AI">Tech & AI</option>
                  <option value="Finance & Wealth">Finance & Wealth</option>
                  <option value="Gaming & Esports">Gaming & Esports</option>
                  <option value="Documentary & Crime">Documentary & Mystery</option>
                  <option value="Shorts & Entertainment">Shorts & Viral</option>
                  <option value="Productivity & Education">Productivity & Education</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Filter Keyword / Topic Seed (Optional)
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. AI Automation, Faceless Channels, RPM..."
                      value={keywordQuery}
                      onChange={(e) => setKeywordQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoadingAiResearch}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-amber-500/20 transition active:scale-95 shrink-0"
                    id="run-ai-research-btn"
                  >
                    {isLoadingAiResearch ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Analyzing Trends...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 fill-current" />
                        <span>Discover Topics</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Topics List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {localTopics.map((topic) => (
              <div
                key={topic.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4 hover:border-amber-500/50 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    {topic.niche}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{topic.searchGrowthRate} Growth</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {topic.topic}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Angle:</span> {topic.videoAngle}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-700/60 text-center text-xs">
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400">Search Vol</div>
                    <div className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
                      {(topic.searchVolume / 1000).toFixed(0)}k/mo
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400">Competition</div>
                    <div className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
                      {topic.competition}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400">Est CTR</div>
                    <div className="font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {topic.ctrPotential}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => onSaveTopicToIdeas(topic)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1.5 transition"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Idea</span>
                  </button>

                  <button
                    onClick={() => onOpenVideoStudioWithTopic(topic.topic)}
                    className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    <span>Generate Script &rarr;</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'competitors' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Compass className="w-5 h-5 text-red-500" />
                <span>Monitored Competitor Channels</span>
              </h2>
              <span className="text-xs text-slate-500">Tracking 3 Niche Leaders</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {competitors.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={c.avatarUrl} alt={c.channelName} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{c.channelName}</div>
                      <div className="text-xs text-slate-500">{c.subscribers} subs • {c.uploadFrequency}</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-xs">
                    <div className="text-[10px] font-bold text-amber-500 uppercase">Top Outlier Video</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1 mt-0.5">{c.topVideoTitle}</div>
                    <div className="text-[10px] text-emerald-600 font-extrabold mt-1">Outlier Velocity: {c.outlierRatio}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-red-500" />
            <span>Automated Content Calendar</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            {calendarDays.map((cd, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <div className="text-xs font-bold text-red-500 flex items-center justify-between">
                  <span>{cd.day}</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold">{cd.status}</span>
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{cd.topic}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
