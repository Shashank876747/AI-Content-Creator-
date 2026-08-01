import React, { useState, useEffect } from 'react';
import { 
  YouTubeChannel, 
  VideoProject, 
  ResearchTopic, 
  PipelineItem, 
  TeamMember, 
  AuditLog 
} from './types';
import { 
  INITIAL_CHANNELS, 
  INITIAL_VIDEOS, 
  INITIAL_RESEARCH_TOPICS, 
  INITIAL_COMPETITORS, 
  INITIAL_PIPELINES, 
  MOCK_ANALYTICS_30D, 
  INITIAL_TEAM_MEMBERS, 
  INITIAL_AUDIT_LOGS 
} from './data/mockData';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

import { DashboardView } from './components/views/DashboardView';
import { ChannelManagerView } from './components/views/ChannelManagerView';
import { ResearchView } from './components/views/ResearchView';
import { VideoStudioView } from './components/views/VideoStudioView';
import { PublishingView } from './components/views/PublishingView';
import { KanbanView } from './components/views/KanbanView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { TeamView } from './components/views/TeamView';
import { ComplianceView } from './components/views/ComplianceView';

import { NewChannelModal } from './components/modals/NewChannelModal';
import { ChannelGuideModal } from './components/modals/ChannelGuideModal';
import { NewPipelineModal } from './components/modals/NewPipelineModal';

