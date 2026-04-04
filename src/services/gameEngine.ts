import { Chess } from 'chess.js';

export class GameEngine {
  private game: Chess;

  constructor(fen?: string) {
    this.game = new Chess(fen);
  }

  getBoard() {
    return this.game.board();
  }

  load(fen: string) {
    this.game.load(fen);
  }

  getMoves() {
    return this.game.moves({ verbose: true });
  }

  makeMove(move: string | { from: string; to: string; promotion?: string }) {
    try {
      const result = this.game.move(move);
      return { success: !!result, move: result, isGameOver: this.game.isGameOver() };
    } catch (e) {
      return { success: false, error: 'Invalid move order', isGameOver: false };
    }
  }

  getFen() {
    return this.game.fen();
  }

  getTurn() {
    return this.game.turn();
  }

  isGameOver() {
    return this.game.isGameOver();
  }

  getGameStatus() {
    if (this.game.isCheckmate()) return 'Checkmate';
    if (this.game.isDraw()) return 'Draw';
    if (this.game.isStalemate()) return 'Stalemate';
    if (this.game.isThreefoldRepetition()) return 'Threefold Repetition';
    if (this.game.isInsufficientMaterial()) return 'Insufficient Material';
    return 'Active';
  }

  // Simple heuristic AI
  getAiMove() {
    const moves = this.game.moves({ verbose: true });
    if (moves.length === 0) return null;

    // Weighting: Checkmate > Capture > Random
    const captures = moves.filter(m => m.captured);
    if (captures.length > 0) {
      // Pick a random capture for basic "aggression"
      return captures[Math.floor(Math.random() * captures.length)];
    }

    // Default to a random legal move
    return moves[Math.floor(Math.random() * moves.length)];
  }
}
