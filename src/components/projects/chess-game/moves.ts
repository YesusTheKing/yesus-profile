import { findKing, makeMove, type BoardState } from "./board";
import type { Color, Piece } from "./piece/pieces";
import type { Square } from "./square/squares";

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

function squareToCoords(square: Square) {
  return {
    file: files.indexOf(square[0]),
    rank: Number(square[1]) - 1,
  };
}
export interface Move {
  from: Square;     // e.g., "e2"
  to: Square;       // e.g., "e4"
  piece: Piece;     // the piece being moved
  capturedPiece?: Piece; // optional, if a piece was captured
  isCastling?: boolean;  // optional, king-side or queen-side
  isEnPassant?: boolean; // optional, for en passant
  isPromotion?: boolean; // optional, for pawn promotion
}

function coordsToSquare(file: number, rank: number): Square | null {
  if (file < 0 || file > 7 || rank < 0 || rank > 7) return null;
  return `${files[file]}${rank + 1}` as Square;
}

function getKnightMoves(board: BoardState, from: Square): Square[] {
  const { file, rank } = squareToCoords(from);
  const piece = board[from]!;
  const moves: Square[] = [];

  const offsets = [
    [1, 2],
    [2, 1],
    [-1, 2],
    [-2, 1],
    [1, -2],
    [2, -1],
    [-1, -2],
    [-2, -1],
  ];

  for (const [df, dr] of offsets) {
    const target = coordsToSquare(file + df, rank + dr);
    if (!target) continue;

    const targetPiece = board[target];
    if (!targetPiece || targetPiece.color !== piece.color) {
      moves.push(target);
    }
  }

  return moves;
}

export function getPseudoLegalMoves(board: BoardState, from: Square,lastMove?: Move | null): Square[] {
  const piece = board[from];
  if (!piece) return [];

  switch (piece.type) {
    case "p":
      return getPawnMoves(board, from, lastMove);
    case "r":
      return getRookMoves(board, from);
    case "n":
      return getKnightMoves(board, from);
    case "b":
      return getBishopMoves(board, from);
    case "q":
      return getQueenMoves(board, from);
    case "k":
      return getKingMoves(board, from);
    default:
      return [];
  }
}

function getRayMoves(
  board: BoardState,
  from: Square,
  directions: Array<[number, number]>
): Square[] {
  const { file, rank } = squareToCoords(from);
  const piece = board[from]!;
  const moves: Square[] = [];

  for (const [df, dr] of directions) {
    let f = file + df;
    let r = rank + dr;

    while (true) {
      const target = coordsToSquare(f, r);
      if (!target) break;

      const targetPiece = board[target];

      if (!targetPiece) {
        moves.push(target);
      } else {
        if (targetPiece.color !== piece.color) {
          moves.push(target);
        }
        break; // blocked
      }

      f += df;
      r += dr;
    }
  }

  return moves;
}

function getRookMoves(board: BoardState, from: Square): Square[] {
  return getRayMoves(board, from, [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]);
}

function getBishopMoves(board: BoardState, from: Square): Square[] {
  return getRayMoves(board, from, [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ]);
}

function getQueenMoves(board: BoardState, from: Square): Square[] {
  return getRayMoves(board, from, [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ]);
}

function getPawnMoves(board: BoardState, from: Square, lastMove?: Move | null): Square[] {
  const piece = board[from]!;
  const { file, rank } = squareToCoords(from);
  const moves: Square[] = [];

  const direction = piece.color === "w" ? 1 : -1;
  const startRank = piece.color === "w" ? 1 : 6;

  // 1-step forward
  const oneStep = coordsToSquare(file, rank + direction);
  if (oneStep && !board[oneStep]) {
    moves.push(oneStep);

    // 2-step forward (only if 1-step is free)
    const twoStep = coordsToSquare(file, rank + 2 * direction);
    if (rank === startRank && twoStep && !board[twoStep]) {
      moves.push(twoStep);
    }
  }

  // Diagonal captures
  for (const df of [-1, 1]) {
    const captureSquare = coordsToSquare(file + df, rank + direction);
    if (!captureSquare) continue;

    const targetPiece = board[captureSquare];
    if (targetPiece && targetPiece.color !== piece.color) {
      moves.push(captureSquare);
    }
  }

  // TODO: getEnPassantMoves
    const enPassantMoves = getEnPassantMoves(board, from, lastMove || null);
    moves.push(...enPassantMoves);

  return moves;
}

function getKingMoves(board: BoardState, from: Square): Square[] {
  const { file, rank } = squareToCoords(from);
  const piece = board[from]!;
  const moves: Square[] = [];

  for (let df = -1; df <= 1; df++) {
    for (let dr = -1; dr <= 1; dr++) {
      if (df === 0 && dr === 0) continue;

      const target = coordsToSquare(file + df, rank + dr);
      if (!target) continue;

      const targetPiece = board[target];
      if (!targetPiece || targetPiece.color !== piece.color) {
        moves.push(target);
      }
    }
  }

  addCastlingMoves(board, from, moves);

  return moves;
}

