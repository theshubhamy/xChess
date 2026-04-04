export const GAME_MODES = {
  BULLET: 'Bullet',
  BLITZ: 'Blitz',
  RAPID: 'Rapid',
};

export const INITIAL_TIME = {
  [GAME_MODES.BULLET]: 60,
  [GAME_MODES.BLITZ]: 300,
  [GAME_MODES.RAPID]: 600,
};

export const INITIAL_ELO = 1200;

export const RANKS = {
  NOVICE: 'Novice',
  INTERMEDIATE: 'Intermediate',
  EXPERT: 'Expert',
  MASTER: 'Master',
  GRANDMASTER: 'Grandmaster',
};

export const RANK_THRESHOLDS = {
  GRANDMASTER: 2800,
  MASTER: 2400,
  EXPERT: 2000,
  INTERMEDIATE: 1600,
};

export const PROFILE_ICONS = [
  'Award', 'Trophy', 'Zap', 'Bot', 'Target', 'Star', 
  'Shield', 'Flame', 'Ghost', 'Sword', 'Crown', 'Lightbulb',
  'Cpu', 'Gamepad2', 'Music', 'Camera', 'Heart', 'Smile'
];
