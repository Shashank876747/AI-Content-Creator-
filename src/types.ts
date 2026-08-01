export type ChannelCategory = 'Tech & AI' | 'Gaming' | 'Education' | 'Documentary' | 'Shorts' | 'Finance' | 'Lifestyle';

export interface ChannelHealth {
  apiQuotaUsed: number; // e.g. 1200 / 10000
  apiQuotaLimit: number;
  copyrightStrikes: number;
  communityStrikes: number;
  shadowbanRisk: 'Low' | 'Medium' | 'High';
  authStatus: 'Connected' | 'Token Expiring' | 'Needs Reauth';
  lastSyncedAt: string;
}

export interface YouTubeChannel {
  id: string;
  title: string;
  handle: string;
  avatarUrl: string;
  bannerUrl?: string;
  subscribers: number;
  totalViews: number;
  videoCount: number;
  category: ChannelCategory;
  folder: string;
  health: ChannelHealth;
  isMonetized: boolean;
  estMonthlyRevenue: number;
  avgCtr: number;
  connectedAt: string;
}

export interface ScriptScene {
  sceneNumber: number;
  durationSeconds: number;
  visualPrompt: string;
  voiceoverText: string;
  graphicStyle: string;
  captionText: string;
  visualUrl?: string;
}

export interface VideoProject {
  id: string;
  channelId: string;
  title: string;
  altTitles?: string[];
  description: string;
  tags: string[];
  category: string;
  topic: string;
  videoType: 'Educational' | 'Documentary' | 'Storytelling' | 'Tutorial' | 'News' | 'Shorts';
  targetLength: string;
  tone: string;
  status: 'Idea' | 'Scripting' | 'Audio & Visuals' | 'Review & Approval' | 'Scheduled' | 'Published';
  voiceoverVoice: string;
  scenes: ScriptScene[];
  thumbnailUrl?: string;
  thumbnailConcept?: string;
  thumbnailCtrScore?: number;
  backgroundMusic?: 'Lofi Chill' | 'Cinematic Synth' | 'Upbeat Energetic' | 'Corporate Tech' | 'Ambient Drone' | 'None';
  privacy: 'Public' | 'Unlisted' | 'Private';
  madeForKids: boolean;
  aiContentDisclosureRequired: boolean;
  aiDisclosureReason?: string;
  scheduledPublishTime?: string;
  publishedUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PipelineItem {
  id: string;
  name: string;
  channelId: string;
  trigger: 'Manual' | 'Daily Scheduled' | 'Weekly Recurring' | 'RSS/Trending Trigger';
  currentStage: string;
  autoApprove: boolean;
  lastRunAt: string;
  nextRunAt: string;
  itemsProcessed: number;
  status: 'Active' | 'Paused' | 'Error';
}

export interface ResearchTopic {
  id: string;
  topic: string;
  niche: string;
  searchVolume: number;
  competition: 'Low' | 'Medium' | 'High';
  searchGrowthRate: string;
  ctrPotential: string;
  videoAngle: string;
  savedToIdeas: boolean;
}

export interface CompetitorChannel {
  id: string;
  channelName: string;
  subscribers: string;
  avgViews: string;
  topVideoTitle: string;
  outlierRatio: string;
  uploadFrequency: string;
  avatarUrl: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Channel Manager' | 'Content Editor' | 'Viewer';
  assignedChannels: string[]; // channel IDs or 'ALL'
  status: 'Active' | 'Pending Invite';
  avatarUrl: string;
}

export interface AnalyticsDataPoint {
  date: string;
  views: number;
  subscribersGained: number;
  watchTimeHours: number;
  revenueEst: number;
  avgCtr: number;
  avgRetentionPct: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  channelName: string;
  status: 'Success' | 'Warning' | 'Failed';
  details: string;
}
