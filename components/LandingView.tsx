import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Play, CheckCircle, Zap, AlertCircle, Sparkles, MoveHorizontal, Video, ScanFace, MousePointer2 } from 'lucide-react';
import Logo from './Logo';

interface LandingViewProps {
  url: string;
  setUrl: (url: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const LandingView: React.FC<LandingViewProps> = ({ url, setUrl, onAnalyze, isLoading }) => {
  const [error, setError] = useState<string | null>(null);
  
  // Intelligence Core State
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [demoMode, setDemoMode] = useState<'A' | 'B'>('B'); // A: Corporate, B: Neon
  
  const sliderRef = useRef<HTMLDivElement>(null);

  const validateUrl = (input: string) => {
    const pattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/i;
    return pattern.test(input);
  };

  const handleAnalyze = () => {
    if (!url.trim()) {
      setError("Please enter a URL.");
      return;
    }
    if (!validateUrl(url)) {
      setError("Please enter a valid URL (e.g. example.com)");
      return;
    }
    setError(null);
    onAnalyze();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAnalyze();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (error) setError(null);
  };

  // Slider Logic
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  useEffect(() => {
    const handleUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
    };
  }, []);

  return (
    <div className="min-h-screen text-gray-200 selection:bg-cyan-500 selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#030712]/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo size="sm" />
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400 font-mono">
            <a href="#core" className="hover:text-cyan-400 transition-colors">AI CORE</a>
            <a href="#how" className="hover:text-cyan-400 transition-colors">PROCESS</a>
            <a href="#examples" className="hover:text-cyan-400 transition-colors">STYLES</a>
            <a href="#pricing" className="hover:text-cyan-400 transition-colors">PRICING</a>
          </div>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-cyan-400 hover:bg-cyan-300 text-black font-bold px-5 py-2.5 rounded font-mono text-xs tracking-wider transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
          >
            START NOW
          </button>
        </div>
      </nav>
      
      {/* HERO SECTION */}
      <section className="pt-40 pb-20 px-6 border-b border-gray-800 relative overflow-hidden">
         {/* Decorative Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900 border border-gray-800 text-xs font-mono text-cyan-400 mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            ACCEPTING NEW PROJECTS FOR 2026
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 leading-tight animate-fade-in-up">
            High-End Web Design.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-indigo-500">Ready in 24 Hours.</span>
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Stop using generic templates. We combine <span className="text-white font-semibold">Multimodal AI</span> with elite human developers to build sites that actually convert. No meetings. Pure output.
          </p>
          
          {/* INPUT HERO */}
          <div className="max-w-xl mx-auto relative group">
            <div className={`absolute -inset-1 bg-gradient-to-r ${error ? 'from-purple-500 to-red-800' : 'from-cyan-400 via-purple-500 to-indigo-600'} rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-500`}></div>
            <div className={`relative flex bg-gray-900 rounded-lg p-2 border ${error ? 'border-purple-500' : 'border-gray-800'} shadow-2xl transition-colors`}>
              <input 
                type="text" 
                placeholder="Paste your current URL (e.g. mybusiness.com)" 
                className="w-full bg-transparent text-white p-4 outline-none font-mono placeholder-gray-600"
                value={url}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <button 
                onClick={handleAnalyze}
                disabled={isLoading}
                className="bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-white font-bold px-8 py-3 rounded whitespace-nowrap transition-all flex items-center gap-2 font-mono disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'SCANNING...' : <>AUDIT <ArrowRight size={18}/></>}
              </button>
            </div>
            {error && (
                <div className="absolute left-0 -bottom-8 flex items-center text-purple-400 text-xs font-mono animate-fade-in">
                    <AlertCircle className="w-3 h-3 mr-1 text-purple-500" />
                    {error}
                </div>
            )}
            {!error && (
                <p className="text-gray-600 text-xs mt-4 text-center font-mono">
                *Instant free analysis. No credit card required.
                </p>
            )}
          </div>
        </div>
      </section>

      {/* INTELLIGENCE CORE SECTION */}
      <section id="core" className="py-24 px-6 bg-[#050505] border-b border-gray-800 relative overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(30,30,30,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(30,30,30,0.5)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/30 border border-indigo-500/50 text-xs font-mono text-indigo-300 mb-4">
                    <ScanFace size={14} /> INTELLIGENCE CORE
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                    Before & After. <span className="text-purple-500">Instantly.</span>
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Powered by <span className="text-white font-bold">Gemini 2.5 Flash Image</span> (Nano Banana) for pixel-perfect reconstruction and <span className="text-white font-bold">Veo 3.1</span> for cinematic transformation.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
                
                {/* 1. BEFORE / AFTER SLIDER */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-2 shadow-2xl flex flex-col h-[500px]">
                    <div className="flex justify-between items-center px-4 py-2 mb-2 border-b border-gray-800">
                         <div className="flex items-center gap-4">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                            </div>
                            {/* Toggle Controls */}
                            <div className="flex bg-black rounded p-0.5 border border-gray-700">
                                <button 
                                    onClick={() => setDemoMode('B')}
                                    className={`px-3 py-1 text-[10px] font-mono rounded transition-colors ${demoMode === 'B' ? 'bg-cyan-900/50 text-cyan-400 border border-cyan-500/30' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    NEON [B]
                                </button>
                                <button 
                                    onClick={() => setDemoMode('A')}
                                    className={`px-3 py-1 text-[10px] font-mono rounded transition-colors ${demoMode === 'A' ? 'bg-indigo-900/50 text-indigo-400 border border-indigo-500/30' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    CORP [A]
                                </button>
                            </div>
                         </div>
                         <div className="text-[10px] font-mono text-gray-500">
                            visual_refine_v2.5.exe
                         </div>
                    </div>

                    <div 
                        className="relative w-full h-full overflow-hidden rounded-xl cursor-col-resize select-none group"
                        ref={sliderRef}
                        onMouseDown={() => setIsDragging(true)}
                        onTouchStart={() => setIsDragging(true)}
                        onMouseMove={handleMouseMove}
                        onTouchMove={handleTouchMove}
                    >
                        {/* --- AFTER IMAGE (Bottom Layer) --- */}
                        {demoMode === 'B' ? (
                            /* NEON STYLE (Path B) */
                            <div className="absolute inset-0 bg-black flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black">
                                <div className="w-full max-w-md border border-gray-800 p-8 rounded-none relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500 shadow-[0_0_20px_#22d3ee]"></div>
                                    <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 mb-2 tracking-tighter uppercase font-mono">
                                        Future<span className="text-cyan-400">_Ready</span>
                                    </h1>
                                    <p className="text-gray-500 font-mono text-xs mb-8 tracking-[0.3em]">EST. 2026 // SYSTEM ONLINE</p>
                                    <button className="w-full bg-cyan-500 text-black font-bold px-6 py-4 rounded-none hover:bg-cyan-400 transition-all font-mono tracking-wider shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                                        INITIATE_SEQUENCE ->
                                    </button>
                                </div>
                                <div className="absolute bottom-6 right-6 flex gap-2">
                                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-75"></div>
                                </div>
                            </div>
                        ) : (
                            /* CORPORATE STYLE (Path A) */
                            <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-8 text-center">
                                <nav className="absolute top-0 left-0 w-full p-6 flex justify-between items-center border-b border-gray-100">
                                    <div className="font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                        <div className="w-6 h-6 bg-blue-600 rounded-lg"></div> SnapCorp
                                    </div>
                                    <div className="text-sm font-medium text-slate-500">Solutions</div>
                                </nav>
                                <div className="max-w-lg">
                                    <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold mb-6">NEW RELEASE v2.0</div>
                                    <h1 className="text-5xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
                                        Scale your revenue <br/> <span className="text-blue-600">without the friction.</span>
                                    </h1>
                                    <div className="flex gap-4 justify-center">
                                        <button className="bg-slate-900 text-white font-medium px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors shadow-xl shadow-slate-200">
                                            Start Free Trial
                                        </button>
                                        <button className="bg-white text-slate-600 font-medium px-6 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                                            View Demo
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}


                        {/* --- BEFORE IMAGE (Top Layer, Clipped) --- */}
                        <div 
                            className="absolute inset-0 bg-white shadow-[5px_0_30px_rgba(0,0,0,0.5)] border-r border-gray-300"
                            style={{ width: `${sliderPosition}%` }}
                        >
                            {/* DATED SITE DESIGN */}
                            <div className="w-full h-full relative bg-[#e0e0e0] font-serif text-black overflow-hidden">
                                <div className="bg-gradient-to-b from-blue-800 to-blue-900 text-white p-2 text-center text-xs">
                                    Welcome to Official Website
                                </div>
                                <div className="bg-white border-b-4 border-orange-500 p-4 flex justify-between items-center">
                                    <span className="font-bold text-2xl text-blue-900 italic">MyBusiness<span className="text-orange-500">Inc.</span></span>
                                    <div className="text-xs text-right">
                                        <div className="font-bold">Call Us Now:</div>
                                        <div className="text-red-600 font-bold text-lg">555-0123</div>
                                    </div>
                                </div>
                                <div className="bg-gray-200 border-b border-gray-400 p-2 text-sm flex gap-4 text-blue-700 underline">
                                    <span>Home</span> | <span>Services</span> | <span>About Us</span> | <span>Contact</span> | <span>Sitemap</span>
                                </div>
                                
                                <div className="p-8 text-center flex flex-col items-center">
                                    <div className="w-full max-w-sm bg-gray-300 h-32 mb-4 border border-gray-400 flex items-center justify-center text-gray-500 text-xs">
                                        [Banner Image Missing]
                                    </div>
                                    <h1 className="text-3xl font-serif text-black mb-2 shadow-sm">Quality Services Since 1998</h1>
                                    <p className="text-sm text-black mb-6 max-w-xs leading-relaxed">
                                        We are the number one provider in the region. We have been serving customers for over 20 years with dedication and hard work.
                                    </p>
                                    <table className="border-collapse border border-gray-400 mb-6 bg-white w-full max-w-xs text-xs">
                                        <tbody>
                                            <tr>
                                                <td className="border border-gray-400 p-1">Service A</td>
                                                <td className="border border-gray-400 p-1">Available</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-400 p-1">Service B</td>
                                                <td className="border border-gray-400 p-1">Available</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <button className="bg-gradient-to-b from-gray-100 to-gray-300 border border-gray-400 text-black px-4 py-1 rounded text-sm hover:bg-gray-200">
                                        Click Here To Learn More
                                    </button>
                                </div>
                                <div className="absolute bottom-0 w-full bg-blue-900 text-white text-[10px] p-2 text-center">
                                    Copyright 2005. Optimized for Internet Explorer 6.
                                </div>
                            </div>
                        </div>

                        {/* SLIDER HANDLE */}
                        <div 
                            className={`absolute top-0 bottom-0 w-1 cursor-col-resize z-20 flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)] ${demoMode === 'B' ? 'bg-cyan-500 shadow-cyan-500/50' : 'bg-blue-600 shadow-blue-600/50'}`}
                            style={{ left: `${sliderPosition}%` }}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-lg ${demoMode === 'B' ? 'bg-cyan-500' : 'bg-blue-600'}`}>
                                <MoveHorizontal size={16} className="text-white" />
                            </div>
                        </div>

                        {/* Labels */}
                        <div className="absolute top-16 left-4 bg-white/90 text-black px-3 py-1 rounded border border-gray-300 font-bold text-[10px] shadow-lg pointer-events-none uppercase tracking-wider">
                            INPUT: RAW URL
                        </div>
                        <div className={`absolute top-16 right-4 px-3 py-1 rounded font-bold text-[10px] shadow-lg pointer-events-none uppercase tracking-wider border ${demoMode === 'B' ? 'bg-black/80 text-cyan-400 border-cyan-500' : 'bg-white text-blue-600 border-blue-200'}`}>
                            OUTPUT: {demoMode === 'B' ? 'ANTIGRAVITY' : 'CORPORATE'}
                        </div>
                    </div>
                </div>

                {/* 2. VEO VIDEO PREVIEW */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-2 shadow-2xl flex flex-col h-[500px]">
                    <div className="flex justify-between items-center px-4 py-2 mb-2 border-b border-gray-800">
                         <div className="flex items-center gap-2">
                             <Video size={14} className="text-purple-500" />
                             <span className="text-xs font-mono text-gray-500">veo_generation_preview.mp4</span>
                         </div>
                         <div className="flex items-center gap-2">
                             <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                             <span className="text-[10px] font-mono text-gray-400">REC</span>
                         </div>
                    </div>

                    <div className="relative flex-1 bg-black rounded-xl overflow-hidden group">
                        {/* Video Background (Simulated with CSS Animation for now) */}
                        <div className="absolute inset-0 bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black">
                             {/* Animated Shapes */}
                             <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-500/20 rounded-full blur-xl animate-pulse"></div>
                             <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-purple-500/20 rounded-full blur-xl animate-bounce duration-[3000ms]"></div>
                             
                             {/* Grid Overlay */}
                             <div className="absolute inset-0 bg-[linear-gradient(transparent_95%,#22d3ee_95%)] bg-[size:100%_40px] opacity-10 animate-scan"></div>
                        </div>

                        {/* Content Overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-8 text-center">
                            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform cursor-pointer border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                <Play size={32} className="text-white ml-2" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Watch the Transformation</h3>
                            <p className="text-gray-400 text-sm max-w-xs mb-8">
                                Veo 3.1 analyzes your site structure and renders a cinematic commercial of your new brand identity in minutes.
                            </p>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-900/40 border border-purple-500/40 rounded text-[10px] font-mono text-purple-300">
                                <Sparkles size={10} /> GENERATED WITH VEO 3
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
                            <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-600 w-2/3"></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </section>

      {/* SHOWCASE SECTION */}
      <section id="examples" className="py-24 px-6 bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Two Styles. Same Power.</h2>
            <p className="text-gray-400">Our AI generates two distinct visual routes. You choose the one that fits your brand.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* ROUTE A */}
            <div className="group relative rounded-2xl overflow-hidden border border-gray-800 bg-gray-900 hover:border-indigo-500/50 transition-colors duration-500">
              <div className="aspect-video bg-gray-800 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition"></div>
                {/* Simulated content for corporate style */}
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="text-center p-8">
                        <div className="h-4 w-32 bg-gray-700 rounded mb-4 mx-auto"></div>
                        <div className="h-8 w-48 bg-white/10 rounded mb-8 mx-auto"></div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="h-24 bg-gray-700/50 rounded"></div>
                            <div className="h-24 bg-gray-700/50 rounded"></div>
                            <div className="h-24 bg-gray-700/50 rounded"></div>
                        </div>
                    </div>
                </div>
                <div className="absolute z-10 bg-white/10 backdrop-blur px-5 py-2.5 rounded-full border border-white/20 flex items-center gap-2 text-sm font-bold">
                  <Play size={14} fill="white" /> View "Route A" Demo
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2 text-white">Route A: "The Corporate"</h3>
                <p className="text-gray-400 text-sm mb-6">Inspired by Apple & Stripe. Clean, minimalist, focused on trust and authority.</p>
                <ul className="space-y-3 text-sm text-gray-300 font-mono">
                  <li className="flex gap-3"><CheckCircle size={16} className="text-indigo-400"/> Sans-Serif Typography</li>
                  <li className="flex gap-3"><CheckCircle size={16} className="text-indigo-400"/> White/Grey Backgrounds</li>
                  <li className="flex gap-3"><CheckCircle size={16} className="text-indigo-400"/> Smooth Micro-interactions</li>
                </ul>
              </div>
            </div>

            {/* ROUTE B */}
            <div className="group relative rounded-2xl overflow-hidden border border-gray-800 bg-gray-900 hover:border-cyan-500/50 transition-colors duration-500">
              <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-cyan-500/5 group-hover:bg-cyan-500/10 transition"></div>
                 {/* Simulated content for cyberpunk style */}
                 <div className="w-full h-full bg-[#050505] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_90%,#111_90%)] bg-[length:10px_10px] opacity-20"></div>
                    <div className="text-center p-8 relative z-10">
                        <div className="h-12 w-56 bg-cyan-900/20 border border-cyan-500/30 rounded-none mb-4 mx-auto transform -skew-x-12"></div>
                        <div className="h-4 w-32 bg-gray-800 rounded-none mb-8 mx-auto"></div>
                    </div>
                </div>
                <div className="absolute z-10 bg-black/50 backdrop-blur px-5 py-2.5 rounded-full border border-cyan-500/50 flex items-center gap-2 text-cyan-400 text-sm font-bold">
                  <Play size={14} fill="#22d3ee" /> View "Route B" Demo
                </div>
              </div>
              <div className="p-8 border-t border-gray-800">
                <h3 className="text-2xl font-bold mb-2 text-white">Route B: "Antigravity"</h3>
                <p className="text-gray-400 text-sm mb-6">Inspired by Brutalism & Cyberpunk. Dark, neon, aggressive. For brands that break rules.</p>
                <ul className="space-y-3 text-sm text-gray-300 font-mono">
                  <li className="flex gap-3"><CheckCircle size={16} className="text-cyan-400"/> Giant Display Typography</li>
                  <li className="flex gap-3"><CheckCircle size={16} className="text-cyan-400"/> Pure Dark Mode</li>
                  <li className="flex gap-3"><CheckCircle size={16} className="text-cyan-400"/> "Glitch" Effects & Speed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 px-6 bg-[#030712] border-b border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center tracking-tight">The 24-Hour Process</h2>
          <div className="relative border-l-2 border-gray-800 ml-4 md:ml-0 md:pl-0 space-y-12">
            
            <div className="relative md:grid md:grid-cols-5 items-center gap-8 pl-12 md:pl-0 group">
              <div className="md:col-span-2 md:text-right text-gray-500 font-mono group-hover:text-cyan-400 transition-colors">00:00 - START</div>
              <div className="absolute left-[-9px] md:left-auto md:relative md:col-span-1 flex justify-center">
                <div className="w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">Input & AI Analysis</h3>
                <p className="text-gray-400 mt-2 text-sm leading-relaxed">Paste your URL. Our AI audits critical errors and generates drafts for Route A and B immediately.</p>
              </div>
            </div>

            <div className="relative md:grid md:grid-cols-5 items-center gap-8 pl-12 md:pl-0 group">
              <div className="md:col-span-2 md:text-right text-gray-500 font-mono group-hover:text-white transition-colors">00:15 - DECISION</div>
              <div className="absolute left-[-9px] md:left-auto md:relative md:col-span-1 flex justify-center">
                <div className="w-4 h-4 bg-gray-700 rounded-full group-hover:bg-gray-500 transition-colors"></div>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold text-white">Selection & Payment</h3>
                <p className="text-gray-400 mt-2 text-sm leading-relaxed">Choose your favorite style. Pay securely via Stripe. The clock starts.</p>
              </div>
            </div>

             <div className="relative md:grid md:grid-cols-5 items-center gap-8 pl-12 md:pl-0 group">
              <div className="md:col-span-2 md:text-right text-gray-500 font-mono group-hover:text-white transition-colors">01:00 - SPRINT</div>
              <div className="absolute left-[-9px] md:left-auto md:relative md:col-span-1 flex justify-center">
                <div className="w-4 h-4 bg-gray-700 rounded-full group-hover:bg-gray-500 transition-colors"></div>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold text-white">Human Expert Takeover</h3>
                <p className="text-gray-400 mt-2 text-sm leading-relaxed">An elite developer takes the AI code and refines SEO, copy, and mobile responsiveness.</p>
              </div>
            </div>

            <div className="relative md:grid md:grid-cols-5 items-center gap-8 pl-12 md:pl-0 group">
              <div className="md:col-span-2 md:text-right text-gray-500 font-mono group-hover:text-purple-400 transition-colors">24:00 - DELIVERY</div>
              <div className="absolute left-[-9px] md:left-auto md:relative md:col-span-1 flex justify-center">
                <div className="w-4 h-4 bg-purple-500 rounded-full animate-ping opacity-75"></div>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">Go Live</h3>
                <p className="text-gray-400 mt-2 text-sm leading-relaxed">You receive your final link. We connect your domain. Your site starts selling.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-6 bg-gray-900 border-b border-gray-800">
         <div className="max-w-4xl mx-auto text-center">
           <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Simple Pricing. No Surprises.</h2>
           
           <div className="bg-black border border-purple-500/30 p-8 md:p-12 rounded-3xl max-w-lg mx-auto relative shadow-[0_0_50px_rgba(168,85,247,0.1)] hover:shadow-[0_0_80px_rgba(168,85,247,0.15)] transition-shadow duration-500">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold px-4 py-1 rounded-full text-xs tracking-widest font-mono">LAUNCH OFFER</div>
             <div className="text-gray-400 mb-2 font-mono text-sm uppercase">One-time Payment</div>
             <div className="text-6xl font-mono font-bold text-white mb-8 flex justify-center items-start">
               <span className="text-2xl mt-2">$</span>299
             </div>
             
             <ul className="text-left space-y-4 mb-10 text-gray-300 font-mono text-sm">
               <li className="flex gap-3"><CheckCircle size={20} className="text-cyan-400 shrink-0"/> Full URL + Competitor Analysis</li>
               <li className="flex gap-3"><CheckCircle size={20} className="text-cyan-400 shrink-0"/> 2 Design Proposals (A/B)</li>
               <li className="flex gap-3"><CheckCircle size={20} className="text-cyan-400 shrink-0"/> React/Next.js Development</li>
               <li className="flex gap-3"><CheckCircle size={20} className="text-cyan-400 shrink-0"/> Guaranteed 24h Delivery</li>
               <li className="flex gap-3"><CheckCircle size={20} className="text-cyan-400 shrink-0"/> Hosting included (Vercel)</li>
             </ul>

             <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
               className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-bold py-4 rounded-xl text-lg transition-all transform hover:scale-[1.02]"
             >
               AUDIT MY SITE NOW
             </button>
             <p className="text-gray-600 text-[10px] mt-4 font-mono uppercase">Satisfaction guaranteed or money back.</p>
           </div>
         </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 bg-black text-center text-gray-600 border-t border-gray-800">
        <p className="font-mono mb-6 text-sm">SNAP_2026 // POWERED BY GEMINI 3 PRO</p>
        <div className="flex justify-center gap-8 text-xs font-mono">
          <a href="#" className="hover:text-white transition-colors">Términos</a>
          <a href="#" className="hover:text-white transition-colors">Privacidad</a>
          <a href="#" className="hover:text-white transition-colors">Soporte</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingView;