
import React from 'react';
import { Character } from '../types';
import { Lock } from 'lucide-react';
import { IMAGE_ASSETS } from '../data_images';

interface Props {
  player: Character;
  onClick?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
}

const CharacterStatus: React.FC<Props> = ({ player, onClick, onDelete, disabled }) => {
  // 使用本地角色頭像路徑
  const avatarUrl = IMAGE_ASSETS.UI.AVATAR_HERO;

  return (
    <div className="flex items-center gap-4">
      <button 
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center space-x-4 bg-stone-900/60 p-2.5 pr-6 rounded-2xl border border-white/10 shadow-xl transition-all group relative ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-stone-800 hover:scale-105 active:scale-95'}`}
      >
        {disabled && (
          <div className="absolute -top-1.5 -right-1.5 bg-stone-800 border border-stone-600 rounded-full p-1.5 z-10 text-stone-400 shadow-lg">
            <Lock size={12} />
          </div>
        )}
        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-stone-800 border-2 overflow-hidden shadow-2xl transition-all ${disabled ? 'border-stone-700' : 'border-stone-600 group-hover:border-orange-500'}`}>
          <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex flex-col text-left">
          <div className={`font-black text-sm md:text-base tracking-widest uppercase ${disabled ? 'text-stone-500' : 'text-white'}`}>{player.name}</div>
          <div className="text-[10px] md:text-xs text-stone-500 font-black uppercase tracking-[0.2em] mt-0.5">Character Management</div>
        </div>
      </button>
    </div>
  );
};

export default CharacterStatus;
