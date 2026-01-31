
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { ref, onValue, set, push, update, onDisconnect, get, remove } from 'firebase/database';
import { Character, Pet } from '../types';
import { Swords, Plus, Users, Loader2, Timer, AlertCircle, Trophy, XCircle } from 'lucide-react';

interface Props {
  player: Character;
  activePet: Pet | null;
  pvpWins: number;
  pvpLosses: number;
  onJoinRoom: (roomId: string, isHost: boolean) => void;
}

const PvPLobby: React.FC<Props> = ({ player, activePet, pvpWins, pvpLosses, onJoinRoom }) => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [myWaitingRoomId, setMyWaitingRoomId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const isCancellingRef = useRef(false);

  // 監聽房間列表
  useEffect(() => {
    const roomsRef = ref(db, 'pvp_rooms');
    const unsubscribe = onValue(roomsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const roomList = Object.entries(data)
          .map(([id, value]: [string, any]) => ({ id, ...value }))
          .filter(room => room.status === 'waiting');
        setRooms(roomList);

        // 檢查自己的房間狀態
        const myRoom = roomList.find(r => r.host.id === player.id);
        if (!myRoom && myWaitingRoomId) {
          setMyWaitingRoomId(null);
          setCountdown(0);
        }
      } else {
        setRooms([]);
        setMyWaitingRoomId(null);
        setCountdown(0);
      }
    });
    return () => unsubscribe();
  }, [player.id, myWaitingRoomId]);

  // 取消房間函式
  const cancelMyRoom = async (targetRoomId: string) => {
    if (!targetRoomId || isCancellingRef.current) return;
    isCancellingRef.current = true;
    
    try {
      const roomRef = ref(db, `pvp_rooms/${targetRoomId}`);
      const snapshot = await get(roomRef);
      if (snapshot.exists() && snapshot.val().status === 'waiting') {
        await remove(roomRef);
      }
    } catch (error) {
      console.error("Cancel room failed:", error);
    } finally {
      setMyWaitingRoomId(null);
      setCountdown(0);
      isCancellingRef.current = false;
    }
  };

  useEffect(() => {
    let timerId: any;
    if (myWaitingRoomId && countdown > 0) {
      timerId = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (myWaitingRoomId && countdown === 0) {
      cancelMyRoom(myWaitingRoomId);
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [countdown, myWaitingRoomId]);

  const createRoom = async () => {
    if (!activePet || isLoading || myWaitingRoomId) return;
    const existingRoom = rooms.find(r => r.host.id === player.id);
    if (existingRoom) {
      setMyWaitingRoomId(existingRoom.id);
      setCountdown(10);
      onJoinRoom(existingRoom.id, true);
      return;
    }

    setIsLoading(true);
    try {
      const roomsRef = ref(db, 'pvp_rooms');
      const newRoomRef = push(roomsRef);
      const roomId = newRoomRef.key!;
      const roomData = {
        status: 'waiting',
        createdAt: Date.now(),
        host: {
          id: player.id,
          name: player.name,
          fairy: player.equipment.fairy,
          pet: {
            name: activePet.name,
            hp: activePet.maxHp,
            maxHp: activePet.maxHp,
            atk: activePet.atk,
            def: activePet.def,
            spd: activePet.spd,
            image: activePet.image,
            skills: activePet.skills // 補全技能數據
          }
        },
        turn: 1
      };
      await set(newRoomRef, roomData);
      onDisconnect(newRoomRef).remove();
      setMyWaitingRoomId(roomId);
      setCountdown(10);
      onJoinRoom(roomId, true);
    } catch (error) {
      console.error("Create room failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const joinRoom = async (room: any) => {
    if (!activePet || room.host.id === player.id || isLoading) return;
    setIsLoading(true);
    try {
      const roomRef = ref(db, `pvp_rooms/${room.id}`);
      await update(roomRef, {
        status: 'fighting',
        guest: {
          id: player.id,
          name: player.name,
          fairy: player.equipment.fairy,
          pet: {
            name: activePet.name,
            hp: activePet.maxHp,
            maxHp: activePet.maxHp,
            atk: activePet.atk,
            def: activePet.def,
            spd: activePet.spd,
            image: activePet.image,
            skills: activePet.skills // 補全技能數據
          }
        }
      });
      onJoinRoom(room.id, false);
    } catch (error) {
      console.error("Join room failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#121212] p-6 animate-in fade-in duration-500 overflow-y-auto">
      <div className="max-w-md mx-auto w-full flex flex-col h-full">
        
        {/* Stats Panel */}
        <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-stone-900/50 border border-lime-500/20 rounded-2xl p-4 flex flex-col items-center justify-center shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                    <Trophy size={16} className="text-lime-500" />
                    <span className="text-[10px] font-black text-lime-500 uppercase tracking-widest">勝場次數</span>
                </div>
                <div className="text-2xl font-black text-white">{pvpWins}</div>
            </div>
            <div className="bg-stone-900/50 border border-rose-500/20 rounded-2xl p-4 flex flex-col items-center justify-center shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                    <XCircle size={16} className="text-rose-500" />
                    <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">敗場次數</span>
                </div>
                <div className="text-2xl font-black text-white">{pvpLosses}</div>
            </div>
        </div>

        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mb-4 border border-orange-500/20">
            <Swords size={32} className="text-orange-500" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-widest uppercase">對戰大廳</h2>
          <p className="text-[10px] text-stone-500 font-bold uppercase tracking-tighter mb-6">找到對手，證明你的部落最強</p>
          
          {myWaitingRoomId ? (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="flex flex-col items-center gap-2 bg-stone-900 px-8 py-5 rounded-[2rem] border border-orange-500/50 shadow-[0_0_30px_rgba(234,88,12,0.15)] w-full">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Timer size={20} className="text-orange-500 animate-spin-slow" />
                    <div className="absolute inset-0 bg-orange-500 blur-md opacity-20"></div>
                  </div>
                  <span className="text-white font-black text-sm uppercase tracking-widest">挑戰發布中... {countdown}秒</span>
                </div>
              </div>
              <button 
                onClick={() => myWaitingRoomId && cancelMyRoom(myWaitingRoomId)}
                className="text-[10px] text-stone-500 hover:text-red-500 font-black uppercase tracking-widest transition-colors flex items-center gap-1.5"
              >
                手動撤回挑戰
              </button>
            </div>
          ) : (
            <button 
              onClick={createRoom}
              disabled={isLoading || !activePet}
              className="flex items-center gap-3 bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_8px_30px_rgba(234,88,12,0.4)] active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
              發布挑戰房間
            </button>
          )}
        </div>

        {!activePet && !myWaitingRoomId && (
          <div className="bg-red-900/10 border border-red-900/20 p-4 rounded-2xl mb-8 text-red-400 text-[10px] font-black text-center uppercase tracking-widest flex items-center justify-center gap-2">
            <AlertCircle size={14} />
            請先在「寵物」頁面設置出戰夥伴
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-6 opacity-40">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-stone-700"></div>
            <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">等待中的挑戰 ({rooms.length})</span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-stone-700"></div>
          </div>

          <div className="grid grid-cols-1 gap-4 pb-12">
            {rooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-stone-900/10 rounded-[2.5rem] border-2 border-dashed border-stone-800/30">
                <Users size={48} className="text-stone-800 mb-4 opacity-50" />
                <span className="text-stone-700 text-[10px] font-black uppercase tracking-[0.2em]">目前沒有挑戰者</span>
              </div>
            ) : (
              rooms.map(room => (
                <div key={room.id} className={`bg-[#1a1a1a] border ${room.host.id === player.id ? 'border-orange-500/30 bg-orange-500/5' : 'border-stone-800'} p-5 rounded-2xl flex items-center justify-between group transition-all duration-300 shadow-xl`}>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-stone-800/80 rounded-xl p-2 border border-stone-700 shadow-inner overflow-hidden flex items-center justify-center">
                      <img src={room.host.pet.image} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" alt="Pet" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-white font-black text-sm tracking-tight">{room.host.name}</span>
                        {room.host.id === player.id && (
                          <span className="text-[8px] bg-orange-500/20 text-orange-500 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">我</span>
                        )}
                      </div>
                      <div className="text-[10px] text-orange-500 font-bold uppercase tracking-tighter">{room.host.pet.name}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => joinRoom(room)}
                    disabled={isLoading || myWaitingRoomId === room.id || room.host.id === player.id}
                    className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-90 border shadow-lg disabled:opacity-30 ${
                      room.host.id === player.id 
                      ? 'bg-transparent border-stone-700 text-stone-600 cursor-default' 
                      : 'bg-stone-800 hover:bg-white text-white hover:text-black border-stone-700 hover:border-white'
                    }`}
                  >
                    {room.host.id === player.id ? '等待中' : '接受挑戰'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <style>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PvPLobby;
