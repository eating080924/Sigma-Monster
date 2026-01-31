
import { Monster } from './types';
import { SKILL_DATABASE } from './data_skills';
import { IMAGE_ASSETS } from './data_images';

const getSkill = (id: string) => SKILL_DATABASE.find(s => s.id === id) || SKILL_DATABASE[0];

export const MONSTER_DATABASE: Monster[] = [
  { 
    id: 'm1', 
    name: '史萊姆', 
    level: 1, 
    hp: 50, 
    maxHp: 50, 
    atk: 8, 
    def: 5, 
    spd: 8, 
    image: IMAGE_ASSETS.MONSTERS.SLIME,
    captureRate: 0.4,
    skills: [getSkill('s-normal')],
    spawnMaps: ['薩姆吉爾村', '瑪麗娜絲漁村']
  },
  { 
    id: 'm2', 
    name: '烏力烏力', 
    level: 1, 
    hp: 60, 
    maxHp: 60, 
    atk: 7, 
    def: 12, 
    spd: 5, 
    image: IMAGE_ASSETS.MONSTERS.ULIULI,
    captureRate: 0.35,
    skills: [getSkill('s-normal')],
    spawnMaps: ['薩姆吉爾村', '加加村']
  },
  { 
    id: 'm3', 
    name: '威伯', 
    level: 3, 
    hp: 80, 
    maxHp: 80, 
    atk: 12, 
    def: 8, 
    spd: 15, 
    image: IMAGE_ASSETS.MONSTERS.WEIBER,
    captureRate: 0.2,
    skills: [getSkill('s-normal'), getSkill('s-bite')],
    spawnMaps: ['加加村', '阿布洞窟']
  },
  { 
    id: 'm4', 
    name: '奧卡洛斯', 
    level: 5, 
    hp: 150, 
    maxHp: 150, 
    atk: 25, 
    def: 20, 
    spd: 12, 
    image: IMAGE_ASSETS.MONSTERS.OKALOS,
    captureRate: 0.1,
    skills: [getSkill('s-normal'), getSkill('s-power-1'), getSkill('s-stomp')],
    spawnMaps: ['阿布洞窟', '漆黑的洞窟']
  }
];
