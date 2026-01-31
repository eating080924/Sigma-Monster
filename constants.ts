
import { Character, Pet, Monster, Item, MapData } from './types';
import { PET_DATABASE } from './data_pets';
import { FAIRY_DATABASE } from './data_fairies';
import { MONSTER_DATABASE } from './data_monsters';
import { SUB_BOSS_DATABASE } from './data_sub_boss_monsters';
import { BOSS_DATABASE } from './data_boss_monsters';
import { MAP_DATABASE } from './data_maps';

// 所有可獲得道具現在僅包含精靈
export const ALL_ITEMS: Item[] = [
  ...FAIRY_DATABASE
];

export const INITIAL_ITEMS: Item[] = [
  FAIRY_DATABASE[0], // 初始給予一個基礎精靈
];

export const INITIAL_PLAYER: Character = {
  id: 'player-1',
  name: '冒險者',
  equipment: {
    // Fix: Changed empty string '' to null to match the Character interface (Item | null)
    fairy: null //FAIRY_DATABASE[0] // 初始裝備雅恩斯精靈
  }
};

export const INITIAL_PET: Pet = PET_DATABASE[0];

// Export PET_DATABASE to fix error in App.tsx
export { PET_DATABASE };

export const MONSTER_TEMPLATES = MONSTER_DATABASE;
export const SUB_BOSS_TEMPLATES = SUB_BOSS_DATABASE;
export const BOSS_TEMPLATES = BOSS_DATABASE;

export const MAPS = MAP_DATABASE;
