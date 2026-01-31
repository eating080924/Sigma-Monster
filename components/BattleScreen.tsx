
import React from 'react';
import { BattleState, Character, Pet, Skill } from '../types';
import { Swords, Shield, Target, Footprints, Sparkles, Trophy, XCircle, Home } from 'lucide-react';

interface Props {
  battle: BattleState;
  player: Character;
  pet: Pet | null;
  currentMap: string;
  onAction: (actor: 'player' | 'pet', action: string, skill?: Skill) => void;
  onExit: () => void;
}

const BattleScreen: React.FC<Props> = ({ battle, player, pet, currentMap, onAction, onExit }) => {
  const enemy = battle.enemies[0];
  const isPlayerTurn = battle.phase === 'PLAYER_CHOICE';
  const isExecution = battle.phase === 'EXECUTION' || battle.phase === 'WAITING_FOR_OPPONENT';

  const fairy = player.equipment.fairy;

  const getFairyInfo = () => {
    if (!fairy) return '未裝備精靈';
    const chanceText = fairy.activationChance ? ` (成功率 ${fairy.activationChance}%)` : '';
    switch (fairy.effectType) {
      case 'ATK_BOOST': return `【攻擊提升】${chanceText}`;
      case 'DEF_BOOST': return `【防禦提升】${chanceText}`;
      case 'SPD_BOOST': return `【敏捷提升】${chanceText}`;
      case 'ABSORB': return `【吸收傷害】${chanceText}`;
      case 'REFLECT': return `【傷害反射】${chanceText}`;
      default: return `【精靈守護】${chanceText}`;
    }
  };

  // 在連線對戰時過濾捕捉與逃跑
  const playerActions = [
    { 
      name: '精靈', 
      icon: Sparkles, 
      color: fairy ? 'text-orange-400' : 'text-stone-600', 
      info: getFairyInfo(),
      bgColor: 'bg-orange-950/20'
    },
    ...(!battle.isPvP ? [
      { name: '捕捉', icon: Target, color: 'text-blue-400', info: '試圖捕捉野生怪獸', bgColor: 'bg-blue-950/20' },
      { name: '逃跑', icon: Footprints, color: 'text-red-400', info: '退出戰鬥', bgColor: 'bg-red-950/20' }
    ] : [])
  ];

  const petActions = [
    { name: '攻擊', icon: Swords, color: 'text-lime-400', info: '有機率施展技能', bgColor: 'bg-lime-950/20' },
    { name: '防禦', icon: Shield, color: 'text-stone-400', info: '減免傷害', bgColor: 'bg-stone-800/20' }
  ];

  if (battle.winnerId) {
    const isWin = battle.winnerId === 'player';
    return (
      <div className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
        <div className="w-full max-w-sm bg-stone-900 border-2 border-stone-800 p-10 rounded-[3rem] text-center shadow-2xl relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-1.5 ${isWin ? 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 'bg-red-600'}`}></div>
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-8 border-2 ${isWin ? 'bg-orange-500/10 border-orange-500 text-orange-500 animate-bounce' : 'bg-red-900/10 border-red-900 text-red-600'}`}>
            {isWin ? <Trophy size={48} /> : <XCircle size={48} />}
          </div>
          <h2 className="text-4xl font-black text-white mb-4 tracking-widest uppercase italic">
            {isWin ? 'VICTORY' : 'DEFEAT'}
          </h2>
          <p className="text-stone-500 text-sm font-black uppercase tracking-[0.3em] mb-10">
            {isWin ? '部落因你而榮耀' : '再接再厲，勇者'}
          </p>
          <button 
            onClick={onExit}
            className="w-full py-5 bg-stone-800 hover:bg-stone-700 text-white rounded-2xl font-black text-lg tracking-widest uppercase transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
          >
            <Home size={20} />
            返回大廳
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col bg-[#0f1115] overflow-hidden">
      {/* 戰鬥舞台區 */}
      <div className="flex-1 min-h-0 relative perspective-[1200px] overflow-hidden transition-all duration-700">
        
        {/* 地面背景與影子 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1c21] to-[#0f1115]"></div>
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-stone-900/30 skew-x-[-20deg] opacity-50 blur-xl"></div>
        
        {/* 敵人配置 */}
        {enemy && (
          <div className="absolute transition-all duration-700 transform scale-125" style={{ top: '45%', left: '15%' }}>
            <div className="relative flex flex-col items-center group">
              <div className="mt-5 absolute -top-20 flex flex-col items-center w-48">
                <div className="bg-black/80 px-4 py-1 rounded-full mb-2 border border-red-900/30 flex items-center gap-2 shadow-2xl">
                  <span className="text-[10px] md:text-xs font-black text-red-500 uppercase tracking-widest">{battle.isPvP ? '敵方' : '野生'}</span>
                  <span className="text-xs md:text-sm font-black text-white">{enemy.name} <span className="text-stone-500">Lv.{enemy.level}</span></span>
                </div>
                <div className="w-3/4 h-3 bg-stone-950 rounded-full border border-white/10 p-0.5 shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(220,38,38,0.6)]" 
                    style={{width: `${(enemy.hp/enemy.maxHp)*100}%`}}
                  ></div>
                </div>
              </div>
              <div className="absolute -bottom-6 w-32 h-10 bg-black/50 rounded-[100%] blur-md -z-10"></div>
              <img src={enemy.image} className="w-36 h-36 md:w-36 md:h-36 object-contain drop-shadow-2xl" alt="enemy" />
            </div>
          </div>
        )}

        {/* 寵物配置 */}
        {pet && (
          <div className="absolute transition-all duration-700 transform scale-125" style={{ top: '45%', left: '60%' }}>
            <div className="relative flex flex-col items-center group">
              <div className="mt-5 absolute -top-20 flex flex-col items-center w-48">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-black/80 px-4 py-1 rounded-full border border-lime-900/30 shadow-2xl">
                    <span className="text-xs md:text-sm font-black text-white">{pet.name} <span className="text-lime-500">Lv.{pet.level}</span></span>
                  </div>
                  {fairy && (
                    <div className="bg-orange-600/30 p-1.5 rounded-lg border border-orange-500/40 animate-pulse">
                      <Sparkles size={14} className="text-orange-500" />
                    </div>
                  )}
                </div>
                <div className="w-3/4 h-3 bg-stone-950 rounded-full border border-white/10 p-0.5 shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-lime-600 to-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(101,163,13,0.6)]" 
                    style={{width: `${(pet.hp/pet.maxHp)*100}%`}}
                  />
                </div>
              </div>
              <div className="absolute -bottom-8 w-40 h-12 bg-black/60 rounded-[100%] blur-xl -z-10"></div>
              <img src={pet.image} className="w-36 h-36 md:w-36 md:h-36 object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.6)]" alt="pet" />
            </div>
          </div>
        )}
      </div>

      {/* 指令面板區 */}
      <div className="flex-none bg-[#16181d] border-t border-white/10 p-6 md:p-8 relative z-50">
        <div className="max-w-2xl mx-auto">
          {isExecution ? (
            <div className="h-32 flex flex-col items-center justify-center gap-6">
                <div className="flex items-center gap-6">
                   <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping"></div>
                   <span className="text-sm md:text-base font-black text-stone-500 uppercase tracking-[0.5em]">
                     {battle.phase === 'WAITING_FOR_OPPONENT' ? '等待對手下達指令' : '回合進行中'}
                   </span>
                   <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping"></div>
                </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs md:text-sm font-black text-stone-500 uppercase tracking-widest">
                  {isPlayerTurn ? `冒險者指令` : `寵物指令`}
                </span>
                <span className="text-xs md:text-sm font-bold text-stone-700 tracking-widest uppercase">TURN {battle.turnCount}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {(isPlayerTurn ? playerActions : petActions).map(action => (
                  <button
                    key={action.name}
                    onClick={() => onAction(isPlayerTurn ? 'player' : 'pet', action.name, (action as any).skill)}
                    className={`group relative flex items-center gap-6 px-6 py-5 rounded-3xl ${action.bgColor} border border-white/10 hover:border-white/30 hover:bg-white/5 active:scale-95 transition-all text-left overflow-hidden shadow-2xl`}
                  >
                    <div className={`p-3 rounded-2xl bg-black/50 ${action.color} group-hover:scale-110 transition-transform shadow-lg`}>
                      <action.icon size={28} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-base md:text-lg text-white tracking-wide uppercase">{action.name}</span>
                      <span className="text-[11px] md:text-xs font-bold text-stone-500 uppercase tracking-widest mt-0.5">{action.info}</span>
                    </div>
                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BattleScreen;
