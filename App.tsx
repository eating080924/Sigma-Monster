
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameView, GameState, BattleState, CombatLogEntry, Pet, Monster, Skill, Item } from './types.ts';
import { INITIAL_PLAYER, MAPS, MONSTER_TEMPLATES, SUB_BOSS_TEMPLATES, BOSS_TEMPLATES, INITIAL_ITEMS, PET_DATABASE, ALL_ITEMS } from './constants.ts';
import { Dog, Package, Compass, X, ChevronRight, ChevronLeft, Swords, Target } from 'lucide-react';
import { SKILL_DATABASE } from './data_skills.ts';

import CharacterCreation from './components/CharacterCreation.tsx';
import CharacterStatus from './components/CharacterStatus.tsx';
import BattleScreen from './components/BattleScreen.tsx';
import CharacterView from './components/CharacterView.tsx';
import PetsView from './components/PetsView.tsx';
import InventoryView from './components/InventoryView.tsx';
import CombatLog from './components/CombatLog.tsx';
import PvPLobby from './components/PvPLobby.tsx';

import { pvpService } from './services/pvpService.ts';
import { calculateTurn } from './logic/battleEngine.ts';
import { getSeededRandom, processLevelUp } from './utils/gameUtils.ts';

import { auth } from './firebase.ts';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

const SAVE_KEY = 'stone_age_origins_save_v4';

interface ExtendedGameState extends GameState {
  lastProcessedRoomId?: string | null;
}

