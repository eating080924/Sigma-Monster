
import { Pet } from './types';
import { SKILL_DATABASE } from './data_skills';
import { IMAGE_ASSETS } from './data_images';

const getSkill = (id: string) => SKILL_DATABASE.find(s => s.id === id) || SKILL_DATABASE[0];

export const PET_DATABASE: Pet[] = [
  {
    id: 'pet-template-1',
    name: '暴躁史萊姆',
    species: '', // 副名稱
    level: 1,
    exp: 0,
    hp: 120,
    maxHp: 120,
    atk: 25,
    def: 15,
    spd: 10,
    image: IMAGE_ASSETS.PETS.STR_SLIME,
    skills: [getSkill('s-normal')],
    isActive: true
  },
  {
    id: 'pet-template-2',
    name: '堅毅史萊姆',
    species: '', // 副名稱
    level: 1,
    exp: 0,
    hp: 150,
    maxHp: 150,
    atk: 17,
    def: 25,
    spd: 8,
    image: IMAGE_ASSETS.PETS.DEF_SLIME,
    skills: [getSkill('s-normal')],
    isActive: false
  },
  {
    id: 'pet-template-3',
    name: '迅捷史萊姆',
    species: '', // 副名稱
    level: 1,
    exp: 0,
    hp: 100,
    maxHp: 100,
    atk: 13,
    def: 12,
    spd: 25,
    image: IMAGE_ASSETS.PETS.SPD_SLIME,
    skills: [getSkill('s-normal')],
    isActive: false
  }
];
