
import { Monster } from './types';
import { SKILL_DATABASE } from './data_skills';
import { IMAGE_ASSETS } from './data_images';

const getSkill = (id: string) => SKILL_DATABASE.find(s => s.id === id) || SKILL_DATABASE[0];

export const BOSS_DATABASE: Monster[] = [
  { 
    id: 'b-1', 
    name: '阿布守護神', 
    level: 10, 
    hp: 500, 
    maxHp: 500, 
    atk: 45, 
    def: 35, 
    spd: 20, 
    image: IMAGE_ASSETS.BOSSES.GUARDIAN,
    captureRate: 0, // 不可捕捉
    skills: [getSkill('s-normal'), getSkill('s-power-1'), getSkill('s-stomp'), getSkill('s-def-1')],
    spawnMaps: ['阿布洞窟'],
    drops: [{ itemId: 'f-earth-1', chance: 0.4 }]
  },
  { 
    id: 'b-2', 
    name: '漆黑機械龍', 
    level: 15, 
    hp: 1200, 
    maxHp: 1200, 
    atk: 75, 
    def: 60, 
    spd: 40, 
    image: IMAGE_ASSETS.BOSSES.MECHA_DRAGON,
    captureRate: 0,
    skills: [getSkill('s-normal'), getSkill('s-speed-1'), getSkill('s-bite'), getSkill('s-def-1')],
    spawnMaps: ['漆黑的洞窟'],
    drops: [{ itemId: 'f-light-1', chance: 0.15 }]
  }
];