const App: React.FC = () => {
  const [isOnline, setIsOnline] = useState(false);
  const processingTurnRef = useRef<number>(0);
  const pvpListenerUnsubscribe = useRef<(() => void) | null>(null);

  const [state, setState] = useState<ExtendedGameState>(() => {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        return { 
          pvpWins: 0, pvpLosses: 0, pvpPoints: 0, lastProcessedRoomId: null,
          ...parsed, view: GameView.EXPLORE, battle: null 
        };
      } catch (e) { console.error("Load fail", e); }
    }
    return {
      player: { ...INITIAL_PLAYER, id: 'p-' + Math.random().toString(36).substr(2, 9) },
      activePet: null, pets: [], 
      inventory: INITIAL_ITEMS.map(item => ({ ...item, id: `${item.id}-${Math.random().toString(36).substr(2, 9)}` })),
      view: GameView.EXPLORE, currentMap: MAPS[0].name, isAuto: false, battle: null,
      combatLogs: [{ id: Date.now().toString(), text: '冒險者，歡迎！', type: 'system' }],
      hasCreatedCharacter: false, mapBattleCounts: {}, pvpWins: 0, pvpLosses: 0, pvpPoints: 0, lastProcessedRoomId: null
    };
  });

  const addLog = (text: string, type: CombatLogEntry['type'] = 'info') => {
    setState(prev => ({
      ...prev,
      combatLogs: [...prev.combatLogs.slice(-49), { id: Date.now().toString(), text, type }]
    }));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) { setIsOnline(true); }
      else { signInAnonymously(auth).catch(err => console.error("Auth error", err)); }
    });
    return () => unsubscribe();
  }, []);

  // 優化持久化邏輯：僅在非戰鬥進行中或特定狀態變更時儲存，減少過度寫入
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    }, 500);
    return () => clearTimeout(saveTimeout);
  }, [state.player, state.pets, state.inventory, state.hasCreatedCharacter, state.currentMap, state.mapBattleCounts, state.pvpWins, state.pvpLosses]);

  const handleJoinPvPRoom = (roomId: string, isHost: boolean) => {
    // 清理舊的監聽器
    if (pvpListenerUnsubscribe.current) {
      pvpListenerUnsubscribe.current();
    }

    const unsubscribe = pvpService.listenToRoom(roomId, (data) => {
      if (!data) return;

      if (data.status === 'fighting') {
        setState(prev => {
          const currentTurn = data.turn || 1;
          const turnActions = data.actions?.[currentTurn];
          const bothReady = !!(turnActions?.host && turnActions?.guest);

          if (prev.view !== GameView.BATTLE || prev.battle?.roomId !== roomId) {
            const opponent = isHost ? data.guest : data.host;
            const enemyMonster: Monster = {
              id: (opponent?.id || 'opponent') + '-pet',
              name: (opponent?.pet?.name || '未知寵物') + " (對手)",
              level: 1, hp: opponent?.pet?.hp ?? 0, maxHp: opponent?.pet?.maxHp ?? 100,
              atk: opponent?.pet?.atk ?? 10, def: opponent?.pet?.def ?? 10, spd: opponent?.pet?.spd ?? 10,
              image: opponent?.pet?.image || '', captureRate: 0, skills: opponent?.pet?.skills || [SKILL_DATABASE[0]], spawnMaps: []
            };
            processingTurnRef.current = 0;
            return {
              ...prev, view: GameView.BATTLE,
              battle: {
                enemies: [enemyMonster], turnCount: currentTurn, phase: 'PLAYER_CHOICE',
                playerAction: null, petAction: null, countdown: 30, isPvP: true, roomId, isHost,
                opponentId: opponent?.id, opponentName: opponent?.name, opponentPet: opponent?.pet, opponentFairy: opponent?.fairy
              }
            };
          }

          if (prev.battle) {
            if (currentTurn > prev.battle.turnCount) {
              const myHp = isHost ? data.host.pet.hp : data.guest.pet.hp;
              const opHp = isHost ? data.guest.pet.hp : data.host.pet.hp;
              const updatedEnemies = [...prev.battle.enemies];
              if (updatedEnemies[0]) updatedEnemies[0].hp = opHp;
              return {
                ...prev,
                activePet: prev.activePet ? { ...prev.activePet, hp: myHp } : null,
                battle: { ...prev.battle, enemies: updatedEnemies, phase: 'PLAYER_CHOICE', turnCount: currentTurn, playerAction: null, petAction: null }
              };
            }
            if (bothReady && processingTurnRef.current < currentTurn) {
              return { ...prev, battle: { ...prev.battle, phase: 'EXECUTION' } };
            }
          }
          return prev;
        });
      } 
      
      if (data.status === 'finished') {
          setState(prev => {
              if (prev.battle?.winnerId || prev.lastProcessedRoomId === roomId) return prev;
              const isIWin = data.winnerId === prev.player.id;
              const restoredPet = prev.activePet ? { ...prev.activePet, hp: prev.activePet.maxHp } : null;
              return {
                  ...prev, 
                  pvpWins: isIWin ? prev.pvpWins + 1 : prev.pvpWins,
                  pvpLosses: !isIWin ? prev.pvpLosses + 1 : prev.pvpLosses,
                  activePet: restoredPet, 
                  lastProcessedRoomId: roomId,
                  battle: prev.battle ? { ...prev.battle, winnerId: isIWin ? 'player' : 'opponent', phase: 'EXECUTION' } : null
              };
          });
      }
    });
    pvpListenerUnsubscribe.current = unsubscribe;
    return unsubscribe;
  };

  const startBattle = useCallback(() => {
    if (!state.activePet || state.activePet.hp <= 0) { addLog("寵物體力不足，請先休息！", "damage"); return; }
    
    const currentWins = state.mapBattleCounts[state.currentMap] || 0;
    const cyclePos = currentWins % 10;
    let template: Monster;
    const filterSpawn = (list: Monster[]) => list.filter(m => m.spawnMaps.includes(state.currentMap));

    if (cyclePos === 4) {
      const subs = filterSpawn(SUB_BOSS_TEMPLATES);
      template = subs.length > 0 ? subs[Math.floor(Math.random() * subs.length)] : filterSpawn(MONSTER_TEMPLATES)[0];
      addLog(`警告：察覺到不尋常的動靜！遭遇強敵 【${template.name}】！`, 'system');
    } else if (cyclePos === 9) {
      const bosses = filterSpawn(BOSS_TEMPLATES);
      template = bosses.length > 0 ? bosses[Math.floor(Math.random() * bosses.length)] : filterSpawn(MONSTER_TEMPLATES)[0];
      addLog(`危險！領主級魔獸 【${template.name}】 出現了！`, 'damage');
    } else {
      const normals = filterSpawn(MONSTER_TEMPLATES);
      template = normals[Math.floor(Math.random() * normals.length)];
    }

    if (!template) { addLog("地圖環境太過平靜，沒有發現怪物。", "info"); return; }

    const enemies = [{ ...template, id: 'enemy-' + Math.random() }];
    setState(prev => ({ 
      ...prev, view: GameView.BATTLE, 
      battle: { enemies, turnCount: 1, phase: 'PLAYER_CHOICE', playerAction: null, petAction: null, countdown: 10, isPvP: false } 
    }));
  }, [state.currentMap, state.activePet, state.mapBattleCounts]);

  const handleAction = (actorType: 'player' | 'pet', action: string) => {
    setState(prev => {
      if (!prev.battle) return prev;
      const newB = { ...prev.battle };
      if (actorType === 'player') {
        newB.playerAction = action; newB.phase = 'PET_CHOICE';
      } else {
        newB.petAction = action;
        if (newB.isPvP) {
          newB.phase = 'WAITING_FOR_OPPONENT';
          pvpService.sendAction(newB.roomId!, newB.turnCount, newB.isHost ? 'host' : 'guest', { player: newB.playerAction!, pet: action });
        } else { newB.phase = 'EXECUTION'; }
      }
      return { ...prev, battle: newB };
    });
  };

  useEffect(() => {
    if (state.view === GameView.BATTLE && state.battle?.phase === 'EXECUTION' && !state.battle.winnerId) {
      const runTurn = async () => {
        // 使用 Ref 與最新的 state 回調來避免閉包過時
        let currentBattle: BattleState | null = null;
        setState(s => { currentBattle = s.battle; return s; });
        if (!currentBattle) return;

        const isPvP = currentBattle.isPvP;
        if (isPvP && processingTurnRef.current >= currentBattle.turnCount) return;
        if (isPvP) processingTurnRef.current = currentBattle.turnCount;
        
        let roomData: any = null;
        let allActions: any = null;
        if (isPvP) {
            const snap = await pvpService.listenToRoom(currentBattle.roomId!, (d) => roomData = d);
            // 由於 listenToRoom 是異步回調，這裡需等待數據就緒
            await new Promise(r => setTimeout(r, 200)); 
            allActions = roomData?.actions?.[currentBattle.turnCount];
            if (!roomData || !allActions?.host || !allActions?.guest) {
                processingTurnRef.current = currentBattle.turnCount - 1;
                return;
            }
        }

        let hostPet = isPvP ? { ...roomData.host.pet } : { ...state.activePet! };
        let guestPetOrEnemy = isPvP ? { ...roomData.guest.pet } : { ...currentBattle.enemies[0] };
        const rng = isPvP ? getSeededRandom(`${currentBattle.roomId}-${currentBattle.turnCount}`) : () => Math.random();

        const participants: any[] = [
            { side: 'host', type: 'player', spd: 999, id: 'host-p', name: isPvP ? roomData.host.name : state.player.name, action: isPvP ? allActions.host.player : currentBattle.playerAction },
            { side: 'guest', type: 'player', spd: 998, id: 'guest-p', name: isPvP ? roomData.guest.name : `野生`, action: isPvP ? allActions.guest.player : '攻擊' },
            { side: 'host', type: 'pet', spd: hostPet.spd || 1, id: 'host-pet', name: hostPet.name, action: isPvP ? allActions.host.pet : currentBattle.petAction },
            { side: 'guest', type: 'pet', spd: guestPetOrEnemy.spd || 1, id: 'guest-pet', name: guestPetOrEnemy.name, action: isPvP ? allActions.guest.pet : '攻擊' }
        ];

        const result = await calculateTurn(
            participants, hostPet, guestPetOrEnemy,
            isPvP ? roomData.host.fairy : state.player.equipment.fairy,
            state.player.id,
            isPvP ? roomData.guest.fairy : null,
            rng, addLog,
            (hHp, gHp, skill) => {
                setState(prev => ({
                    ...prev,
                    activePet: isPvP ? (currentBattle!.isHost ? { ...prev.activePet!, hp: hHp } : { ...prev.activePet!, hp: gHp }) : { ...prev.activePet!, hp: hHp },
                    battle: prev.battle ? { ...prev.battle, executingSkillName: skill, enemies: [{ ...prev.battle.enemies[0], hp: isPvP ? (currentBattle!.isHost ? gHp : hHp) : gHp }] } : null
                }));
            }
        );

        if (isPvP) {
          const winnerId = result.hostPet.hp <= 0 ? roomData.guest.id : (result.guestPetOrEnemy.hp <= 0 ? roomData.host.id : null);
          const updates: any = { 'host/pet/hp': result.hostPet.hp, 'guest/pet/hp': result.guestPetOrEnemy.hp };
          if (winnerId) { updates['status'] = 'finished'; updates['winnerId'] = winnerId; }
          else if (currentBattle.isHost) { updates['turn'] = currentBattle.turnCount + 1; }
          await pvpService.updateBattleState(currentBattle.roomId!, updates);
        }

        if (result.captured || result.escaped) {
          if (result.captured) {
            const monster = guestPetOrEnemy as Monster;
            const newPet: Pet = {
              id: 'captured-' + Date.now(),
              name: monster.name,
              species: monster.name,
              level: monster.level,
              exp: 0,
              hp: monster.hp,
              maxHp: monster.maxHp,
              atk: monster.atk,
              def: monster.def,
              spd: monster.spd,
              image: monster.image,
              skills: monster.skills,
              isActive: false
            };
            
            setState(p => {
              const alreadyHas = p.pets.some(pet => pet.species === newPet.species && pet.level === newPet.level);
              const updatedPets = alreadyHas ? p.pets : [...p.pets, newPet];
              return {
                ...p,
                pets: updatedPets,
                mapBattleCounts: { ...p.mapBattleCounts, [p.currentMap]: (p.mapBattleCounts[p.currentMap] || 0) + 1 }
              };
            });
            await new Promise(r => setTimeout(r, 1200));
          }
          setState(p => ({ ...p, view: GameView.EXPLORE, battle: null }));
          return;
        }

        const isWin = isPvP ? (currentBattle.isHost ? result.guestPetOrEnemy.hp <= 0 : result.hostPet.hp <= 0) : result.guestPetOrEnemy.hp <= 0;
        const isLoss = isPvP ? (currentBattle.isHost ? result.hostPet.hp <= 0 : result.guestPetOrEnemy.hp <= 0) : result.hostPet.hp <= 0;

        if (isWin || isLoss) {
          await new Promise(r => setTimeout(r, 700));
          if (!isPvP && isWin) {
            const monster = guestPetOrEnemy as Monster;
            const earnedExp = Math.floor(monster.level * 35);
            
            const droppedItems: Item[] = [];
            if (monster.drops && monster.drops.length > 0) {
              monster.drops.forEach(drop => {
                const roll = Math.random() * 100;
                if (roll <= drop.chance) {
                  const template = ALL_ITEMS.find(i => i.id === drop.itemId);
                  if (template) {
                    const newItem = { ...template, id: `${template.id}-${Math.random().toString(36).substr(2, 9)}` };
                    droppedItems.push(newItem);
                    addLog(`★ 獲得戰利品：【${template.name}】！`, 'system');
                  }
                }
              });
            }

            let updatedPet = { ...state.activePet!, hp: state.activePet!.maxHp, exp: state.activePet!.exp + earnedExp };
            const levelUpResult = processLevelUp(updatedPet);
            levelUpResult.logs.forEach(l => addLog(l, 'system'));
            
            setState(p => ({ 
              ...p, 
              view: GameView.EXPLORE, 
              battle: null, 
              activePet: levelUpResult.pet, 
              pets: p.pets.map(x => x.id === levelUpResult.pet.id ? levelUpResult.pet : x),
              inventory: [...p.inventory, ...droppedItems],
              mapBattleCounts: { ...p.mapBattleCounts, [p.currentMap]: (p.mapBattleCounts[p.currentMap] || 0) + 1 } 
            }));
          } else if (!isPvP && isLoss) {
            setState(p => ({ ...p, view: GameView.EXPLORE, battle: null, activePet: { ...p.activePet!, hp: p.activePet!.maxHp } }));
          }
        } else if (!isPvP) {
            setState(p => ({ ...p, battle: p.battle ? { ...p.battle, phase: 'PLAYER_CHOICE', turnCount: p.battle.turnCount + 1 } : null }));
        }
      };
      runTurn();
    }
  }, [state.battle?.phase, state.view]);

  const changeMap = (dir: 'next' | 'prev') => {
    const idx = MAPS.findIndex(m => m.name === state.currentMap);
    const nIdx = dir === 'next' ? (idx + 1) % MAPS.length : (idx - 1 + MAPS.length) % MAPS.length;
    setState(p => ({ ...p, currentMap: MAPS[nIdx].name }));
  };

  const currentWins = state.mapBattleCounts[state.currentMap] || 0;
  const cyclePos = currentWins % 10;
  const targetName = cyclePos < 4 ? "強敵" : "領主";
  const distance = cyclePos < 4 ? 4 - cyclePos : 9 - cyclePos;
  const currentMapData = MAPS.find(m => m.name === state.currentMap);

  if (!state.hasCreatedCharacter) return <CharacterCreation onComplete={(name, petId) => {
    const t = PET_DATABASE.find(p => p.id === petId)!;
    const pet = { ...t, id: 'pet-' + Date.now(), isActive: true, isStarter: true };
    setState(p => ({ ...p, player: { ...p.player, name }, activePet: pet, pets: [pet], hasCreatedCharacter: true }));
  }} />;

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#121212] text-[#d4d4d4] overflow-hidden">
      <div className="h-16 md:h-20 flex items-center justify-between px-6 bg-[#1a1a1a] border-b border-[#333] z-50 shadow-md flex-none">
        <CharacterStatus player={state.player} onClick={() => setState(p => ({ ...p, view: GameView.CHARACTER }))} disabled={!!state.battle && !state.battle.winnerId} />
        <div className="text-xs md:text-sm font-black text-stone-500 uppercase tracking-widest">Sigma Monster</div>
      </div>
      <div className="flex-1 relative flex flex-col min-h-0">
        <div className="flex-1 min-h-0 relative">
          {state.view === GameView.BATTLE && state.battle ? (
            <BattleScreen battle={state.battle} player={state.player} pet={state.activePet} currentMap={state.currentMap} onAction={handleAction} onExit={() => setState(p => ({ ...p, view: GameView.EXPLORE, battle: null }))} />
          ) : state.view === GameView.CHARACTER ? (
            <CharacterView player={state.player} onDeleteCharacter={() => { localStorage.removeItem(SAVE_KEY); window.location.reload(); }} />
          ) : state.view === GameView.PETS ? (
            <PetsView pets={state.pets} onSetActive={id => setState(p => ({ ...p, pets: p.pets.map(x => ({...x, isActive: x.id === id})), activePet: p.pets.find(x => x.id === id) || null }))} onDeletePet={id => setState(p => ({ ...p, pets: p.pets.filter(x => x.id !== id) }))} />
          ) : state.view === GameView.BAG ? (
            <InventoryView inventory={state.inventory} equipment={state.player.equipment} onEquipFairy={i => { setState(p => ({ ...p, player: { ...p.player, equipment: { ...p.player.equipment, fairy: i } } })); addLog(`裝備精靈：${i.name}`, 'info'); }} onUnequipFairy={() => setState(p => ({ ...p, player: { ...p.player, equipment: { ...p.player.equipment, fairy: null } } }))} onDeleteItem={id => setState(p => ({ ...p, inventory: p.inventory.filter(x => x.id !== id) }))} />
          ) : state.view === GameView.ARENA ? (
            <PvPLobby player={state.player} activePet={state.activePet} pvpWins={state.pvpWins} pvpLosses={state.pvpLosses} onJoinRoom={handleJoinPvPRoom} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-stone-900 to-[#121212]">
                {state.activePet && (
                    <div className="relative animate-in fade-in zoom-in duration-700 flex flex-col items-center mb-10">
                        <img src={state.activePet.image} className="w-48 h-48 md:w-64 md:h-64 object-contain mb-8 drop-shadow-0_20px_60px_rgba(234,88,12,0.4)" alt="Pet" />
                        <div className="bg-black/40 px-6 py-2 rounded-full border border-white/10 text-xs md:text-sm font-black uppercase text-orange-400 tracking-widest">{state.activePet.name} (Lv.{state.activePet.level})</div>
                    </div>
                )}
                <div className="w-full max-w-lg bg-[#1a1a1a]/90 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col items-center z-10">
                    <div className="flex flex-col items-center w-full mb-8">
                        <div className="flex items-center justify-between w-full mb-2">
                            <button onClick={() => changeMap('prev')} className="p-4 text-stone-500 hover:text-white transform hover:scale-110 active:scale-90 transition-transform"><ChevronLeft size={32}/></button>
                            <h3 key={state.currentMap} className="text-2xl md:text-3xl font-black text-white tracking-widest animate-in fade-in slide-in-from-bottom-1 duration-300">{state.currentMap}</h3>
                            <button onClick={() => changeMap('next')} className="p-4 text-stone-500 hover:text-white transform hover:scale-110 active:scale-90 transition-transform"><ChevronRight size={32}/></button>
                        </div>
                        {currentMapData && (
                            <p key={`desc-${state.currentMap}`} className="text-xs md:text-sm text-stone-500 italic font-medium text-center px-4 leading-relaxed animate-in fade-in duration-700">
                                {currentMapData.description}
                            </p>
                        )}
                    </div>
                    
                    <div className="w-full flex items-center justify-between px-6 py-3 bg-black/30 rounded-2xl border border-white/5 mb-6 text-[10px] md:text-xs font-black uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <span className="text-stone-500">地圖進度:</span>
                            <span className="text-white">{currentWins}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-stone-500">距離{targetName}:</span>
                            <span className={distance === 0 ? "text-red-500 animate-pulse font-black" : "text-orange-500"}>
                                {distance === 0 ? "⚠️ 出現中" : `${distance} 場`}
                            </span>
                        </div>
                    </div>

                    <button onClick={startBattle} className="w-full group bg-orange-600 text-white py-5 md:py-6 rounded-3xl font-black text-xl shadow-[0_10px_30px_rgba(234,88,12,0.3)] hover:shadow-[0_15px_40px_rgba(234,88,12,0.5)] hover:bg-orange-500 active:scale-95 transition-all flex items-center justify-center gap-4">
                      <Swords size={24} className="group-hover:rotate-12 transition-transform" />
                      <span>開 始 探 索</span>
                    </button>
                </div>
            </div>
          )}
        </div>
        <div className="absolute top-0 left-0 w-full h-32 pointer-events-none z-[70] bg-gradient-to-b from-black/90 via-black/40 to-transparent">
            <div className="pointer-events-auto h-full"><CombatLog logs={state.combatLogs} /></div>
        </div>
      </div>
      <div className="flex justify-around items-center h-20 bg-[#1a1a1a] border-t border-[#333] px-4 shadow-2xl flex-none">
        {[
          { id: GameView.EXPLORE, icon: Compass, label: '探索' },
          { id: GameView.PETS, icon: Dog, label: '寵物' },
          { id: GameView.BAG, icon: Package, label: '背包' },
          { id: GameView.ARENA, icon: Swords, label: '對戰' }
        ].map(item => (
          <button key={item.id} onClick={() => setState(p => ({ ...p, view: item.id as GameView }))} disabled={state.battle && !state.battle.winnerId} className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${state.view === item.id ? 'text-orange-500 font-black scale-110' : 'text-stone-500 opacity-60 hover:opacity-100'}`}>
            <item.icon size={28}/><span className="text-[11px] mt-2 font-bold uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
