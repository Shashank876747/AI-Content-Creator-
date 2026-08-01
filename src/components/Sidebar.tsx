import React from 'react';
import { 
  LayoutDashboard, 
  Tv, 
  Sparkles, 
  Video, 
  Send, 
  Kanban, 
  BarChart3, 
  Users, 
  ShieldAlert, 
  FolderGit2,
  ChevronRight,
  Youtube,
  Settings
} from 'lucide-react';

export type ViewType = 
  | 'dashboard' 
  | 'channels' 
  | 'research' 
  | 'studio' 
  | 'publishing' 
  | 'kanban' 
  | 'analytics' 
  | 'team' 
  | 'compliance';

interface SidebarProps {
  activeView: ViewType;
  onSelectView: (view: ViewType) => void;
  workspaceFolders: string[];
  activeFolder: string;
  onSelectFolder: (folder: string) => void;
  connectedChannelCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  workspaceFolders = [],
  activeFolder = 'ALL',
  onSelectFolder,
  connectedChannelCount = 0,
}) => {
  const navItems: { id: ViewType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'channels', label: 'Channels', icon: <Tv className="w-4 h-4" />, badge: `${connectedChannelCount}` },
    { id: 'research', label: 'AI Research & Ideas', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'studio', label: 'AI Video Studio', icon: <Video className="w-4 h-4" />, badge: 'AI' },
    { id: 'publishing', label: 'Publishing Queue', icon: <Send className="w-4 h-4" /> },
    { id: 'kanban', label: 'Production Board', icon: <Kanban className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics & Insights', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'team', label: 'Team & Roles', icon: <Users className="w-4 h-4" /> },
    { id: 'compliance', label: 'YouTube TOS & Guide', icon: <ShieldAlert className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 transition-colors overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-red-500/25">
            <Youtube className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              Tubular<span className="text-red-500">AI</span>
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">YouTube Channel OS</p>
          </div>
        </div>

        {/* Workspace Folder Filter */}
        <div className="space-y-1.5">
          <div className="px-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <FolderGit2 className="w-3 h-3" />
            <span>Workspaces</span>
          </div>
          <div className="space-y-1">
            <button
              onClick={() => onSelectFolder('ALL')}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition ${
                activeFolder === 'ALL'
                  ? 'bg-slate-200/80 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <span>All Workspaces</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>
            {workspaceFolders.map((folder) => (
              <button
                key={folder}
                onClick={() => onSelectFolder(folder)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                  activeFolder === folder
                    ? 'bg-slate-200/80 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <span className="truncate">{folder}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Navigation */}
        <div className="space-y-1">
          <div className="px-2 pb-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Navigation
          </div>
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-500/20'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/70'
                }`}
                id={`nav-${item.id}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="p-3 rounded-2xl bg-slate-200/50 dark:bg-slate-800/50 border border-slate-300/40 dark:border-slate-700/40">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
            <span>API Quota Daily</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">2,450 / 10,000</span>
          </div>
          <div className="w-full bg-slate-300 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full w-[24.5%] rounded-full"></div>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">
            Compliant with YouTube API TOS & Google OAuth Policies.
          </p>
        </div>
      </div>
    </aside>
  );
};