function addCastlingMoves(board: BoardState, from: Square, moves: Square[]) {
  const piece = board[from]!;
  if (piece.type !== "k") return;

  if (piece.color === "w" && from === "e1") {
    // King side
    if (
      board.f1 === null &&
      board.g1 === null &&
      board.h1?.type === "r" &&
      canCastle(board, "e1", "h1") &&
        isCastlingSafe(board, 'w', ['e1', 'f1', 'g1'])
    ) {
      moves.push("g1");
    }

    // Queen side
    if (
      board.d1 === null &&
      board.c1 === null &&
      board.b1 === null &&
      board.a1?.type === "r" &&
      canCastle(board, "e1", "a1") &&
        isCastlingSafe(board, 'w', ['e1', 'd1', 'c1'])
    ) {
      moves.push("c1");
    }
  }

  if (piece.color === "b" && from === "e8") {
    // King side
    if (
      board.f8 === null &&
      board.g8 === null &&
      board.h8?.type === "r" &&
      canCastle(board, "e8", "h8") &&
        isCastlingSafe(board, 'b', ['e8', 'f8', 'g8'])
    ) {
      moves.push("g8");
    }

    // Queen side
    if (
      board.d8 === null &&
      board.c8 === null &&
      board.b8 === null &&
      board.a8?.type === "r" &&
      canCastle(board, "e8", "a8") &&
        isCastlingSafe(board, 'b', ['e8', 'd8', 'c8'])
    ) {
      moves.push("c8");
    }
  }
}
export function isSquareAttacked(
  board: BoardState,
  square: Square,
  byColor: Color
): boolean {
  for (const from in board) {
    const piece = board[from as Square];
    if (!piece || piece.color !== byColor) continue;

    const moves = getPseudoLegalMoves(board, from as Square);
    if (moves.includes(square)) {
      return true;
    }
  }
  return false;
}

export function getLegalMoves(board: BoardState, from: Square, lastMove?: Move | null): Square[] {
  const piece = board[from];
  if (!piece) return [];

  const pseudoMoves = getPseudoLegalMoves(board, from, lastMove);
  const legalMoves: Square[] = [];

  for (const to of pseudoMoves) {
    const simulatedBoard = makeMove(board, from, to);
    const kingSquare = findKing(simulatedBoard, piece.color);
    const opponentColor = piece.color === "w" ? "b" : "w";

    if (!isSquareAttacked(simulatedBoard, kingSquare, opponentColor)) {
      legalMoves.push(to);
    }
  }

  return legalMoves;
}

export function hasAnyLegalMove(board: BoardState, color: Color): boolean {
  for (const square in board) {
    const piece = board[square as Square];
    if (!piece || piece.color !== color) continue;

    if (getLegalMoves(board, square as Square).length > 0) {
      return true;
    }
  }
  return false;
}

export function shouldPromotePawn(piece: Piece, to: Square): boolean {
  if (piece.type !== "p") return false;

  const rank = to[1];
  return (
    (piece.color === "w" && rank === "8") ||
    (piece.color === "b" && rank === "1")
  );
}

function canCastle(
  board: BoardState,
  kingSquare: Square,
  rookSquare: Square
): boolean {
  const king = board[kingSquare];
  const rook = board[rookSquare];

  if (!king || !rook) return false;
  if (king.hasMoved || rook.hasMoved) return false;
  if (rook.type !== "r") return false;

  const squaresBetween = rookSquare[0] === "h" ? ["f", "g"] : ["b", "c", "d"];

  const rank = kingSquare[1];

  return squaresBetween.every(
    (file) => board[`${file}${rank}` as Square] === null
  );
}


function isCastlingSafe(
  board: BoardState,
  kingColor: Color,
  squaresToCheck: Square[]
): boolean {
  const opponentColor = kingColor === 'w' ? 'b' : 'w';
  return squaresToCheck.every(square => !isSquareAttacked(board, square, opponentColor));
}

export function isCastlingMove(from: Square, to: Square): boolean {
  return (from === 'e1' && (to === 'g1' || to === 'c1')) ||
         (from === 'e8' && (to === 'g8' || to === 'c8'));
}

export function getEnPassantMoves(
  board: BoardState,
  from: Square,
  lastMove: Move | null
): Square[] {
  if (!lastMove) return [];

  const piece = board[from];
  if (!piece || piece.type !== 'p') return [];

  const direction = piece.color === 'w' ? 1 : -1;

  // Last move must be opponent pawn moving 2 squares
  if (lastMove.piece.type === 'p' &&
      Math.abs(Number(lastMove.from[1]) - Number(lastMove.to[1])) === 2 &&
      lastMove.to[1] === from[1]) {
    // Check adjacency
    if (Math.abs(lastMove.to.charCodeAt(0) - from.charCodeAt(0)) === 1) {
      const targetSquare = `${lastMove.to[0]}${Number(lastMove.to[1]) + direction}` as Square;
      return [targetSquare];
    }
  }

  return [];
}
