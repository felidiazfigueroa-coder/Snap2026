import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { chatWithBot } from '../services/geminiService';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
        // Construct history for Gemini SDK
        const history = messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        }));
        
        const response = await chatWithBot(history, userMsg);
        setMessages(prev => [...prev, { role: 'model', text: response || "I'm processing that..." }]);
    } catch (error) {
        setMessages(prev => [...prev, { role: 'model', text: "Connection error. Please try again." }]);
    } finally {
        setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-500 text-white p-4 rounded-full shadow-2xl transition-all z-50 group border border-purple-400/30"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute right-full mr-3 top-2 bg-gray-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
            Ask Gemini 3 Pro
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-gray-900 border border-purple-500/30 rounded-xl shadow-2xl flex flex-col z-50 h-[500px]">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-800 rounded-t-xl">
        <h3 className="text-white font-bold font-mono flex items-center">
            <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></span>
            SNAP ASSISTANT
        </h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-cyan-400 transition-colors">
            <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm" ref={scrollRef}>
        {messages.length === 0 && (
            <p className="text-gray-500 text-center mt-10">System online. Ask me about SNAP 2026 or web optimization.</p>
        )}
        {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${m.role === 'user' ? 'bg-purple-900/50 text-purple-100' : 'bg-gray-800 text-gray-200'}`}>
                    {m.text}
                </div>
            </div>
        ))}
        {loading && (
            <div className="flex justify-start">
                <div className="bg-gray-800 p-3 rounded-lg">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                </div>
            </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-800 bg-gray-900 rounded-b-xl flex gap-2">
        <input 
            type="text"
            className="flex-1 bg-black border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500 font-mono"
            placeholder="Type query..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button 
            onClick={handleSend}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-500 text-white p-2 rounded disabled:opacity-50"
        >
            <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;