
/**
 * 圖片資產資料庫 (本地版)
 * 所有路徑皆指向本地 ./images/ 目錄，以支援 PWA 離線模式。
 */

export const IMAGE_ASSETS = {
  // 玩家角色與 UI - ./images/ui/
  UI: {
    AVATAR_HERO: './images/ui/hero_avatar.png',
    MAP_BG_DEFAULT: './images/ui/map_bg.jpg',
    EMPTY_SLOT: './images/ui/empty_slot.png',
  },

  // 寵物圖片 - ./images/pets/
  PETS: {
    STR_SLIME: './images/pets/str_slime.png',     // 暴躁史萊姆
    DEF_SLIME: './images/pets/def_slime.png', // 堅毅史萊姆
    SPD_SLIME: './images/pets/spd_slime.png',   // 迅捷史萊姆
  },

  // 野外怪獸 - ./images/monsters/
  MONSTERS: {
    SLIME: './images/monsters/kebite.png',
    ULIULI: './images/monsters/uliuli.png',
    WEIBER: './images/monsters/weiber.png',
    OKALOS: './images/monsters/okalos.png',
  },

  // 強敵與 BOSS - ./images/bosses/
  BOSSES: {
    SUB_KEBITE: './images/bosses/sub_kebite.png',
    ANGRY_ULI: './images/bosses/angry_uli.png',
    GIANT_WEIBER: './images/bosses/giant_weiber.png',
    GUARDIAN: './images/bosses/guardian.png',
    MECHA_DRAGON: './images/bosses/mecha_dragon.png',
  },

  // 精靈與道具 - ./images/items/
  ITEMS: {
    FAIRY_BASE: './images/items/fairy_base.png',
    FAIRY_ATK: './images/items/fairy_atk.png',
    FAIRY_DEF: './images/items/fairy_def.png',
    FAIRY_SPD: './images/items/fairy_spd.png',
    FAIRY_SPECIAL: './images/items/fairy_special.png',
  }
};
