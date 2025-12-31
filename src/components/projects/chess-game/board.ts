// src/chess/board.ts
import { isCastlingMove, shouldPromotePawn, type Move } from './moves';
import type { Color, Piece, PieceType } from './piece/pieces';
import { ALL_SQUARES, type Square } from './square/squares';


/**
 * Board = map of square → piece or null
 */
export type Board = Record<Square, Piece | null>;

/**
 * Creates an empty board (all squares = null)
 */
export function createEmptyBoard(): Board {
  const board = {} as Board;

  for (const square of ALL_SQUARES) {
    board[square] = null;
  }

  return board;
}

// Add below existing code in board.ts

/**
 * Helper to create a piece
 */
function createPiece(type: PieceType, color: Color): Piece {
  return {
    type,
    color,
    hasMoved: false,
  };
}

/**
 * Creates the standard chess starting position
 */
export function createInitialBoard(): Board {
  const board = createEmptyBoard();

  // --- White pieces ---
  board.a1 = createPiece('r', 'w');
  board.b1 = createPiece('n', 'w');
  board.c1 = createPiece('b', 'w');
  board.d1 = createPiece('q', 'w');
  board.e1 = createPiece('k', 'w');
  board.f1 = createPiece('b', 'w');
  board.g1 = createPiece('n', 'w');
  board.h1 = createPiece('r', 'w');

  for (const file of ['a','b','c','d','e','f','g','h'] as const) {
    board[`${file}2`] = createPiece('p', 'w');
  }

  // --- Black pieces ---
  board.a8 = createPiece('r', 'b');
  board.b8 = createPiece('n', 'b');
  board.c8 = createPiece('b', 'b');
  board.d8 = createPiece('q', 'b');
  board.e8 = createPiece('k', 'b');
  board.f8 = createPiece('b', 'b');
  board.g8 = createPiece('n', 'b');
  board.h8 = createPiece('r', 'b');

  for (const file of ['a','b','c','d','e','f','g','h'] as const) {
    board[`${file}7`] = createPiece('p', 'b');
  }

  return board;
}

export type BoardState = Record<Square, Piece | null>;

export function makeMove(
  board: BoardState,
  from: Square,
  to: Square,
  lastMove?: Move
): BoardState {
  if(board[from] === null) {
    throw new Error('No piece at the source square');
  }
  const newBoard: BoardState = { ...board };

  
  if(shouldPromotePawn(board[from]!, to)) {
    newBoard[to] = {
      type: 'q',
      color: board[from]!.color,
      hasMoved: true
    };
  } else {
    newBoard[to] = board[from];
    newBoard[to].hasMoved = true;
    const piece: Piece = board[from]!;
    // En Passant capture
    if (piece.type === 'p' &&
        lastMove &&
        lastMove.piece.type === 'p' &&
        Math.abs(Number(lastMove.from[1]) - Number(lastMove.to[1])) === 2 &&
        lastMove.to[1] === from[1] &&
        Math.abs(lastMove.to.charCodeAt(0) - from.charCodeAt(0)) === 1 &&
        to === `${lastMove.to[0]}${piece.color === 'w' ? 6 : 3}`) {

      // Remove captured pawn
      newBoard[lastMove.to] = null;
    }

      if (isCastlingMove(from, to)) {
    // White king side
    if (from === 'e1' && to === 'g1') {
      newBoard['f1'] = { ...newBoard['h1']!, hasMoved: true };
      newBoard['h1'] = null;
    }
    // White queen side
    if (from === 'e1' && to === 'c1') {
      newBoard['d1'] = { ...newBoard['a1']!, hasMoved: true };
      newBoard['a1'] = null;
    }
    // Black king side
    if (from === 'e8' && to === 'g8') {
      newBoard['f8'] = { ...newBoard['h8']!, hasMoved: true };
      newBoard['h8'] = null;
    }
    // Black queen side
    if (from === 'e8' && to === 'c8') {
      newBoard['d8'] = { ...newBoard['a8']!, hasMoved: true };
      newBoard['a8'] = null;
    }
  }
  }
  newBoard[from] = null;
  return newBoard;
}

export function findKing(
  board: BoardState,
  color: Color
): Square {
  for (const square in board) {
    const piece = board[square as Square];
    if (piece?.type === 'k' && piece.color === color) {
      return square as Square;
    }
  }
  throw new Error('King not found');
}