export const App: React.FC = () => {
  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Navigation View State
  const [activeView, setActiveView] = useState<
    'dashboard' | 'channels' | 'research' | 'studio' | 'publishing' | 'kanban' | 'analytics' | 'team' | 'compliance'
  >('dashboard');

  // Core App State
  const [channels, setChannels] = useState<YouTubeChannel[]>(INITIAL_CHANNELS);
  const [activeChannel, setActiveChannel] = useState<YouTubeChannel | null>(INITIAL_CHANNELS[0] || null);
  const [videos, setVideos] = useState<VideoProject[]>(INITIAL_VIDEOS);
  const [researchTopics, setResearchTopics] = useState<ResearchTopic[]>(INITIAL_RESEARCH_TOPICS);
  const [pipelines, setPipelines] = useState<PipelineItem[]>(INITIAL_PIPELINES);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [workspaceFolders] = useState<string[]>([
    'Main Tech Portfolio',
    'Shorts Network',
    'Storytelling Channels',
    'Gaming Hub'
  ]);

  // Workspace Folder State
  const [activeFolder, setActiveFolder] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Studio Pre-fill Topic
  const [studioInitialTopic, setStudioInitialTopic] = useState<string>('');

  // Modals State
  const [isNewChannelModalOpen, setIsNewChannelModalOpen] = useState(false);
  const [isChannelGuideModalOpen, setIsChannelGuideModalOpen] = useState(false);
  const [isNewPipelineModalOpen, setIsNewPipelineModalOpen] = useState(false);

  // Filter channels by folder if activeFolder !== 'ALL'
  const filteredChannels = activeFolder === 'ALL'
    ? channels
    : channels.filter((c) => c.folder === activeFolder);

  // Sync Theme HTML class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Channel Actions
  const handleSelectChannel = (channel: YouTubeChannel | null) => {
    setActiveChannel(channel);
  };

  const handleAddChannel = (newChannel: YouTubeChannel) => {
    setChannels((prev) => [newChannel, ...prev]);
    setActiveChannel(newChannel);
  };

  const handleUpdateChannelFolder = (channelId: string, folder: string) => {
    setChannels((prev) =>
      prev.map((c) => (c.id === channelId ? { ...c, folder } : c))
    );
  };

  // Video Actions
  const handleSaveVideoProject = (project: VideoProject) => {
    setVideos((prev) => {
      const exists = prev.some((v) => v.id === project.id);
      if (exists) {
        return prev.map((v) => (v.id === project.id ? project : v));
      }
      return [project, ...prev];
    });
  };

  const handleUpdateVideoStatus = (videoId: string, status: VideoProject['status'], publishUrl?: string) => {
    setVideos((prev) =>
      prev.map((v) =>
        v.id === videoId
          ? {
              ...v,
              status,
              publishedUrl: publishUrl || v.publishedUrl,
              scheduledPublishTime: status === 'Published' ? new Date().toISOString() : v.scheduledPublishTime,
            }
          : v
      )
    );
  };

  // Open Studio with Topic
  const handleOpenVideoStudioWithTopic = (topicTitle: string) => {
    setStudioInitialTopic(topicTitle);
    setActiveView('studio');
  };

  // Save Research Topic to Ideas
  const handleSaveTopicToIdeas = (topic: ResearchTopic) => {
    setResearchTopics((prev) =>
      prev.map((t) => (t.id === topic.id ? { ...t, savedToIdeas: true } : t))
    );

    // Also auto create an Idea video project entry
    const newIdea: VideoProject = {
      id: `vid-idea-${Date.now()}`,
      channelId: activeChannel ? activeChannel.id : channels[0]?.id || 'chan-1',
      title: topic.topic,
      altTitles: [],
      description: `AI Concept for ${topic.topic}`,
      tags: [topic.niche, 'AI Generated'],
      category: topic.niche,
      topic: topic.topic,
      videoType: 'Educational',
      targetLength: '8-10 minutes',
      tone: 'Engaging',
      status: 'Idea',
      voiceoverVoice: 'Zephyr',
      scenes: [],
      thumbnailCtrScore: 8.9,
      backgroundMusic: 'Cinematic Synth',
      privacy: 'Public',
      madeForKids: false,
      aiContentDisclosureRequired: true,
      aiDisclosureReason: 'Uses AI script synthesis and graphics',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setVideos((prev) => [newIdea, ...prev]);
    alert(`Topic "${topic.topic}" saved to your Production Board as an Idea!`);
  };

  // Pipeline Actions
  const handleAddPipeline = (pipeline: PipelineItem) => {
    setPipelines((prev) => [pipeline, ...prev]);
  };

  // Team Actions
  const handleAddTeamMember = (member: TeamMember) => {
    setTeamMembers((prev) => [...prev, member]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased transition-colors duration-200">
      {/* Top Header */}
      <Header
        activeChannel={activeChannel}
        channels={filteredChannels}
        onSelectChannel={handleSelectChannel}
        darkMode={theme === 'dark'}
        onToggleDarkMode={toggleTheme}
        onOpenNewChannelModal={() => setIsNewChannelModalOpen(true)}
        onOpenVideoStudio={() => setActiveView('studio')}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeView={activeView}
          onSelectView={setActiveView}
          workspaceFolders={workspaceFolders}
          activeFolder={activeFolder}
          onSelectFolder={setActiveFolder}
          connectedChannelCount={channels.length}
        />

        {/* Main Workspace Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
          {activeView === 'dashboard' && (
            <DashboardView
              channels={channels}
              activeChannel={activeChannel}
              videos={videos}
              pipelines={pipelines}
              onOpenVideoStudio={(topic) => handleOpenVideoStudioWithTopic(topic || '')}
              onNavigateToView={setActiveView}
              onOpenNewChannelModal={() => setIsNewChannelModalOpen(true)}
            />
          )}

          {activeView === 'channels' && (
            <ChannelManagerView
              channels={channels}
              activeChannel={activeChannel}
              onSelectChannel={handleSelectChannel}
              onOpenNewChannelModal={() => setIsNewChannelModalOpen(true)}
              onOpenChannelGuideModal={() => setIsChannelGuideModalOpen(true)}
              onUpdateChannelFolder={handleUpdateChannelFolder}
              workspaceFolders={workspaceFolders}
            />
          )}

          {activeView === 'research' && (
            <ResearchView
              researchTopics={researchTopics}
              competitors={INITIAL_COMPETITORS}
              onSaveTopicToIdeas={handleSaveTopicToIdeas}
              onOpenVideoStudioWithTopic={handleOpenVideoStudioWithTopic}
            />
          )}

          {activeView === 'studio' && (
            <VideoStudioView
              channels={channels}
              activeChannel={activeChannel}
              onSaveVideoProject={handleSaveVideoProject}
              initialTopic={studioInitialTopic}
              onNavigateToPublishing={() => setActiveView('publishing')}
            />
          )}

          {activeView === 'publishing' && (
            <PublishingView
              channels={channels}
              activeChannel={activeChannel}
              videos={videos}
              onUpdateVideoStatus={handleUpdateVideoStatus}
            />
          )}

          {activeView === 'kanban' && (
            <KanbanView
              channels={channels}
              activeChannel={activeChannel}
              videos={videos}
              pipelines={pipelines}
              onUpdateVideoStatus={(id, status) => handleUpdateVideoStatus(id, status)}
              onOpenVideoStudioWithTopic={handleOpenVideoStudioWithTopic}
              onOpenNewPipelineModal={() => setIsNewPipelineModalOpen(true)}
            />
          )}

          {activeView === 'analytics' && (
            <AnalyticsView
              channels={channels}
              activeChannel={activeChannel}
              analyticsData={MOCK_ANALYTICS_30D}
            />
          )}

          {activeView === 'team' && (
            <TeamView
              teamMembers={teamMembers}
              auditLogs={auditLogs}
              channels={channels}
              onAddTeamMember={handleAddTeamMember}
            />
          )}

          {activeView === 'compliance' && (
            <ComplianceView
              onOpenChannelGuideModal={() => setIsChannelGuideModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <NewChannelModal
        isOpen={isNewChannelModalOpen}
        onClose={() => setIsNewChannelModalOpen(false)}
        onAddChannel={handleAddChannel}
        workspaceFolders={workspaceFolders}
        onOpenChannelGuide={() => {
          setIsNewChannelModalOpen(false);
          setIsChannelGuideModalOpen(true);
        }}
      />

      <ChannelGuideModal
        isOpen={isChannelGuideModalOpen}
        onClose={() => setIsChannelGuideModalOpen(false)}
      />

      <NewPipelineModal
        isOpen={isNewPipelineModalOpen}
        onClose={() => setIsNewPipelineModalOpen(false)}
        onAddPipeline={handleAddPipeline}
      />
    </div>
  );
};

export default App;
