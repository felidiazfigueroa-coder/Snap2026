import React from 'react';
import { RoastResult } from '../types';
import { AlertTriangle, TrendingDown, Activity, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

interface RoastViewProps {
  data: RoastResult;
  onContinue: () => void;
}

const RoastView: React.FC<RoastViewProps> = ({ data, onContinue }) => {
  const scoreData = [
    { name: 'Score', value: data.score, fill: data.score > 70 ? '#22d3ee' : data.score > 40 ? '#c084fc' : '#a855f7' },
    { name: 'Gap', value: 100 - data.score, fill: '#1f2937' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-6 animate-fade-in">
      <div className="bg-gray-900/80 border border-gray-800 rounded-lg p-8 shadow-2xl backdrop-blur-sm">
        
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Activity className="text-purple-500 w-8 h-8 animate-pulse" />
          <h2 className="text-3xl font-bold font-mono tracking-tighter text-white">
            DIAGNOSTIC REPORT <span className="text-purple-500">CRITICAL</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Score Chart */}
            <div className="h-64 relative flex flex-col items-center justify-center bg-black/40 rounded-xl border border-gray-800">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={scoreData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                            stroke="none"
                        >
                            <Label 
                                value={`${data.score}/100`} 
                                position="center" 
                                className="fill-white text-3xl font-bold font-mono"
                            />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <p className="text-gray-400 text-sm font-mono mt-2 uppercase tracking-widest">Site Health</p>
            </div>

            {/* Errors List */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-200 border-b border-gray-700 pb-2">CRITICAL ERRORS DETECTED</h3>
                {data.errors.map((err, idx) => (
                    <div key={idx} className="flex items-start space-x-3 bg-purple-900/20 p-3 rounded border border-purple-900/50">
                        <AlertTriangle className="text-purple-500 w-5 h-5 mt-1 shrink-0" />
                        <span className="text-purple-100 font-mono text-sm">{err}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Brutal Summary */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg border-l-4 border-cyan-400">
            <h4 className="text-cyan-400 font-bold text-xs uppercase mb-1">Analyst Summary</h4>
            <p className="text-gray-300 font-mono text-lg">"{data.summary}"</p>
        </div>

        {/* Action */}
        <div className="mt-8 flex justify-end">
            <button 
                onClick={onContinue}
                className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-white transition-all duration-200 bg-gradient-to-r from-purple-600 to-indigo-600 font-mono rounded-none hover:from-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 ring-offset-gray-900"
            >
                <span>INITIATE RECOVERY PROTOCOL</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 border-2 border-white/20 pointer-events-none"></div>
            </button>
        </div>

      </div>
    </div>
  );
};

export default RoastView;