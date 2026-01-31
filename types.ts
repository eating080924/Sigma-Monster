
export enum GameView {
  EXPLORE = 'EXPLORE',
  BATTLE = 'BATTLE',
  CHARACTER = 'CHARACTER',
  PETS = 'PETS',
  BAG = 'BAG',
  ARENA = 'ARENA'
}

export type JobType = '無職者' | '礦工' | '鐵匠' | '石匠';

export interface Stats {
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  spd: number;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  power: number; 
  accuracy: number; 
  type: 'damage' | 'heal' | 'buff';
}

export type FairyEffectType = 'ATK_BOOST' | 'DEF_BOOST' | 'SPD_BOOST' | 'ABSORB' | 'REFLECT';

export interface Item {
  id: string;
  name: string;
  type: 'consumable' | 'fairy';
  description: string;
  effectType?: FairyEffectType;
  effectValue?: number;
  activationChance?: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic';
}

export interface Character {
  id: string;
  name: string;
  equipment: {
    fairy: Item | null;
  };
}

export interface Pet extends Stats {
  id: string;
  name: string;
  level: number;
  exp: number;
  species: string;
  image: string;
  skills: Skill[];
  isActive?: boolean;
  isStarter?: boolean;
}

export interface Monster extends Stats {
  id: string;
  name: string;
  level: number;
  image: string;
  captureRate: number; 
  skills: Skill[];
  spawnMaps: string[]; 
  drops?: { itemId: string, chance: number }[];
}

export interface CombatLogEntry {
  id: string;
  text: string;
  type: 'damage' | 'heal' | 'system' | 'info' | 'pvp_me' | 'pvp_op';
}

export interface MapData {
  id: string;
  name: string;
  type: 'town' | 'explore' | 'dungeon';
  description: string;
  minLevel: number;
}

export interface GameState {
  player: Character;
  activePet: Pet | null;
  pets: Pet[];
  inventory: Item[];
  view: GameView;
  currentMap: string;
  isAuto: boolean;
  battle: BattleState | null;
  combatLogs: CombatLogEntry[];
  hasCreatedCharacter: boolean;
  mapBattleCounts: Record<string, number>;
  pvpWins: number;
  pvpLosses: number;
  pvpPoints: number; // 保留欄位但不再用於邏輯
}

export interface BattleState {
  enemies: Monster[]; 
  turnCount: number;
  phase: 'PLAYER_CHOICE' | 'PET_CHOICE' | 'WAITING_FOR_OPPONENT' | 'EXECUTION';
  playerAction: string | null;
  petAction: string | null;
  petSkill?: Skill | null;
  executingSkillName?: string;
  countdown: number;
  isPvP: boolean;
  roomId?: string;
  isHost?: boolean;
  opponentId?: string;
  opponentName?: string;
  opponentPet?: Partial<Pet> | null;
  opponentFairy?: Item | null;
  winnerId?: string; // 'player' | 'opponent'
}
