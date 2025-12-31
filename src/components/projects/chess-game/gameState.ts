import { findKing, type BoardState } from './board';
import { hasAnyLegalMove, isSquareAttacked, type Move } from './moves';
import type { Color } from './piece/pieces';

export function isInCheck(
  board: BoardState,
  color: Color
): boolean {
  const kingSquare = findKing(board, color);
  const opponent = color === 'w' ? 'b' : 'w';
  return isSquareAttacked(board, kingSquare, opponent);
}

export type GameStatus =
  | 'playing'
  | 'check'
  | 'checkmate'
  | 'stalemate';

export function getGameStatus(
  board: BoardState,
  turn: Color
): GameStatus {
  const inCheck = isInCheck(board, turn);
  const hasMoves = hasAnyLegalMove(board, turn);

  if (inCheck && !hasMoves) return 'checkmate';
  if (!inCheck && !hasMoves) return 'stalemate';
  if (inCheck) return 'check';

  return 'playing';
}

export interface GameSnapshot {
  board: BoardState;
  turn: Color;
  lastMove: Move | null;
}

