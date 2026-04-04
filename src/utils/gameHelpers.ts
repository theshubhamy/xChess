import { RANK_THRESHOLDS, RANKS } from '../constants/gameData';

export const calculateRank = (elo: number): string => {
  if (elo >= RANK_THRESHOLDS.GRANDMASTER) return RANKS.GRANDMASTER;
  if (elo >= RANK_THRESHOLDS.MASTER) return RANKS.MASTER;
  if (elo >= RANK_THRESHOLDS.EXPERT) return RANKS.EXPERT;
  if (elo >= RANK_THRESHOLDS.INTERMEDIATE) return RANKS.INTERMEDIATE;
  return RANKS.NOVICE;
};

export const getPieceColor = (isMe: boolean, myColor: 'w' | 'b'): 'w' | 'b' => {
  if (isMe) return myColor;
  return myColor === 'w' ? 'b' : 'w';
};
