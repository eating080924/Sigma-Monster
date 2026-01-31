
import { Monster } from './types';
import { SKILL_DATABASE } from './data_skills';
import { IMAGE_ASSETS } from './data_images';

const getSkill = (id: string) => SKILL_DATABASE.find(s => s.id === id) || SKILL_DATABASE[0];

export const SUB_BOSS_DATABASE: Monster[] = [
  { 
    id: 'sb-1', 
    name: '首領凱比特', 
    level: 3, 
    hp: 120, 
    maxHp: 120, 
    atk: 18, 
    def: 10, 
    spd: 12, 
    image: IMAGE_ASSETS.BOSSES.SUB_KEBITE,
    captureRate: 0.1,
    skills: [getSkill('s-normal'), getSkill('s-power-1')],
    spawnMaps: ['薩姆吉爾村', '瑪麗娜絲漁村'],
    drops: [{ itemId: 'f-reflect-1', chance: 100.0 }]
  },
  { 
    id: 'sb-2', 
    name: '憤怒的烏力', 
    level: 4, 
    hp: 150, 
    maxHp: 150, 
    atk: 15, 
    def: 25, 
    spd: 8, 
    image: IMAGE_ASSETS.BOSSES.ANGRY_ULI,
    captureRate: 0.05,
    skills: [getSkill('s-normal'), getSkill('s-stomp')],
    spawnMaps: ['薩姆吉爾村', '加加村'],
    drops: [{ itemId: 'f-absorb-1', chance: 100.0 }]
  },
  { 
    id: 'sb-3', 
    name: '巨型威伯', 
    level: 6, 
    hp: 200, 
    maxHp: 200, 
    atk: 28, 
    def: 18, 
    spd: 25, 
    image: IMAGE_ASSETS.BOSSES.GIANT_WEIBER,
    captureRate: 0.02,
    skills: [getSkill('s-normal'), getSkill('s-speed-1'), getSkill('s-bite')],
    spawnMaps: ['加加村', '阿布洞窟'],
    drops: [{ itemId: 'f-wind-1', chance: 0.25 }]
  }
];
