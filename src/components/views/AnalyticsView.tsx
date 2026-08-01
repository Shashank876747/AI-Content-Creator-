import React, { useState } from 'react';
import { YouTubeChannel, AnalyticsDataPoint } from '../../types';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Sparkles, 
  ShieldCheck, 
  DollarSign, 
  Eye, 
  Users, 
  Clock, 
  FileSpreadsheet, 
  FileText, 
  Loader2,
  Tv
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  LineChart, 
  Line 
} from 'recharts';

interface AnalyticsViewProps {
  channels: YouTubeChannel[];
  activeChannel: YouTubeChannel | null;
  analyticsData: AnalyticsDataPoint[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  channels,
  activeChannel,
  analyticsData,
}) => {
  const [metricTab, setMetricTab] = useState<'views' | 'revenue' | 'retention'>('views');
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [aiInsights, setAiInsights] = useState<any>(null);

  const handleFetchAiInsights = async () => {
    setIsLoadingInsights(true);
    try {
      const res = await fetch('/api/gemini/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelName: activeChannel ? activeChannel.title : 'All Channels Combined',
          subscriberCount: activeChannel ? activeChannel.subscribers : 598000,
          views30d: activeChannel ? activeChannel.totalViews : 3600000,
          ctrAvg: activeChannel ? `${activeChannel.avgCtr}%` : '8.4%',
          avgRetention: '46%',
        }),
      });
      const data = await res.json();
      setAiInsights(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Date', 'Views', 'Subscribers Gained', 'Watch Time (Hours)', 'Revenue ($)', 'CTR (%)'];
    const rows = analyticsData.map((d) => [d.date, d.views, d.subscribersGained, d.watchTimeHours, d.revenueEst, d.avgCtr]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `YouTube_Analytics_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-red-500" />
            <span>YouTube Analytics & AI Growth Audit</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time performance tracking, revenue analysis, retention curves, and Gemini AI strategy recommendations.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 flex items-center gap-1.5 transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={exportPDF}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 flex items-center gap-1.5 transition"
          >
            <FileText className="w-4 h-4 text-blue-500" />
            <span>Print PDF</span>
          </button>

          <button
            onClick={handleFetchAiInsights}
            disabled={isLoadingInsights}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition active:scale-95"
            id="run-ai-audit-btn"
          >
            {isLoadingInsights ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Auditing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Run AI Growth Audit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analytics Chart Box */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMetricTab('views')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                metricTab === 'views' ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              Views & Audience Velocity
            </button>
            <button
              onClick={() => setMetricTab('revenue')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                metricTab === 'revenue' ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              Revenue & Watch Hours
            </button>
            <button
              onClick={() => setMetricTab('retention')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                metricTab === 'retention' ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              CTR & Retention Rate
            </button>
          </div>

          <span className="text-xs font-bold text-slate-400">30-Day Historical Trend</span>
        </div>

        {/* Recharts Render */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {metricTab === 'views' ? (
              <AreaChart data={analyticsData}>
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="views" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#viewsGrad)" name="Views" />
              </AreaChart>
            ) : metricTab === 'revenue' ? (
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="revenueEst" fill="#10b981" radius={[6, 6, 0, 0]} name="Est Revenue ($)" />
              </BarChart>
            ) : (
              <LineChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Line type="monotone" dataKey="avgCtr" stroke="#f59e0b" strokeWidth={3} name="CTR %" />
                <Line type="monotone" dataKey="avgRetentionPct" stroke="#3b82f6" strokeWidth={3} name="Retention %" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights Card */}
      {aiInsights && (
        <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 border border-slate-800 animate-in fade-in">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Sparkles className="w-5 h-5 fill-current" />
            <span>Gemini Strategic Channel Audit & Growth Recommendations</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed border-b border-slate-800 pb-3">
            {aiInsights.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {aiInsights.recommendations?.map((rec: any, idx: number) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-amber-400">{rec.category}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                    rec.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {rec.priority}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white">{rec.title}</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
