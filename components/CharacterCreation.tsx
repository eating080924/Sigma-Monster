import React, { useState } from 'react';
import { ShieldCheck, ChevronRight, ChevronLeft } from 'lucide-react';
import { PET_DATABASE } from '../data_pets';

interface Props {
  onComplete: (name: string, starterPetId: string) => void;
}

const CharacterCreation: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedPetId, setSelectedPetId] = useState(PET_DATABASE[0].id);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setStep(2);
    }
  };

  const handleFinish = () => {
    onComplete(name.trim(), selectedPetId);
  };

  const selectedPet = PET_DATABASE.find(p => p.id === selectedPetId);

  return (
    <div className="fixed inset-0 z-[100] bg-[#0f1115] flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10" 
           style={{
             backgroundImage: 'radial-gradient(circle at 2px 2px, #444 1px, transparent 0)',
             backgroundSize: '30px 30px',
           }}></div>

      <div className="relative w-full max-w-lg bg-[#1a1c21] border-2 border-stone-800 rounded-[2.5rem] p-6 md:p-10 shadow-2xl animate-in fade-in zoom-in duration-500 overflow-y-auto max-h-[90vh]">
        <div className="text-center mt-6 mb-8">
          <h1 className="text-2xl font-black text-white tracking-widest uppercase mb-1">
            {step === 1 ? '角色創建' : '選擇寵物'}
          </h1>
          <p className="text-stone-500 text-[10px] font-bold tracking-widest uppercase opacity-70">
            Step {step} of 2
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleNextStep} className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] block text-center">冒險者名稱</label>
              <input
                type="text"
                required
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="輸入冒險者名稱..."
                className="w-full bg-stone-900 border-2 border-stone-800 rounded-2xl px-6 py-4 text-center text-white font-bold placeholder:text-stone-700 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-stone-800 hover:bg-stone-700 text-white py-4 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <span>下 一 步</span>
              <ChevronRight size={20} />
            </button>
          </form>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="grid grid-cols-3 gap-3">
              {PET_DATABASE.map(pet => (
                <button
                  key={pet.id}
                  onClick={() => setSelectedPetId(pet.id)}
                  className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all ${selectedPetId === pet.id ? 'bg-orange-500/10 border-orange-500 scale-105' : 'bg-stone-900/50 border-stone-800 opacity-60'}`}
                >
                  <img src={pet.image} className="w-16 h-16 object-contain" alt={pet.name} />
                  <span className="text-[9px] font-black text-white mt-1 uppercase">{pet.name}</span>
                </button>
              ))}
            </div>

            {selectedPet && (
              <div className="bg-stone-900/80 rounded-2xl p-4 border border-stone-800 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-left flex-1">
                    <h3 className="text-white font-black uppercase text-lg">{selectedPet.name}</h3>
                    <p className="text-stone-500 text-[10px] font-bold uppercase">{selectedPet.species}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-black/20 p-2 rounded-lg text-center">
                    <div className="text-[8px] text-stone-500 font-bold uppercase">ATK</div>
                    <div className="text-sm font-black text-orange-400">{selectedPet.atk}</div>
                  </div>
                  <div className="bg-black/20 p-2 rounded-lg text-center">
                    <div className="text-[8px] text-stone-500 font-bold uppercase">DEF</div>
                    <div className="text-sm font-black text-blue-400">{selectedPet.def}</div>
                  </div>
                  <div className="bg-black/20 p-2 rounded-lg text-center">
                    <div className="text-[8px] text-stone-500 font-bold uppercase">SPD</div>
                    <div className="text-sm font-black text-cyan-400">{selectedPet.spd}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-stone-900 border-2 border-stone-800 text-stone-400 py-4 rounded-2xl font-black text-lg active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <ChevronLeft size={20} />
                <span>返回</span>
              </button>
              <button
                onClick={handleFinish}
                className="flex-[2] bg-orange-600 hover:bg-orange-50 text-orange-950 py-4 rounded-2xl font-black text-lg shadow-[0_4px_20px_rgba(234,88,12,0.4)] active:scale-95 transition-all flex items-center justify-center gap-3 bg-gradient-to-r from-orange-600 to-orange-400 text-white"
              >
                <ShieldCheck size={24} />
                <span>開 始</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterCreation;