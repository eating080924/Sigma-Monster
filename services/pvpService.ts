
import { db } from '../firebase.ts';
import { ref, onValue, update, get, remove } from 'firebase/database';

/**
 * PvP 房間服務介面
 */
export const pvpService = {
  /**
   * 監聽房間狀態變更
   */
  listenToRoom: (roomId: string, callback: (data: any) => void) => {
    const roomRef = ref(db, `pvp_rooms/${roomId}`);
    return onValue(roomRef, (snapshot) => {
      callback(snapshot.val());
    });
  },

  /**
   * 發送戰鬥指令
   */
  sendAction: async (roomId: string, turn: number, side: 'host' | 'guest', action: { player: string, pet: string }) => {
    const actionRef = ref(db, `pvp_rooms/${roomId}/actions/${turn}/${side}`);
    await update(actionRef, action);
  },

  /**
   * 更新房間狀態 (生命值、回合、勝負)
   */
  updateBattleState: async (roomId: string, updates: any) => {
    const roomRef = ref(db);
    const dbUpdates: any = {};
    Object.keys(updates).forEach(key => {
      dbUpdates[`pvp_rooms/${roomId}/${key}`] = updates[key];
    });
    await update(roomRef, dbUpdates);
  },

  /**
   * 結束戰鬥並標記贏家
   */
  finishBattle: async (roomId: string, winnerId: string) => {
    await update(ref(db, `pvp_rooms/${roomId}`), {
      status: 'finished',
      winnerId: winnerId
    });
  }
};
