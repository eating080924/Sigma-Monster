
import { Pet } from '../types.ts';

/**
 * 確定性隨機數生成器 (用於同步連線對戰的隨機結果)
 */
export const getSeededRandom = (seed: string) => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  return () => {
    h = (Math.imul(h ^ (h >>> 16), 0x85ebca6b)) | 0;
    h = (Math.imul(h ^ (h >>> 13), 0xc2b2ae35)) | 0;
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
};

/**
 * 處理寵物升級邏輯
 */
export const processLevelUp = (pet: Pet): { pet: Pet, logs: string[] } => {
  let currentPet = { ...pet };
  const logs: string[] = [];
  const LEVEL_CAP = 20;

  while (currentPet.level < LEVEL_CAP && currentPet.exp >= currentPet.level * 100) {
    currentPet.exp -= currentPet.level * 100;
    currentPet.level += 1;
    
    // 隨機能力提升
    const hpGain = Math.floor(Math.random() * 11) + 10; 
    const atkGain = Math.floor(Math.random() * 4) + 2;   
    const defGain = Math.floor(Math.random() * 3) + 2;   
    const spdGain = Math.floor(Math.random() * 3) + 1;   

    currentPet.maxHp += hpGain;
    currentPet.atk += atkGain;
    currentPet.def += defGain;
    currentPet.spd += spdGain;
    currentPet.hp = currentPet.maxHp; 

    logs.push(`★ 恭喜！${currentPet.name} 升到了 Lv.${currentPet.level}！`);
    logs.push(`能力提升：HP+${hpGain}, ATK+${atkGain}, DEF+${defGain}, SPD+${spdGain}`);
  }

  if (currentPet.level >= LEVEL_CAP) {
    currentPet.exp = 0; 
  }

  return { pet: currentPet, logs };
};
