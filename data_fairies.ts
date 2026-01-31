import { Item } from './types';

export const FAIRY_DATABASE: Item[] = [
  { 
    id: 'f-atk-1', 
    name: '強攻精靈I', 
    type: 'fairy', 
    description: '暴烈精靈，能在戰鬥中提升寵物的攻擊力 5 %。', 
    effectType: 'ATK_BOOST',
    effectValue: 5,
    activationChance: 70, // 70% 成功率
    rarity: 'common' 
  },
  { 
    id: 'f-def-1', 
    name: '強防精靈I', 
    type: 'fairy', 
    description: '堅毅精靈，能在戰鬥中提升寵物的防禦 5 %。', 
    effectType: 'DEF_BOOST',
    effectValue: 5,
    activationChance: 70, 
    rarity: 'common' 
  },
  { 
    id: 'f-spd-1', 
    name: '速攻精靈I', 
    type: 'fairy', 
    description: '疾速精靈，能在戰鬥中提升寵物的速度 5 %。', 
    effectType: 'SPD_BOOST',
    effectValue: 5,
    activationChance: 70,
    rarity: 'common' 
  },
  { 
    id: 'f-absorb-1', 
    name: '吸收精靈Σ', 
    type: 'fairy', 
    description: '古老神祕的精靈，能將敵人的攻擊能量轉化為生命力。', 
    effectType: 'ABSORB',
    effectValue: 100,
    activationChance: 20, // 強力效果機率較低
    rarity: 'common' 
  },
  {
    id: 'f-reflect-1', 
    name: '鏡面精靈Σ', 
    type: 'fairy', 
    description: '神聖的奇蹟精靈，能架起鏡面護罩將傷害反彈。', 
    effectType: 'REFLECT',
    effectValue: 100,
    activationChance: 20, // 強力效果機率較低
    rarity: 'common' 
  }
];