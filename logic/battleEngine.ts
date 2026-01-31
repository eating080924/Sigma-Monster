
import { SKILL_DATABASE } from '../data_skills.ts';
import { Pet, Monster, Skill, Item } from '../types.ts';

interface Participant {
  side: 'host' | 'guest';
  type: 'player' | 'pet';
  id: string;
  name: string;
  spd: number;
  action: string;
}

/**
 * 戰鬥回合演算引擎
 */
export const calculateTurn = async (
  participants: Participant[],
  hostPet: any,
  guestPetOrEnemy: any,
  hostFairy: Item | null,
  hostPlayerId: string, // 新增，用於識別是否為玩家本人行動
  guestFairy: Item | null,
  rng: () => number,
  onLog: (text: string, type?: any) => void,
  onUpdateVisual: (hostHp: number, guestHp: number, skillName?: string) => void
) => {
  let hostAtkM = 1, hostDefM = 1, hostAbs = false, hostRef = false;
  let guestAtkM = 1, guestDefM = 1, guestAbs = false, guestRef = false;

  // 排序行動順序
  const sortedParticipants = [...participants].sort((a, b) => b.spd - a.spd || a.id.localeCompare(b.id));

  for (const actor of sortedParticipants) {
    if (hostPet.hp <= 0 || guestPetOrEnemy.hp <= 0) break;
    await new Promise(r => setTimeout(r, 450));

    if (actor.type === 'player') {
      const sideFairy = actor.side === 'host' ? hostFairy : guestFairy;
      
      if (actor.action === '精靈' && sideFairy) {
        if (rng() * 100 <= (sideFairy.activationChance || 100)) {
          onLog(`${actor.name} 喚醒了 [${sideFairy.name}]！`, actor.side === 'host' ? 'pvp_me' : 'pvp_op');
          const m = 1.5;
          if (actor.side === 'host') {
            switch(sideFairy.effectType) { 
                case 'ATK_BOOST': hostAtkM=m; break; 
                case 'DEF_BOOST': hostDefM=m; break; 
                case 'ABSORB': hostAbs=true; break; 
                case 'REFLECT': hostRef=true; break; 
            }
          } else {
            switch(sideFairy.effectType) { 
                case 'ATK_BOOST': guestAtkM=m; break; 
                case 'DEF_BOOST': guestDefM=m; break; 
                case 'ABSORB': guestAbs=true; break; 
                case 'REFLECT': guestRef=true; break; 
            }
          }
        } else {
          onLog(`${actor.name} 試圖喚醒精靈，但失敗了...`, 'info');
        }
      } else if (actor.action === '捕捉') {
        onLog(`${actor.name} 嘗試捕捉...`, 'info');
        // 捕捉機率：基礎值 * (2 - 目前血量比例)，血量越低機率越高
        const healthBonus = 1 + (1 - guestPetOrEnemy.hp / guestPetOrEnemy.maxHp);
        const chance = (guestPetOrEnemy.captureRate || 0.1) * healthBonus * 100;
        
        if (rng() * 100 <= chance) {
          onLog(`★ 成功捕捉了 【${guestPetOrEnemy.name}】！正在返回探索...`, 'system');
          return { hostPet, guestPetOrEnemy, captured: true };
        } else {
          onLog(`捕捉失敗！${guestPetOrEnemy.name} 掙脫了！`, 'damage');
        }
      } else if (actor.action === '逃跑') {
        onLog(`${actor.name} 拔腿就跑！`, 'info');
        if (rng() < 0.7) { // 70% 逃跑成功率
          onLog(`逃跑成功！順利脫離戰鬥。`, 'system');
          return { hostPet, guestPetOrEnemy, escaped: true };
        } else {
          onLog(`逃跑失敗...`, 'damage');
        }
      }
    } else {
      // 寵物行動
      const isHostActor = actor.side === 'host';
      const attacker = isHostActor ? hostPet : guestPetOrEnemy;
      const defender = isHostActor ? guestPetOrEnemy : hostPet;
      const aAtkM = isHostActor ? hostAtkM : guestAtkM;
      const dDefM = isHostActor ? guestDefM : hostDefM;
      const dRef = isHostActor ? guestRef : hostRef;
      const dAbs = isHostActor ? guestAbs : hostAbs;

      if (actor.action === '防禦') {
        if (isHostActor) hostDefM *= 2; else guestDefM *= 2;
        onLog(`${actor.name} 進入防禦狀態。`, 'info');
      } else {
        const skills = attacker.skills && attacker.skills.length > 0 ? attacker.skills : [SKILL_DATABASE[0]];
        const skill = skills[Math.floor(rng() * skills.length)];
        
        onUpdateVisual(hostPet.hp, guestPetOrEnemy.hp, skill.name);
        await new Promise(r => setTimeout(r, 550));
        
        const baseDmg = Math.floor(attacker.atk * skill.power * aAtkM * (0.9 + rng() * 0.2));
        
        if (dRef) {
          onLog(`【反射】傷害反彈！${actor.name} 反受 ${baseDmg} 傷害`, 'damage');
          attacker.hp = Math.max(0, attacker.hp - baseDmg);
        } else if (dAbs) {
          onLog(`【吸收】${defender.name} 吸收能量恢復 ${baseDmg} HP`, 'info');
          defender.hp = Math.min(defender.maxHp, defender.hp + baseDmg);
        } else {
          const finalDmg = Math.max(1, baseDmg - (defender.def * dDefM / 2));
          defender.hp = Math.max(0, defender.hp - finalDmg);
          onLog(`${actor.name} 使用 【${skill.name}】，造成 ${Math.floor(finalDmg)} 傷害`, actor.side === 'host' ? 'pvp_me' : 'pvp_op');
        }
      }
    }
    onUpdateVisual(hostPet.hp, guestPetOrEnemy.hp);
  }

  return { hostPet, guestPetOrEnemy };
};
