import React, { useState } from 'react';
import { generateConceptImage, editImage, generateVideo, generateLivePreview } from '../services/geminiService';
import { Loader2, Wand2, Film, RefreshCw, Layers, Code, MonitorPlay } from 'lucide-react';
import { SocialAnalysis } from '../types';
import CodePreview from './CodePreview';

interface PitchViewProps {
  onCheckout: () => void;
  userGoal: string;
  analysis?: SocialAnalysis;
}

const PitchView: React.FC<PitchViewProps> = ({ onCheckout, userGoal, analysis }) => {
  const [activeTab, setActiveTab] = useState<'A' | 'B'>('A');
  
  // Image Generation State
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [resolution, setResolution] = useState<"1K" | "2K" | "4K">("1K");
  
  // Editing State
  const [editPrompt, setEditPrompt] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Video State
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isVideoGen, setIsVideoGen] = useState(false);

  // Code Gen State
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isCodeGen, setIsCodeGen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedImage(null);
    setVideoUrl(null);
    
    const context = `Target Goal: ${userGoal}. Market Context: ${analysis?.estimatedReach || 'Unknown'} reach, ${analysis?.engagementScore || 'Unknown'} engagement.`;
    
    const prompt = activeTab === 'A' 
      ? `A professional, corporate website homepage. Context: ${context}. Design Style: Clean lines, deep blue and white confidence, high trust, minimal UI, optimized for ${userGoal}.` 
      : `A cyberpunk, antigravity website homepage. Context: ${context}. Design Style: Neon lights, dark background, floating elements, glitch effects, highly disruptive, optimized for ${userGoal}.`;
    
    try {
      const img = await generateConceptImage(prompt, aspectRatio, resolution);
      setGeneratedImage(img);
    } catch (e) {
      alert("Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = async () => {
    if (!generatedImage || !editPrompt) return;
    setIsEditing(true);
    try {
      const newImg = await editImage(generatedImage, editPrompt);
      setGeneratedImage(newImg);
      setEditPrompt("");
    } catch (e) {
      alert("Edit failed.");
    } finally {
      setIsEditing(false);
    }
  };

  const handleVideo = async () => {
    if (!generatedImage) return;
    setIsVideoGen(true);
    try {
      // Use the generated image as a base for Veo
      const vid = await generateVideo(`Cinematic camera movement exploring this website design. ${userGoal}`, generatedImage);
      setVideoUrl(vid);
    } catch (e) {
      alert("Video generation failed. Ensure you have selected a paid API key via the popup.");
    } finally {
      setIsVideoGen(false);
    }
  };

  const handleCodePreview = async () => {
    setIsCodeGen(true);
    try {
        // Assume URL is globally available or passed down, here we simulate or fetch from context if stored. 
        // For now using placeholder text as prompt handles the design logic.
        const code = await generateLivePreview("Current Site", userGoal, activeTab);
        setGeneratedCode(code);
        setShowPreview(true);
    } catch (e) {
        alert("Prototype generation failed.");
    } finally {
        setIsCodeGen(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 flex flex-col gap-6 animate-fade-in">
      
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-4xl font-bold font-mono text-white mb-2">PROTOCOL SELECTION</h2>
        <p className="text-gray-400">AI has formulated two distinct conversion paths based on your <span className="text-purple-400">High-Value Profile</span>.</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-4">
        <button
          onClick={() => setActiveTab('A')}
          className={`px-8 py-4 text-xl font-bold font-mono transition-all border-b-4 ${activeTab === 'A' ? 'border-indigo-500 text-indigo-400 bg-indigo-900/20' : 'border-transparent text-gray-600 hover:text-gray-300'}`}
        >
          PATH A: CORPORATE TRUST
        </button>
        <button
          onClick={() => setActiveTab('B')}
          className={`px-8 py-4 text-xl font-bold font-mono transition-all border-b-4 ${activeTab === 'B' ? 'border-cyan-500 text-cyan-400 bg-cyan-900/20' : 'border-transparent text-gray-600 hover:text-gray-300'}`}
        >
          PATH B: NEON DISRUPTION
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-2xl min-h-[500px] flex flex-col md:flex-row gap-6">
        
        {/* Controls */}
        <div className="w-full md:w-1/3 flex flex-col space-y-6">
          <div className="bg-black/50 p-4 rounded-lg border border-gray-700">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center"><Layers className="w-4 h-4 mr-2 text-indigo-400"/> Config</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500">ASPECT RATIO</label>
                <select 
                  value={aspectRatio} 
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full bg-gray-800 text-white p-2 rounded border border-gray-700 font-mono text-sm mt-1"
                >
                  <option value="1:1">1:1 (Square)</option>
                  <option value="16:9">16:9 (Landscape)</option>
                  <option value="9:16">9:16 (Portrait)</option>
                  <option value="4:3">4:3 (Standard)</option>
                  <option value="21:9">21:9 (Ultrawide)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-500">RESOLUTION (GEMINI 3 PRO)</label>
                <select 
                  value={resolution} 
                  onChange={(e) => setResolution(e.target.value as any)}
                  className="w-full bg-gray-800 text-white p-2 rounded border border-gray-700 font-mono text-sm mt-1"
                >
                  <option value="1K">1K (Fast)</option>
                  <option value="2K">2K (High)</option>
                  <option value="4K">4K (Ultra)</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded flex items-center justify-center font-mono disabled:opacity-50"
                >
                    {isGenerating ? <Loader2 className="animate-spin w-5 h-5" /> : <><Wand2 className="w-4 h-4 mr-2"/> GENERATE VISUAL</>}
                </button>

                <button 
                    onClick={handleCodePreview}
                    disabled={isCodeGen}
                    className="w-full py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-bold rounded flex items-center justify-center font-mono disabled:opacity-50"
                >
                    {isCodeGen ? <Loader2 className="animate-spin w-5 h-5" /> : <><MonitorPlay className="w-4 h-4 mr-2"/> LIVE PROTOTYPE</>}
                </button>
              </div>
            </div>
          </div>

          {generatedImage && (
            <div className="bg-black/50 p-4 rounded-lg border border-gray-700">
               <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center"><RefreshCw className="w-4 h-4 mr-2 text-purple-400"/> Refine</h3>
               <div className="space-y-2">
                 <input 
                    type="text" 
                    placeholder="e.g. 'Add a retro filter', 'Make it darker'"
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    className="w-full bg-gray-800 text-white p-2 rounded border border-gray-700 font-mono text-sm"
                 />
                 <button 
                  onClick={handleEdit}
                  disabled={isEditing}
                  className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded font-mono text-sm disabled:opacity-50"
                 >
                   {isEditing ? 'EDITING...' : 'APPLY EDIT (NANO BANANA)'}
                 </button>
               </div>
               
               <div className="mt-4 pt-4 border-t border-gray-700">
                  <button 
                    onClick={handleVideo}
                    disabled={isVideoGen}
                    className="w-full py-2 bg-cyan-900/50 hover:bg-cyan-900/80 border border-cyan-500/50 text-cyan-300 font-bold rounded font-mono text-sm flex items-center justify-center disabled:opacity-50"
                  >
                    {isVideoGen ? <Loader2 className="animate-spin w-4 h-4" /> : <><Film className="w-4 h-4 mr-2 text-cyan-300"/> ANIMATE (VEO)</>}
                  </button>
               </div>
            </div>
          )}
        </div>

        {/* Viewport */}
        <div className="w-full md:w-2/3 bg-black rounded-lg flex items-center justify-center overflow-hidden border border-gray-800 relative min-h-[400px]">
          {isGenerating ? (
            <div className="text-center space-y-3">
              <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mx-auto" />
              <p className="text-cyan-500 font-mono animate-pulse">RENDERING {activeTab === 'A' ? 'CORPORATE' : 'DISRUPTIVE'} PREVIEW...</p>
            </div>
          ) : generatedImage ? (
            <div className="relative w-full h-full flex flex-col items-center">
               <img src={generatedImage} alt="Generated Concept" className="max-h-[500px] object-contain shadow-2xl" />
               
               {isEditing && (
                 <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                 </div>
               )}

               {videoUrl && (
                 <div className="absolute bottom-4 right-4 z-10">
                   <a href={videoUrl} target="_blank" rel="noreferrer" className="bg-cyan-600 text-white px-4 py-2 rounded font-mono shadow-lg hover:bg-cyan-500">
                     WATCH VIDEO PREVIEW
                   </a>
                 </div>
               )}
            </div>
          ) : (
            <div className="text-gray-600 font-mono text-sm text-center p-10">
              <div className="w-16 h-16 border-2 border-dashed border-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Wand2 className="w-6 h-6 text-cyan-600" />
              </div>
              <p>AWAITING GENERATION PARAMETERS</p>
              <p className="text-xs mt-2">Generate Visual or Live Prototype</p>
            </div>
          )}
        </div>
      </div>

      <div className="text-center mt-8">
        <button 
          onClick={onCheckout}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-2xl py-4 px-12 rounded-lg shadow-lg shadow-cyan-900/20 transform hover:scale-105 transition-all font-mono"
        >
          CONFIRM {activeTab} & PROCEED TO CHECKOUT
        </button>
        <p className="mt-2 text-gray-500 text-xs font-mono">SECURE TRANSACTION via STRIPE</p>
      </div>

      {showPreview && generatedCode && (
        <CodePreview 
            html={generatedCode} 
            onClose={() => setShowPreview(false)} 
            mode={activeTab}
        />
      )}
    </div>
  );
};

export default PitchView;