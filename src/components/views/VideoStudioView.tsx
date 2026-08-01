import React, { useState, useEffect, useRef } from 'react';
import { YouTubeChannel, VideoProject, ScriptScene } from '../../types';
import { 
  Sparkles, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Image as ImageIcon, 
  Type, 
  Send, 
  Music, 
  ListOrdered, 
  CheckCircle2, 
  Loader2, 
  Copy, 
  Layers, 
  Maximize2, 
  FileText, 
  ShieldCheck,
  RefreshCw,
  Wand2,
  Tv
} from 'lucide-react';

interface VideoStudioViewProps {
  channels: YouTubeChannel[];
  activeChannel: YouTubeChannel | null;
  onSaveVideoProject: (project: VideoProject) => void;
  initialTopic?: string;
  onNavigateToPublishing: () => void;
}

export const VideoStudioView: React.FC<VideoStudioViewProps> = ({
  channels,
  activeChannel,
  onSaveVideoProject,
  initialTopic = '',
  onNavigateToPublishing,
}) => {
  // Form State
  const [topic, setTopic] = useState(initialTopic || 'How AI Autonomous Agents Will Replace 80% of Office Software in 2026');
  const [niche, setNiche] = useState(activeChannel ? activeChannel.category : 'Tech & AI');
  const [videoType, setVideoType] = useState<'Educational' | 'Documentary' | 'Storytelling' | 'Tutorial' | 'News' | 'Shorts'>('Educational');
  const [targetLength, setTargetLength] = useState('8-10 minutes');
  const [tone, setTone] = useState('Engaging & Authoritative');
  const [selectedVoice, setSelectedVoice] = useState('Zephyr (Tech Host)');
  const [backgroundMusic, setBackgroundMusic] = useState<'Lofi Chill' | 'Cinematic Synth' | 'Upbeat Energetic' | 'Corporate Tech' | 'Ambient Drone' | 'None'>('Cinematic Synth');

  // Generator Output State
  const [isGenerating, setIsGenerating] = useState(false);
  const [scriptData, setScriptData] = useState<{
    title: string;
    altTitles: string[];
    description: string;
    tags: string[];
    voiceoverScript: string;
    scenes: ScriptScene[];
    recommendedThumbnailConcept: string;
    aiContentDisclosureRequired: boolean;
    aiDisclosureReason: string;
  } | null>(null);

  // Player & Studio State
  const [activeTab, setActiveTab] = useState<'script' | 'preview' | 'thumbnail'>('script');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [thumbnailText, setThumbnailText] = useState('80% REPLACED!');
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  const [audioTesting, setAudioTesting] = useState(false);

  // Sync initial topic prop
  useEffect(() => {
    if (initialTopic) {
      setTopic(initialTopic);
    }
  }, [initialTopic]);

  // Video Scene Player Loop Timer
  useEffect(() => {
    let timer: any = null;
    if (isPlaying && scriptData && scriptData.scenes.length > 0) {
      const scene = scriptData.scenes[currentSceneIdx];
      const duration = (scene?.durationSeconds || 5) * 1000;

      timer = setTimeout(() => {
        if (currentSceneIdx < scriptData.scenes.length - 1) {
          setCurrentSceneIdx((prev) => prev + 1);
        } else {
          setCurrentSceneIdx(0);
          setIsPlaying(false);
        }
      }, duration);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentSceneIdx, scriptData]);

  // Handle Script Generation Call
  const handleGenerateScript = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/gemini/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          niche,
          videoType,
          targetLength,
          tone,
        }),
      });

      const data = await res.json();
      setScriptData(data);
      if (data.title) {
        setThumbnailText(data.title.split(':')[0].substring(0, 20).toUpperCase() || 'AI EXPOSED!');
      }
    } catch (err) {
      console.error('Failed to generate script:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Web Speech API Voiceover Test
  const handleTestVoiceover = (text: string) => {
    if ('speechSynthesis' in window) {
      if (audioTesting) {
        window.speechSynthesis.cancel();
        setAudioTesting(false);
        return;
      }
      setAudioTesting(true);
      const utterance = new SpeechSynthesisUtterance(text.substring(0, 250));
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setAudioTesting(false);
      utterance.onerror = () => setAudioTesting(false);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis API is not supported in this browser window.');
    }
  };

  // Generate Thumbnail
  const handleGenerateThumbnailImage = async () => {
    setIsGeneratingThumbnail(true);
    try {
      const res = await fetch('/api/gemini/thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${scriptData?.recommendedThumbnailConcept || topic} with bold text overlay "${thumbnailText}"`,
          aspectRatio: videoType === 'Shorts' ? '9:16' : '16:9',
        }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        setThumbnailUrl(data.imageUrl);
      } else {
        // Fallback placeholder with high contrast seed
        setThumbnailUrl(`https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80`);
      }
    } catch (err) {
      console.error('Thumbnail generation error:', err);
    } finally {
      setIsGeneratingThumbnail(false);
    }
  };

  // Save Project & Send to Queue
  const handleSaveAndQueue = () => {
    if (!scriptData) return;

    const newProject: VideoProject = {
      id: `vid-${Date.now()}`,
      channelId: activeChannel ? activeChannel.id : (channels[0]?.id || 'chan-1'),
      title: scriptData.title,
      altTitles: scriptData.altTitles,
      description: scriptData.description,
      tags: scriptData.tags,
      category: niche,
      topic,
      videoType,
      targetLength,
      tone,
      status: 'Review & Approval',
      voiceoverVoice: selectedVoice,
      scenes: scriptData.scenes,
      thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      thumbnailConcept: scriptData.recommendedThumbnailConcept,
      thumbnailCtrScore: 9.1,
      backgroundMusic,
      privacy: 'Public',
      madeForKids: false,
      aiContentDisclosureRequired: scriptData.aiContentDisclosureRequired,
      aiDisclosureReason: scriptData.aiDisclosureReason,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveVideoProject(newProject);
    alert('Video project saved and moved to the Publishing Queue & Production Board!');
    onNavigateToPublishing();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Wand2 className="w-7 h-7 text-red-500" />
            <span>AI Video Production Studio</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate full video scripts, synthesize voiceovers, render scene timelines, and design high-CTR thumbnails.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('script')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'script' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Script Generator</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'preview' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Video Timeline Player</span>
          </button>
          <button
            onClick={() => setActiveTab('thumbnail')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'thumbnail' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>AI Thumbnail Studio</span>
          </button>
        </div>
      </div>

      {/* Main Studio View Tabs */}
      {activeTab === 'script' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: Parameters (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <form onSubmit={handleGenerateScript} className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-3">
                Video Parameters
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Video Concept / Topic
                </label>
                <textarea
                  rows={3}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Describe your video topic or question..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Niche Category
                  </label>
                  <select
                    value={niche}
                    onChange={(e) => setNiche(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200"
                  >
                    <option value="Tech & AI">Tech & AI</option>
                    <option value="Finance & Wealth">Finance & Wealth</option>
                    <option value="Gaming & Esports">Gaming & Esports</option>
                    <option value="Documentary">Documentary</option>
                    <option value="Shorts">Shorts</option>
                    <option value="Lifestyle">Lifestyle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Format / Type
                  </label>
                  <select
                    value={videoType}
                    onChange={(e) => setVideoType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200"
                  >
                    <option value="Educational">Educational</option>
                    <option value="Documentary">Documentary</option>
                    <option value="Storytelling">Storytelling</option>
                    <option value="Tutorial">Tutorial</option>
                    <option value="News">News Breakdown</option>
                    <option value="Shorts">YouTube Shorts</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target Duration
                  </label>
                  <select
                    value={targetLength}
                    onChange={(e) => setTargetLength(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200"
                  >
                    <option value="30-60 seconds (Shorts)">30-60s Shorts</option>
                    <option value="3-5 minutes">3-5 minutes</option>
                    <option value="8-10 minutes">8-10 minutes</option>
                    <option value="12-15 minutes">12-15 minutes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Narrative Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200"
                  >
                    <option value="Engaging & Authoritative">Authoritative</option>
                    <option value="High Energy & Fast">High Energy</option>
                    <option value="Dark & Suspenseful">Suspenseful</option>
                    <option value="Conversational & Casual">Conversational</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  AI Voiceover Voice Preset
                </label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200"
                >
                  <option value="Zephyr (Tech Host)">Zephyr (Tech Host - Natural Male)</option>
                  <option value="Kore (Clear Studio)">Kore (Studio Host - Clear Female)</option>
                  <option value="Puck (Upbeat Short Host)">Puck (Upbeat Energetic)</option>
                  <option value="Charon (Deep Mystery)">Charon (Deep Cinematic Narration)</option>
                  <option value="Fenrir (Authoritative)">Fenrir (Authoritative Executive)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Background Music Genre
                </label>
                <select
                  value={backgroundMusic}
                  onChange={(e) => setBackgroundMusic(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200"
                >
                  <option value="Cinematic Synth">Cinematic Synth</option>
                  <option value="Lofi Chill">Lofi Chill</option>
                  <option value="Upbeat Energetic">Upbeat Energetic</option>
                  <option value="Corporate Tech">Corporate Tech</option>
                  <option value="Ambient Drone">Ambient Drone</option>
                  <option value="None">None (Silent)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 transition active:scale-95"
                id="generate-script-btn"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gemini AI Synthesizing Script...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span>Generate Full Script Package</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Generated Script Output (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {!scriptData ? (
              <div className="p-12 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">No Script Generated Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Enter your video topic and click "Generate Full Script Package" to leverage Gemini for SEO titles, scene breakdowns, tags, and AI synthetic disclosures.
                </p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Title & Metadata Card */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                    <span className="text-xs font-bold text-red-500 uppercase tracking-wider">AI Viral YouTube Title</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(scriptData.title)}
                      className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-semibold"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Title</span>
                    </button>
                  </div>

                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                    {scriptData.title}
                  </h2>

                  {/* Alternative Titles */}
                  {scriptData.altTitles && scriptData.altTitles.length > 0 && (
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60 space-y-1.5">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">A/B Testing Title Variations:</div>
                      {scriptData.altTitles.map((alt, idx) => (
                        <div key={idx} className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                          <span>{alt}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Disclosure Compliance Box */}
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">YouTube Policy Synthetic Content Disclosure:</span>
                      <p className="text-[11px] mt-0.5 opacity-90">{scriptData.aiDisclosureReason}</p>
                    </div>
                  </div>
                </div>

                {/* Scene-by-Scene Visual Breakdown */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <ListOrdered className="w-5 h-5 text-red-500" />
                      <span>Scene-by-Scene Production Breakdown ({scriptData.scenes.length} Scenes)</span>
                    </h3>

                    <button
                      onClick={() => handleTestVoiceover(scriptData.voiceoverScript)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition"
                    >
                      {audioTesting ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-emerald-500" />}
                      <span>{audioTesting ? 'Stop Voice Test' : 'Test AI Voice Narration'}</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {scriptData.scenes.map((scene) => (
                      <div key={scene.sceneNumber} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-red-500">Scene #{scene.sceneNumber} ({scene.durationSeconds}s)</span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px]">
                            {scene.graphicStyle}
                          </span>
                        </div>

                        <div className="text-xs text-slate-700 dark:text-slate-300">
                          <span className="font-bold text-slate-900 dark:text-slate-100">Visual Prompt: </span>
                          {scene.visualPrompt}
                        </div>

                        <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-xs italic text-slate-800 dark:text-slate-200">
                          <span className="not-italic font-bold text-red-500">Voiceover: </span>
                          "{scene.voiceoverText}"
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save & Queue Action */}
                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    onClick={handleSaveAndQueue}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-xl shadow-red-500/25 transition active:scale-95"
                    id="save-and-queue-btn"
                  >
                    <Send className="w-4 h-4" />
                    <span>Save Project & Send to Publishing Queue</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Video Timeline & Player Simulator Tab */}
      {activeTab === 'preview' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-6">
          <div className="max-w-4xl mx-auto space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Play className="w-5 h-5 text-red-500" />
              <span>Simulated Video Render & Player Preview</span>
            </h2>

            {/* Video Player Display Container */}
            <div className="relative aspect-video w-full rounded-3xl bg-slate-950 overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-between p-6">
              {/* Top Watermark & Channel Badge */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/10">
                  <Tv className="w-3.5 h-3.5 text-red-500" />
                  <span>{activeChannel ? activeChannel.title : 'TubularAI Render'}</span>
                </div>

                <div className="px-3 py-1 rounded-full bg-red-600/80 text-white text-[10px] font-extrabold tracking-widest uppercase">
                  AI RENDERING PREVIEW
                </div>
              </div>

              {/* Center Animated Visual Scene Display */}
              <div className="my-auto text-center space-y-3 z-10 px-8">
                <div className="inline-block px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold">
                  Scene #{scriptData?.scenes[currentSceneIdx]?.sceneNumber || 1} • {scriptData?.scenes[currentSceneIdx]?.graphicStyle || '4K Motion Graphics'}
                </div>
                <h3 className="text-xl md:text-3xl font-black text-white tracking-tight drop-shadow-md">
                  {scriptData?.scenes[currentSceneIdx]?.visualPrompt || 'Digital neural network node connection animation with neon lighting effects'}
                </h3>
                <div className="max-w-2xl mx-auto px-4 py-2 rounded-xl bg-black/70 border border-yellow-500/30 text-yellow-300 text-sm font-extrabold drop-shadow">
                  "{scriptData?.scenes[currentSceneIdx]?.captionText || '80% of office software workflows replaced by autonomous AI in 2026'}"
                </div>
              </div>

              {/* Bottom Controls Bar */}
              <div className="z-10 flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center font-bold shadow-lg transition"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>

                <div className="flex-1 mx-4">
                  <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-red-500 h-full transition-all duration-300"
                      style={{
                        width: `${(((currentSceneIdx + 1) / (scriptData?.scenes.length || 1)) * 100).toFixed(0)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="text-xs text-slate-300 font-semibold">
                  Scene {currentSceneIdx + 1} / {scriptData?.scenes.length || 1}
                </div>
              </div>

              {/* Background gradient graphic */}
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-red-950/40 opacity-90"></div>
            </div>
          </div>
        </div>
      )}

      {/* AI Thumbnail Studio Tab */}
      {activeTab === 'thumbnail' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-red-500" />
              <span>AI Thumbnail Studio & High-CTR Canvas</span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Controls */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Thumbnail Text Overlay (Max 3-4 Words)
                  </label>
                  <input
                    type="text"
                    value={thumbnailText}
                    onChange={(e) => setThumbnailText(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-extrabold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <button
                  onClick={handleGenerateThumbnailImage}
                  disabled={isGeneratingThumbnail}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 transition"
                  id="generate-ai-thumbnail-btn"
                >
                  {isGeneratingThumbnail ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating AI Image Graphic...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 fill-current" />
                      <span>Generate AI Thumbnail Image</span>
                    </>
                  )}
                </button>
              </div>

              {/* Live Canvas Preview */}
              <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-slate-300 dark:border-slate-700 bg-slate-900 shadow-xl flex items-center justify-center p-4">
                {thumbnailUrl ? (
                  <img
                    src={thumbnailUrl}
                    alt="AI Thumbnail"
                    className="absolute inset-0 w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-800 to-red-950"></div>
                )}

                {/* Overlaid High CTR Text Graphic */}
                <div className="relative z-10 text-center px-4 py-2 bg-black/70 backdrop-blur-md rounded-2xl border-2 border-yellow-400 transform -rotate-1 shadow-2xl">
                  <span className="text-2xl sm:text-4xl font-black text-yellow-300 tracking-wider uppercase drop-shadow-lg">
                    {thumbnailText}
                  </span>
                </div>

                {/* CTR Prediction Badge */}
                <div className="absolute bottom-3 right-3 z-10 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-black shadow-lg">
                  Est. CTR: 9.4/10
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
