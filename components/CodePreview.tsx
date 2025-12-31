import React from 'react';
import { X, ExternalLink, Code } from 'lucide-react';

interface CodePreviewProps {
  html: string;
  onClose: () => void;
  mode: 'A' | 'B';
}

const CodePreview: React.FC<CodePreviewProps> = ({ html, onClose, mode }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full h-full max-w-6xl bg-[#1e1e1e] rounded-xl border border-gray-700 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header / Toolbar */}
        <div className="h-12 bg-[#252526] border-b border-[#333] flex items-center justify-between px-4 select-none">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="ml-4 flex items-center text-gray-400 text-xs font-mono bg-black/20 px-3 py-1 rounded">
               <Code className="w-3 h-3 mr-2 text-cyan-400" />
               <span>SNAP_PREVIEW_{mode}_V1.0.html</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
             <button 
                onClick={() => {
                    const blob = new Blob([html], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    window.open(url, '_blank');
                }}
                className="text-gray-400 hover:text-white transition-colors"
                title="Open in new tab"
             >
                <ExternalLink className="w-4 h-4 text-indigo-400" />
             </button>
             <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5 text-purple-400" />
             </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 relative bg-white">
            <iframe 
                srcDoc={html}
                title="Live Preview"
                className="absolute inset-0 w-full h-full border-none"
                sandbox="allow-scripts"
            />
        </div>
      </div>
    </div>
  );
};

export default CodePreview;