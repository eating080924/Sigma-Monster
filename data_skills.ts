import { Skill } from './types';

export const SKILL_DATABASE: Skill[] = [
  {
    id: 's-normal',
    name: '攻擊',
    description: '最基本的物理打擊。',
    power: 1.0,
    accuracy: 98, // 高命中
    type: 'damage'
  },
  {
    id: 's-power-1',
    name: '猛力攻擊',
    description: '集中全身力氣的重擊，命中率略低。',
    power: 1.5,
    accuracy: 80,
    type: 'damage'
  },
  {
    id: 's-speed-1',
    name: '三連擊',
    description: '快速的連續打擊，雖然威力驚人但容易失誤。',
    power: 1.8,
    accuracy: 75,
    type: 'damage'
  },
  {
    id: 's-def-1',
    name: '背水一戰',
    description: '犧牲穩定性換取極大破壞力。',
    power: 2.2,
    accuracy: 70,
    type: 'damage'
  },
  {
    id: 's-bite',
    name: '撕咬',
    description: '用利齒撕裂敵人，具有不錯的穩定性。',
    power: 1.3,
    accuracy: 90,
    type: 'damage'
  },
  {
    id: 's-stomp',
    name: '重踏',
    description: '巨大的身軀向下踩踏，造成震撼傷害。',
    power: 1.6,
    accuracy: 85,
    type: 'damage'
  }
];