import React, { useState } from 'react';
import { Item } from '../types';
import { Package, Sparkles, Trash2, Info, X, Zap, ShieldCheck } from 'lucide-react';

interface Props {
  inventory: Item[];
  equipment: {
    fairy: Item | null;
  };
  onEquipFairy: (item: Item) => void;
  onUnequipFairy: () => void;
  onDeleteItem: (itemId: string) => void;
}

const InventoryView: React.FC<Props> = ({ inventory, equipment, onEquipFairy, onUnequipFairy, onDeleteItem }) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const getRarityColor = (rarity: Item['rarity']) => {
    switch (rarity) {
      case 'epic': return 'text-purple-400 border-purple-500 bg-purple-900/10';
      case 'rare': return 'text-blue-400 border-blue-500 bg-blue-900/10';
      case 'uncommon': return 'text-green-400 border-green-500 bg-green-900/10';
      default: return 'text-stone-400 border-stone-700 bg-stone-900/30';
    }
  };

  const getItemIcon = (type: Item['type']) => {
    switch (type) {
      case 'fairy': return <Sparkles size={24} />;
      default: return <Package size={24} />;
    }
  };

  const isEquipped = (itemId: string) => equipment.fairy?.id === itemId;

  return (
    <div className="w-full h-full bg-[#1e1e1e] p-4 md:p-8 overflow-y-auto custom-scrollbar relative">
      <div className="max-w-4xl mx-auto flex flex-col gap-6 md:gap-8">
        
        {/* Top: Equipment Slots */}
        <div className="w-full">
          <h2 className="text-lg md:text-xl font-black text-white mb-4 border-b border-stone-800 pb-2 flex items-center uppercase tracking-widest">
            <Sparkles className="mr-2 text-orange-500" size={18} /> 目前使用精靈
          </h2>
          <div className="w-full max-w-md">
            <div 
              onClick={() => equipment.fairy && setSelectedItem(equipment.fairy)}
              className="flex items-center p-4 md:p-5 bg-stone-900/50 rounded-2xl border border-stone-800 hover:border-orange-500/30 transition-all shadow-lg cursor-pointer group"
            >
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mr-4 md:mr-5 border-2 ${equipment.fairy ? getRarityColor(equipment.fairy.rarity) : 'bg-stone-800 border-dashed border-stone-700 text-stone-600'}`}>
                {equipment.fairy ? <Sparkles size={24} /> : <Sparkles size={24} className="opacity-20" />}
              </div>
              <div className="flex-1">
                <div className="text-[9px] text-stone-500 uppercase font-black tracking-[0.2em] mb-1">守護精靈</div>
                <div className={`text-sm md:text-base font-black ${equipment.fairy ? 'text-white' : 'text-stone-600'}`}>
                  {equipment.fairy ? equipment.fairy.name : '未裝備精靈'}
                </div>
                {equipment.fairy && <div className="text-[10px] text-orange-400 mt-0.5 font-bold uppercase tracking-tighter">裝備中</div>}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Inventory Grid */}
        <div className="flex-1">
          <h2 className="text-lg md:text-xl font-black text-white mb-6 border-b border-stone-800 pb-2 flex items-center justify-between">
            <div className="flex items-center uppercase tracking-widest">
              <Package className="mr-2 text-green-500" size={18} /> 背包 (精靈)
            </div>
            <span className="text-[10px] text-stone-500 font-bold">{inventory.length} / 12</span>
          </h2>
          
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5">
            {inventory.map((item) => (
              <div 
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`aspect-square rounded-xl border-2 flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 group relative ${getRarityColor(item.rarity)} ${isEquipped(item.id) ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-[#1e1e1e]' : ''}`}
              >
                {getItemIcon(item.type)}
                {isEquipped(item.id) && (
                    <div className="absolute -top-1 -right-1 bg-orange-500 rounded-full p-0.5 border border-stone-900">
                        <Zap size={8} className="text-white fill-white" />
                    </div>
                )}
              </div>
            ))}
            {/* Empty slots */}
            {Array.from({ length: Math.max(0, 12 - inventory.length) }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl border-2 border-stone-800 bg-stone-900/20 opacity-40"></div>
            ))}
          </div>
        </div>

        {/* Helper Footer */}
        <div className="bg-stone-900/40 p-4 rounded-2xl border border-white/5 flex items-start gap-4 mb-8">
          <Info className="text-stone-600 shrink-0 mt-1" size={16} />
          <div className="text-[10px] md:text-[11px] text-stone-500 leading-loose">
            <p className="font-bold text-stone-400 mb-1 uppercase tracking-widest">提示：</p>
            點擊背包中的精靈可進行「裝備」或「卸下」。裝備後的精靈將賦予你的夥伴強大輔助能力加成。
          </div>
        </div>
      </div>

      {/* Item Action Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
          <div className="bg-[#1a1c21] border-2 border-stone-800 p-6 rounded-[2rem] max-w-sm w-full shadow-2xl animate-in zoom-in duration-300 relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-1 opacity-50 ${getRarityColor(selectedItem.rarity).split(' ')[2]}`}></div>
            
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-stone-600 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center text-center mt-4">
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mb-4 border-2 shadow-2xl ${getRarityColor(selectedItem.rarity)}`}>
                {getItemIcon(selectedItem.type)}
              </div>
              
              <h3 className="text-xl md:text-2xl font-black text-white mb-4 tracking-widest uppercase">{selectedItem.name}</h3>
              
              <p className="text-stone-400 text-[10px] md:text-xs font-bold leading-relaxed mb-6 px-4 italic">
                "{selectedItem.description}"
              </p>

              <div className="w-full flex flex-col gap-2 mb-8">
                {selectedItem.effectValue && (
                  <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                      <div className="flex items-center justify-between text-[10px] md:text-[11px] font-black uppercase tracking-widest">
                          <span className="text-stone-500">提升強度</span>
                          <span className="text-orange-500">+{selectedItem.effectValue}%</span>
                      </div>
                  </div>
                )}
                {selectedItem.activationChance && (
                  <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                      <div className="flex items-center justify-between text-[10px] md:text-[11px] font-black uppercase tracking-widest">
                          <span className="text-stone-500">成功機率</span>
                          <span className="text-blue-500">{selectedItem.activationChance}%</span>
                      </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 w-full">
                {isEquipped(selectedItem.id) ? (
                    <button
                        onClick={() => {
                            onUnequipFairy();
                            setSelectedItem(null);
                        }}
                        className="w-full py-3.5 bg-stone-800 hover:bg-stone-700 text-white rounded-2xl font-black text-sm tracking-widest uppercase transition-all border-b-4 border-stone-950 active:translate-y-1 active:border-b-0"
                    >
                        卸下精靈
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            onEquipFairy(selectedItem);
                            setSelectedItem(null);
                        }}
                        className="w-full py-3.5 bg-orange-600 hover:bg-orange-50 text-white rounded-2xl font-black text-sm tracking-widest uppercase transition-all shadow-lg border-b-4 border-orange-900 active:translate-y-1 active:border-b-0 flex items-center justify-center gap-2"
                    >
                        <ShieldCheck size={18} />
                        裝備精靈
                    </button>
                )}
                
                <button
                  onClick={() => {
                    if (isEquipped(selectedItem.id)) onUnequipFairy();
                    onDeleteItem(selectedItem.id);
                    setSelectedItem(null);
                  }}
                  className="w-full py-3.5 bg-red-900/10 hover:bg-red-900/20 text-red-500 border border-red-900/20 rounded-2xl font-black text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  捨棄精靈
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryView;