import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 'lg' }) => {
  const isSmall = size === 'sm';
  
  return (
    <div className={`flex items-center ${isSmall ? 'gap-2' : 'gap-4'} ${className} select-none`}>
      {/* Icon */}
      <div className={`
        relative flex items-center justify-center 
        ${isSmall ? 'w-8 h-8 rounded-lg' : 'w-20 h-20 rounded-2xl'} 
        bg-gradient-to-br from-indigo-300 via-purple-300 to-cyan-200
        shadow-lg shadow-purple-500/30 border border-white/20
      `}>
        {/* Glass reflection */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-80 rounded-inherit" />
        
        {/* Arrow */}
        <ArrowUpRight 
          className={`
            relative z-10 text-white drop-shadow-md 
            ${isSmall ? 'w-5 h-5' : 'w-10 h-10'}
          `} 
          strokeWidth={3} 
        />
      </div>
      
      {/* Text */}
      <h1 className={`
        font-bold tracking-tighter flex items-center font-sans
        ${isSmall ? 'text-xl' : 'text-6xl'}
      `}>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500">Snap</span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">2026</span>
      </h1>
    </div>
  );
};

export default Logo;