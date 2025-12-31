import React, { useState } from 'react';
import { AppStep, RoastResult, BriefingData, SocialAnalysis, ProductionGuide, AutoEngineReport } from './types';
import { roastUrl, analyzeBriefing, generateProductionGuide, generateAutoEngineReport } from './services/geminiService';
import RoastView from './components/RoastView';
import PitchView from './components/PitchView';
import ChatWidget from './components/ChatWidget';
import LandingView from './components/LandingView';
import { ArrowRight, Globe, CheckCircle, Loader2, Search, Smartphone, Mail, AlertTriangle, Terminal, Copy, Cpu, Layout, FileText, Settings, Zap, MapPin, Shield } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState<AppStep>(AppStep.INTAKE);
  const [url, setUrl] = useState("");
  const [roastData, setRoastData] = useState<RoastResult | null>(null);
  const [briefing, setBriefing] = useState<BriefingData>({ goal: 'Sales', socials: '', contact: '' });
  const [analysisData, setAnalysisData] = useState<SocialAnalysis | undefined>(undefined);
  const [productionGuide, setProductionGuide] = useState<ProductionGuide | null>(null);
  const [autoEngineReport, setAutoEngineReport] = useState<AutoEngineReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUrlSubmit = async () => {
    if (!url) return;
    setIsLoading(true);
    try {
      const result = await roastUrl(url);
      setRoastData(result);
      setStep(AppStep.ROAST);
    } catch (err) {
      alert("System analysis failed. Please retry.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBriefingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Simulate/Analyze Social Data
      const analysis = await analyzeBriefing(briefing.goal, briefing.socials, briefing.contact);
      setAnalysisData(analysis);
      setStep(AppStep.ANALYSIS);
    } catch (err) {
      console.error("Analysis failed", err);
      setStep(AppStep.PITCH); // Skip if fail
    } finally {
      setIsLoading(false);
    }
  };

  const handleHandoff = async () => {
    setStep(AppStep.CLOSER);
    try {
       // Parallel generation of Supervisor Report and Auto-Engine Strategy
       const [guide, report] = await Promise.all([
          generateProductionGuide(url, briefing.goal, analysisData),
          generateAutoEngineReport(url, briefing.goal, analysisData, roastData || undefined)
       ]);
       
       setProductionGuide(guide);
       setAutoEngineReport(report);
       
       setTimeout(() => {
           setStep(AppStep.HANDOFF);
       }, 2000);
    } catch(e) {
       console.error("Supervisor gen failed", e);
       setStep(AppStep.HANDOFF);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-gray-200 relative overflow-hidden font-sans">
      
      {/* Main Container */}
      
        {/* Step: INTAKE (Landing Page) */}
        {step === AppStep.INTAKE && (
          <LandingView 
            url={url} 
            setUrl={setUrl} 
            onAnalyze={handleUrlSubmit} 
            isLoading={isLoading} 
          />
        )}

        {/* Other Steps Container */}
        {step !== AppStep.INTAKE && (
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
            
            {/* Step: ROAST */}
            {step === AppStep.ROAST && roastData && (
              <RoastView data={roastData} onContinue={() => setStep(AppStep.BRIEFING)} />
            )}

            {/* Step: BRIEFING */}
            {step === AppStep.BRIEFING && (
              <div className="w-full max-w-xl bg-gray-900/90 p-8 rounded-xl border border-gray-700 shadow-2xl animate-fade-in">
                <h2 className="text-2xl font-bold font-mono text-white mb-6 border-b border-gray-700 pb-4">TACTICAL BRIEFING</h2>
                <form onSubmit={handleBriefingSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">PRIMARY OBJECTIVE</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Sales', 'Leads', 'Brand'].map(type => (
                        <button 
                          key={type}
                          type="button"
                          onClick={() => setBriefing({...briefing, goal: type})}
                          className={`py-3 px-4 rounded border font-mono text-sm transition-all ${briefing.goal === type ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-black border-gray-700 text-gray-400 hover:border-gray-500'}`}
                        >
                          {type.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">SOCIAL LINKS (IG/TIKTOK/LINKEDIN)</label>
                    <input 
                      required
                      type="text" 
                      placeholder="@handle or full URL"
                      className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-cyan-500 focus:outline-none"
                      value={briefing.socials}
                      onChange={(e) => setBriefing({...briefing, socials: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">WHATSAPP / CONTACT EMAIL</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-cyan-500 focus:outline-none"
                      value={briefing.contact}
                      onChange={(e) => setBriefing({...briefing, contact: e.target.value})}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-white text-black font-bold py-4 rounded hover:bg-gray-200 transition-colors font-mono flex items-center justify-center disabled:opacity-70"
                  >
                    {isLoading ? <Loader2 className="animate-spin w-5 h-5"/> : <>INITIATE INTELLIGENCE SCAN <Search className="ml-2 w-5 h-5"/></>}
                  </button>
                </form>
              </div>
            )}

            {/* Step: ANALYSIS */}
            {step === AppStep.ANALYSIS && analysisData && (
              <div className="w-full max-w-2xl bg-black/80 p-8 rounded-xl border border-cyan-500/30 shadow-2xl animate-fade-in relative overflow-hidden">
                {/* Decorative scan line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,1)] animate-scan"></div>
                
                <h2 className="text-2xl font-bold font-mono text-cyan-400 mb-6 flex items-center">
                  <Globe className="w-6 h-6 mr-2 animate-pulse text-cyan-500" />
                  OSINT REPORT COMPLETE
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-900 p-4 rounded border border-gray-800">
                        <p className="text-gray-500 text-xs font-mono uppercase">Estimated Reach</p>
                        <p className="text-2xl font-bold text-white font-mono">{analysisData.estimatedReach}</p>
                    </div>
                    <div className="bg-gray-900 p-4 rounded border border-gray-800">
                        <p className="text-gray-500 text-xs font-mono uppercase">Engagement Signal</p>
                        <p className="text-2xl font-bold text-white font-mono">{analysisData.engagementScore}</p>
                    </div>
                </div>

                <div className="bg-indigo-900/20 border-l-4 border-indigo-500 p-4 mb-8">
                    <h3 className="text-indigo-400 font-bold text-sm uppercase mb-2">Recommended Contact Protocol</h3>
                    <div className="flex items-center space-x-3 mb-2">
                      {analysisData.recommendedContact === 'WhatsApp' ? <Smartphone className="text-cyan-400"/> : <Mail className="text-purple-400"/>}
                      <span className="text-xl font-bold text-white">{analysisData.recommendedContact}</span>
                    </div>
                    <p className="text-gray-400 text-sm italic">"{analysisData.reasoning}"</p>
                </div>

                <button 
                  onClick={() => setStep(AppStep.PITCH)}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded font-mono flex items-center justify-center shadow-lg shadow-cyan-900/50"
                >
                  GENERATE TACTICAL PREVIEWS <ArrowRight className="ml-2 w-5 h-5"/>
                </button>
              </div>
            )}

            {/* Step: PITCH */}
            {step === AppStep.PITCH && (
              <PitchView onCheckout={handleHandoff} userGoal={briefing.goal} analysis={analysisData} />
            )}

            {/* Step: CLOSER (Simulated) */}
            {step === AppStep.CLOSER && (
              <div className="text-center">
                <Loader2 className="w-16 h-16 text-cyan-500 animate-spin mx-auto mb-6" />
                <h2 className="text-3xl font-mono font-bold text-white">PROCESSING SECURE PAYMENT...</h2>
                <p className="text-gray-400 mt-2 font-mono text-sm animate-pulse">Initializing Auto-Engine & Assigning Supervisor...</p>
              </div>
            )}

            {/* Step: HANDOFF (Mission Control) */}
            {step === AppStep.HANDOFF && (
                <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in p-4">
                    
                    {/* 1. Client Status (Top Left) */}
                    <div className="lg:col-span-4 bg-gray-900 border border-cyan-500/30 p-6 rounded-2xl flex flex-col justify-between">
                        <div>
                            <div className="flex items-center text-cyan-400 mb-4">
                                <CheckCircle className="w-8 h-8 mr-3 text-cyan-400" />
                                <h2 className="text-2xl font-bold font-mono">MISSION SECURED</h2>
                            </div>
                            <p className="text-gray-400 text-sm mb-4">Client data locked. Payment confirmed.</p>
                            <div className="bg-black p-3 rounded text-left font-mono text-xs text-cyan-400 overflow-x-auto border border-gray-800">
                                <pre>{JSON.stringify({
                                    client: briefing.contact,
                                    target: url,
                                    plan: "PRO_24H"
                                }, null, 2)}</pre>
                            </div>
                        </div>
                        <button 
                            onClick={() => window.location.reload()}
                            className="mt-6 w-full py-2 bg-gray-800 hover:bg-gray-700 text-white rounded font-mono text-sm"
                        >
                            Start New Intake
                        </button>
                    </div>

                    {/* 2. 24H Sprint Guide (Middle) */}
                    <div className="lg:col-span-4 bg-gray-900 border border-purple-500/30 p-6 rounded-2xl relative overflow-hidden flex flex-col">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600"></div>
                        <div className="flex items-center mb-4 text-purple-400">
                            <AlertTriangle className="w-6 h-6 mr-2 text-purple-500" />
                            <h2 className="text-xl font-bold font-mono">SPRINT PROTOCOL</h2>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            <div className="mb-6">
                                <h3 className="text-gray-500 font-bold text-[10px] uppercase mb-2 tracking-widest">ASSET RISK CHECK</h3>
                                <ul className="space-y-2">
                                    {productionGuide?.missingItems.map((item, i) => (
                                        <li key={i} className="flex items-start text-xs font-mono text-gray-300">
                                            <span className="text-purple-500 mr-2 font-bold">[!]</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">REFINEMENT PROMPTS</h3>
                                {productionGuide?.refinementPrompts.map((p, i) => (
                                    <div key={i} className="bg-black/40 border border-gray-700 rounded p-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-purple-400 text-[10px] font-bold uppercase">{p.category}</span>
                                            <Copy className="w-3 h-3 text-cyan-500 cursor-pointer hover:text-white" />
                                        </div>
                                        <p className="text-gray-400 text-[10px] font-mono leading-relaxed line-clamp-2 hover:line-clamp-none transition-all">
                                            "{p.prompt}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 3. Auto-Engine Output (Right) */}
                    <div className="lg:col-span-4 bg-gray-900 border border-indigo-500/30 p-6 rounded-2xl relative overflow-hidden flex flex-col h-[600px] lg:h-auto">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-600"></div>
                        <div className="flex items-center mb-4 text-indigo-400">
                            <Cpu className="w-6 h-6 mr-2 text-indigo-400" />
                            <h2 className="text-xl font-bold font-mono">AUTO-ENGINE REPORT</h2>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                            {/* Audit Summary */}
                            <div className="bg-indigo-900/10 p-3 rounded border border-indigo-900/30">
                                <h3 className="text-indigo-300 font-bold text-[10px] uppercase mb-2 flex items-center"><FileText className="w-3 h-3 mr-1 text-cyan-400"/> TECHNICAL AUDIT</h3>
                                <ul className="space-y-2 mb-3">
                                    {autoEngineReport?.audit.criticalFailures.map((f, i) => (
                                        <li key={i} className="text-xs text-gray-300 font-mono flex items-start">
                                          <span className="text-purple-500 mr-1.5 mt-0.5">•</span>
                                          <span>
                                              {f.split(':')[0]}<span className="text-purple-400">:</span> {f.split(':')[1]}
                                          </span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="text-xs text-cyan-300 font-mono border-t border-indigo-900/30 pt-2 flex items-start">
                                    <Zap className="w-3 h-3 inline mr-1.5 mt-0.5 shrink-0 text-cyan-300"/> 
                                    <span>{autoEngineReport?.audit.conversionOpportunity}</span>
                                </div>
                            </div>

                            {/* Options */}
                            <div className="space-y-3">
                                <h3 className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">STRATEGIC PATHS</h3>
                                {autoEngineReport?.options.map((opt, i) => (
                                    <div key={i} className="bg-black/40 border border-gray-700 rounded p-3 group hover:border-cyan-500/50 transition-colors">
                                        <div className="flex justify-between items-center mb-1">
                                            <h4 className="text-white font-bold text-xs font-mono">{opt.name}</h4>
                                            <span className="text-[10px] bg-gray-800 px-2 py-0.5 rounded text-gray-400 border border-gray-700">{opt.focus}</span>
                                        </div>
                                        <p className="text-gray-500 text-[10px] font-mono mb-2">{opt.structure}</p>
                                        <div className="text-cyan-400 text-[10px] font-mono border-l-2 border-cyan-500 pl-2">
                                            <span className="font-bold text-cyan-300">Feature:</span> {opt.feature}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            )}
          </div>
        )}
      
      {/* Persistent Chat */}
      <ChatWidget />
    </div>
  );
}