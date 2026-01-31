
import React, { useState } from 'react';
import { Character } from '../types';
import { BadgeCheck, Trash2, AlertTriangle, X } from 'lucide-react';
import { IMAGE_ASSETS } from '../data_images';

interface Props {
  player: Character;
  onDeleteCharacter: () => void;
}

const CharacterView: React.FC<Props> = ({ player, onDeleteCharacter }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 使用本地角色頭像路徑
  const avatarUrl = IMAGE_ASSETS.UI.AVATAR_HERO;

  return (
    <div className="w-full h-full bg-[#1e1e1e] p-4 md:p-8 overflow-y-auto custom-scrollbar animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Character Portrait */}
        <div className="w-full max-w-sm bg-stone-900/50 rounded-3xl border-2 border-stone-800 p-6 md:p-12 shadow-inner mb-8 relative">
          
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-orange-500/5 blur-3xl rounded-full"></div>
            <img 
              src={avatarUrl} 
              alt="Character Sprite"
              className="w-40 h-40 md:w-64 md:h-64 object-contain relative z-10 drop-shadow-2xl mx-auto"
            />
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-widest uppercase">{player.name}</h2>
            <BadgeCheck className="text-orange-500" size={24} />
          </div>
          <div className="mt-2 text-stone-500 font-bold uppercase tracking-widest text-[10px]">
            冒險者
          </div>

          {/* Delete Character Trigger */}
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="mt-10 md:mt-12 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-900/10 text-red-500 hover:bg-red-900/20 border border-red-900/20 transition-all text-[10px] md:text-xs font-black uppercase tracking-widest"
          >
            <Trash2 size={14} />
            重置角色
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
          <div className="bg-[#1a1c21] border-2 border-red-900/50 p-6 md:p-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl animate-in zoom-in duration-300 relative">
            <button 
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-6 right-6 text-stone-600 hover:text-white"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border-2 border-red-500/20">
                <AlertTriangle className="text-red-500" size={32} />
              </div>
              
              <h3 className="text-xl md:text-2xl font-black text-white mb-3 tracking-widest uppercase">重置冒險進度？</h3>
              
              <p className="text-stone-400 text-[10px] md:text-xs font-bold leading-relaxed mb-8">
                這將永久刪除你的冒險者 <span className="text-red-400">[{player.name}]</span>、所有的寵物以及獲得的物品。此操作無法撤銷，你確定嗎？
              </p>

              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={() => {
                    onDeleteCharacter();
                    setShowDeleteModal(false);
                  }}
                  className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-sm tracking-widest uppercase transition-all shadow-lg active:scale-95"
                >
                  確認刪除並離開
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-4 bg-stone-900 text-stone-500 rounded-2xl font-black text-sm tracking-widest uppercase hover:text-white transition-all"
                >
                  繼續冒險
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterView;
