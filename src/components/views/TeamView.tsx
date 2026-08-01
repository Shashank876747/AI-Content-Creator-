import React, { useState } from 'react';
import { TeamMember, AuditLog, YouTubeChannel } from '../../types';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Clock, 
  FileText,
  Key
} from 'lucide-react';

interface TeamViewProps {
  teamMembers: TeamMember[];
  auditLogs: AuditLog[];
  channels: YouTubeChannel[];
  onAddTeamMember: (member: TeamMember) => void;
}

export const TeamView: React.FC<TeamViewProps> = ({
  teamMembers,
  auditLogs,
  channels,
  onAddTeamMember,
}) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<TeamMember['role']>('Channel Manager');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newMember: TeamMember = {
      id: `team-${Date.now()}`,
      name,
      email,
      role,
      assignedChannels: ['ALL'],
      status: 'Pending Invite',
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80`,
    };

    onAddTeamMember(newMember);
    setName('');
    setEmail('');
    setShowInviteModal(false);
    alert(`Invite sent to ${email} with role ${role}!`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Users className="w-7 h-7 text-red-500" />
            <span>Team Access & Audit Security</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Role-based access control, channel permissions, and security audit logs across all workspace accounts.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition active:scale-95"
          id="invite-team-member-btn"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Team Member</span>
        </button>
      </div>

      {/* Team Members List */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-3">
          Workspace Team Members ({teamMembers.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {teamMembers.map((m) => (
            <div key={m.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
              <img src={m.avatarUrl} alt={m.name} className="w-12 h-12 rounded-full object-cover border border-slate-300" referrerPolicy="no-referrer" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{m.name}</div>
                <div className="text-xs text-slate-500 truncate">{m.email}</div>
                <div className="mt-2 flex items-center justify-between text-[10px]">
                  <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 font-extrabold">{m.role}</span>
                  <span className="text-emerald-500 font-semibold">{m.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-red-500" />
          <span>Security & API Audit Log History</span>
        </h2>

        <div className="space-y-3">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>{log.action}</span>
                  <span className="text-[10px] text-slate-400 font-normal">• {log.channelName}</span>
                </div>
                <p className="text-[11px] text-slate-500">{log.details}</p>
                <div className="text-[10px] text-slate-400">By {log.actor} at {log.timestamp}</div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold shrink-0 ${
                log.status === 'Success' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
              }`}>
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-slate-700 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Invite New Team Member</h3>
            <form onSubmit={handleInvite} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Connor"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah@company.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Role & Permissions</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                >
                  <option value="Admin">Admin (Full Access)</option>
                  <option value="Channel Manager">Channel Manager (Uploads & Scripting)</option>
                  <option value="Content Editor">Content Editor (Drafting only)</option>
                  <option value="Viewer">Viewer (Analytics read-only)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
