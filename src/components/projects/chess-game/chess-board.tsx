import { useRef, useState } from "react";
import { createInitialBoard, makeMove } from "./board";
import { PieceE } from "./piece/piece";
import type { Color, Piece } from "./piece/pieces";
import { ALL_SQUARES, type Square } from "./square/squares";
import { getLegalMoves, type Move } from "./moves";
import { getGameStatus, type GameSnapshot } from "./gameState";
import { useDrag, useDrop } from "react-dnd";
const BOARD_SIZE = 8;

export function ChessBoard() {
  const [board, setBoard] = useState(createInitialBoard);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);
  const [turn, setTurn] = useState<Color>("w");
  const [lastMove, setLastMove] = useState<Move | null>(null);
  const [history, setHistory] = useState<GameSnapshot[]>([]);
  const [flipped, setFlipped] = useState(false);

  const gameStatus = getGameStatus(board, turn);
  const displaySquares = flipped ? [...ALL_SQUARES].reverse() : ALL_SQUARES;
  return (
    <>
      <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
        Turn: {turn.toUpperCase()} | Status: {gameStatus.toUpperCase()}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
          width: "500px",
          height: "500px",
          border: "2px solid #333",
        }}
      >
        {displaySquares.map((square) => (
          <BoardSquare
            key={square}
            square={square}
            piece={board[square]}
            isSelected={selectedSquare === square}
            isMoveTarget={legalMoves.includes(square)}
            onClick={() => handleSquareClick(square)}
            onMove={handleMove}
          />
        ))}
      </div>
      <button
        onClick={undo}
        disabled={history.length === 0}
        className="btn btn-secondary"
      >
        Undo
      </button>
      <button onClick={() => setFlipped((f) => !f)} className="btn btn-primary">
        Flip Board
      </button>
    </>
  );

  function undo() {
    const prev = history.at(-1);
    if (!prev) return;

    setBoard(prev.board);
    setTurn(prev.turn);
    setLastMove(prev.lastMove);
    setHistory((h) => h.slice(0, -1));
  }

  function handleMove(from: Square, to: Square) {
    //handleSquareClick(to, from); // reuse existing logic
    const legalMoves = getLegalMoves(board, from, lastMove);
    if (from && legalMoves.includes(to)) {
     setHistory((prev) => [...prev, { board, turn, lastMove }]);
      setBoard((prev) =>
        makeMove(prev, from, to, lastMove || undefined)
      );
      setSelectedSquare(null);
      setLegalMoves([]);
      setTurn((prev) => (prev === "w" ? "b" : "w"));
      setLastMove({
        from: from,
        to: to,
        piece: board[from]!,
      });
      return;
    }
  }

  function handleSquareClick(square: Square) {
    if (gameStatus === "checkmate" || gameStatus === "stalemate") {
      return;
    }
    // Execute move
    if (selectedSquare && legalMoves.includes(square)) {
      setHistory((prev) => [...prev, { board, turn, lastMove }]);
      setBoard((prev) =>
        makeMove(prev, selectedSquare, square, lastMove || undefined)
      );
      setSelectedSquare(null);
      setLegalMoves([]);
      setTurn((prev) => (prev === "w" ? "b" : "w"));
      setLastMove({
        from: selectedSquare,
        to: square,
        piece: board[selectedSquare]!,
      });
      return;
    }

    const piece = board[square];

    // Only allow selecting current player's piece
    if (piece && piece.color === turn) {
      setSelectedSquare(square);
      setLegalMoves(getLegalMoves(board, square, lastMove));
      return;
    }

    // Otherwise clear
    setSelectedSquare(null);
    setLegalMoves([]);
  }
}

function isDarkSquare(square: Square): boolean {
  const file = square.charCodeAt(0) - "a".charCodeAt(0);
  const rank = Number(square[1]) - 1;

  return (file + rank) % 2 === 0;
}

function BoardSquare({
  square,
  piece,
  isSelected,
  isMoveTarget,
  onClick,
  onMove,
}: {
  square: Square;
  piece: Piece | null;
  isSelected: boolean;
  isMoveTarget: boolean;
  onClick: () => void;
  onMove: (from: Square, to: Square) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Drag source
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "piece",
    item: { square },
    canDrag: !!piece,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Drop target
  const [, drop] = useDrop(() => ({
    accept: "piece",
    drop: (item: { square: Square }) => {
      onMove(item.square, square); // from -> to
    },
  }));
  // Combine drag + drop refs
  drag(drop(ref));
  const isDark = isDarkSquare(square);

  let backgroundColor = isDark ? "#769656" : "#eeeed2";
  if (isMoveTarget) backgroundColor = "#a9a9a9";
  if (isSelected) backgroundColor = "#f6f669";

  return (
    <div
      ref={ref}
      style={{
        backgroundColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "12px",
        opacity: isDragging ? 0.5 : 1,
        userSelect: "none",
        cursor: "pointer", // Optional: improves UX
      }}
      onClick={onClick}
    >
      {piece && (
        <PieceE
          color={piece.color}
          name={piece.type}
        />
      )}
    </div>
  );
}
