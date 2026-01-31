
import React, { useEffect, useRef } from 'react';
import { CombatLogEntry } from '../types';

interface Props {
  logs: CombatLogEntry[];
}

const CombatLog: React.FC<Props> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [logs]);

  const getStyle = (type: CombatLogEntry['type']) => {
    switch (type) {
      case 'pvp_me': return 'text-lime-400 font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]';
      case 'pvp_op': return 'text-rose-500 font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]';
      case 'damage': return 'text-red-400 font-bold drop-shadow-sm';
      case 'system': return 'text-orange-400 font-black tracking-wide';
      case 'info': return 'text-blue-300 font-medium';
      default: return 'text-white font-medium';
    }
  };

  return (
    <div className="h-full px-8 pt-4 pb-10 space-y-1.5 overflow-y-auto custom-scrollbar flex flex-col">
      {logs.map((log) => (
        <div 
          key={log.id} 
          className={`${getStyle(log.type)} text-sm md:text-lg leading-relaxed tracking-tight animate-in fade-in slide-in-from-bottom-2`}
        >
          <span className="opacity-30 mr-3 font-mono text-xs md:text-sm tracking-tighter">
            {new Date(parseInt(log.id)).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <span className="drop-shadow-md">{log.text}</span>
        </div>
      ))}
      <div ref={bottomRef} className="h-4" />
    </div>
  );
};

export default CombatLog;
