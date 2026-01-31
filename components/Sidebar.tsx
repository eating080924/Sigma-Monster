
import React, { useState } from 'react';
import { GameView, MapData } from '../types';
import { MAPS } from '../constants';
import { User, Dog, Package, Shield, Map, ChevronDown, ChevronRight, Lock } from 'lucide-react';

interface SidebarProps {
  currentView: GameView;
  onViewChange: (v: GameView) => void;
  onExplore: (map: MapData) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, onExplore }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    character: true,
    explore: true
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const NavItem: React.FC<{ view: GameView, label: string, icon: React.ReactNode }> = ({ view, label, icon }) => (
    <button 
      onClick={() => onViewChange(view)}
      className={`w-full flex items-center space-x-3 px-8 py-2 transition-all ${currentView === view ? 'bg-orange-500/10 text-orange-400 border-r-2 border-orange-500' : 'hover:bg-stone-800/50 text-gray-400'}`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  const SectionHeader: React.FC<{ id: string, label: string, icon: React.ReactNode }> = ({ id, label, icon }) => (
    <button 
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between px-4 py-3 text-gray-300 hover:bg-stone-900/80 transition-colors border-b border-stone-800/50"
    >
      <div className="flex items-center space-x-3">
        {icon}
        <span className="font-bold text-sm tracking-wide">{label}</span>
      </div>
      {openSections[id] ? <ChevronDown size={16} className="text-stone-500" /> : <ChevronRight size={16} className="text-stone-500" />}
    </button>
  );

  const groupedMaps = [
    { label: '冒險區域', maps: MAPS },
  ];

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a]">
      {/* Character Management Dropdown */}
      <div>
        <SectionHeader id="character" label="人物管理" icon={<User size={18} className="text-orange-500" />} />
        {openSections.character && (
          <div className="bg-stone-900/30 py-1">
            <NavItem view={GameView.CHARACTER} label="人物屬性" icon={<Shield size={16} />} />
            <NavItem view={GameView.PETS} label="寵物資料" icon={<Dog size={16} />} />
            <NavItem view={GameView.BAG} label="道具裝備" icon={<Package size={16} />} />
          </div>
        )}
      </div>

      {/* Map Exploration Dropdown */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <SectionHeader id="explore" label="地圖探索" icon={<Map size={18} className="text-green-500" />} />
        {openSections.explore && (
          <div className="bg-stone-900/30">
            {groupedMaps.map(group => (
              <div key={group.label} className="py-2">
                <div className="px-6 py-1 text-[10px] font-bold text-stone-500 uppercase tracking-widest">{group.label}</div>
                {group.maps.map(map => (
                  <button 
                    key={map.id}
                    onClick={() => onExplore(map)}
                    className="w-full text-left px-8 py-3 text-xs transition-colors flex items-center justify-between hover:bg-stone-800/50 hover:text-white text-gray-400 border-b border-stone-800/20 last:border-0"
                  >
                    <div className="flex flex-col items-start space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <div className="w-1 h-1 rounded-full bg-green-500"></div>
                        <span className="font-bold">{map.name}</span>
                      </div>
                      <span className="text-[10px] text-stone-600 ml-3 line-clamp-1 italic">{map.description}</span>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
