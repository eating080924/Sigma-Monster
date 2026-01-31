
import React, { useState } from 'react';
import { Pet, Skill } from '../types';
import { Star, Swords, Shield, Zap, Trash2, AlertTriangle, Brain, Sparkles } from 'lucide-react';

interface Props {
  pets: Pet[];
  onSetActive: (id: string) => void;
  onDeletePet: (id: string) => void;
}

const PetsView: React.FC<Props> = ({ pets, onSetActive, onDeletePet }) => {
  const [petToDelete, setPetToDelete] = useState<Pet | null>(null);

  return (
    <div className="w-full h-full bg-[#1e1e1e] p-4 md:p-8 overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl md:text-2xl font-black text-white mb-6 border-b-2 border-stone-800 pb-4 flex items-center">
          <Star className="mr-3 text-yellow-500 fill-yellow-500" size={20} /> 寵物管理
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
          {pets.map(pet => {
            const expToNext = pet.level * 100;
            const expProgress = pet.level >= 20 ? 100 : (pet.exp / expToNext) * 100;
            
            return (
              <div 
                key={pet.id} 
                className={`relative rounded-2xl border-2 p-5 md:p-6 transition-all duration-300 flex flex-col ${pet.isActive ? 'bg-stone-800/50 border-orange-500 shadow-[0_0_20px_rgba(234,88,12,0.15)] md:scale-105 z-10' : 'bg-stone-900 border-stone-800 hover:border-stone-600'}`}
              >
                {!pet.isStarter && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPetToDelete(pet);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-red-900/20 text-red-500 hover:bg-red-900/40 border border-red-800/30 transition-all z-20"
                    title="放生寵物"
                  >
                    <Trash2 size={16} />
                  </button>
                )}

                {pet.isActive && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full tracking-widest uppercase z-20">
                    出戰中
                  </div>
                )}
                
                <div className="flex flex-col items-center flex-1">
                  <div className="relative mb-4">
                    <img 
                      src={pet.image} 
                      alt={pet.name} 
                      className="w-28 h-28 md:w-32 md:h-32 object-contain drop-shadow-xl"
                    />
                    {pet.level >= 20 && (
                      <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-black font-black text-[8px] px-2 py-0.5 rounded-md shadow-lg border border-yellow-300">
                        MAX LV
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1">{pet.name}</h3>
                  <p className="text-xs text-stone-500 mb-4">{pet.species} Lv. {pet.level}</p>
                  
                  <div className="w-full space-y-3 mb-6">
                    {/* HP Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="flex items-center text-red-400 font-bold"><Heart size={12} className="mr-1" /> HP</span>
                        <span className="font-mono text-stone-300">{pet.hp}/{pet.maxHp}</span>
                      </div>
                      <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-600 to-orange-500" style={{ width: `${(pet.hp / pet.maxHp) * 100}%` }} />
                      </div>
                    </div>

                    {/* EXP Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="flex items-center text-cyan-400 font-bold"><Sparkles size={12} className="mr-1" /> EXP</span>
                        <span className="font-mono text-stone-300 text-[10px]">{pet.level >= 20 ? 'MAXIMUM' : `${pet.exp} / ${expToNext}`}</span>
                      </div>
                      <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-600 to-blue-500" style={{ width: `${expProgress}%` }} />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <div className="text-center bg-black/20 py-2 rounded-lg">
                        <div className="text-orange-400 flex justify-center mb-1"><Swords size={12} /></div>
                        <div className="text-[9px] text-stone-500 font-bold uppercase">ATK</div>
                        <div className="text-xs font-black text-white">{pet.atk}</div>
                      </div>
                      <div className="text-center bg-black/20 py-2 rounded-lg">
                        <div className="text-stone-400 flex justify-center mb-1"><Shield size={12} /></div>
                        <div className="text-[9px] text-stone-500 font-bold uppercase">DEF</div>
                        <div className="text-xs font-black text-white">{pet.def}</div>
                      </div>
                      <div className="text-center bg-black/20 py-2 rounded-lg">
                        <div className="text-cyan-400 flex justify-center mb-1"><Zap size={12} /></div>
                        <div className="text-[9px] text-stone-500 font-bold uppercase">SPD</div>
                        <div className="text-xs font-black text-white">{pet.spd}</div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full mb-6">
                    <div className="text-[10px] text-stone-500 font-black uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <Brain size={12} className="text-orange-500" /> 技能池
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                      {pet.skills.map((skill: Skill) => (
                        <div key={skill.id} className="bg-stone-900/80 border border-stone-800 rounded-lg p-2 group hover:border-stone-700 transition-colors">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[11px] font-black text-white">{skill.name}</span>
                            <span className="text-[9px] text-orange-500 font-mono font-bold">x{skill.power.toFixed(1)} Pwr</span>
                          </div>
                          <p className="text-[9px] text-stone-500 leading-tight italic line-clamp-1 group-hover:line-clamp-none">
                            {skill.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto w-full flex flex-col gap-2">
                    {!pet.isActive && (
                      <button 
                        onClick={() => onSetActive(pet.id)}
                        className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-black transition-all border-b-4 border-orange-800 active:border-b-0 active:translate-y-1 uppercase tracking-widest"
                      >
                        切換出戰
                      </button>
                    )}
                    {pet.isStarter && (
                      <div className="text-[9px] text-stone-600 font-black uppercase text-center tracking-widest">
                        初始夥伴 (不可放生)
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {petToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a1a] border-2 border-red-900/50 p-6 rounded-2xl max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-center mb-4 text-red-500">
              <AlertTriangle size={48} className="animate-pulse" />
            </div>
            <h3 className="text-xl font-black text-white mb-2 text-center">放生確認</h3>
            <p className="text-stone-400 text-sm text-center mb-6">
              你確定要放生寵物 <span className="text-red-400 font-bold">[{petToDelete.name}]</span> 嗎？一旦放生，這隻寵物將永遠離開你的隊伍。
              {petToDelete.isActive && <div className="mt-2 text-xs text-orange-500 font-bold uppercase tracking-wider">註：這隻寵物目前正在出戰狀態！</div>}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setPetToDelete(null)}
                className="flex-1 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl font-bold transition-all border border-stone-700"
              >
                留住它
              </button>
              <button
                onClick={() => {
                  onDeletePet(petToDelete.id);
                  setPetToDelete(null);
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)]"
              >
                確認放生
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Heart = ({ size, className }: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>;

export default PetsView;
