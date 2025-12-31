import { Bishop } from "./bishop/bishop";
import { King } from "./king/king";
import { Knight } from "./knight/knight";
import { Pawn } from "./pawn/pawn";
import type { PieceProps } from "./piece-props";
import { Queen } from "./queen/queen";
import { Rook } from "./rook/rook";

export interface ChessGameProps extends PieceProps {
  name?: string;
}

export function ChessGame() {
  return (
    <div>
      <h2>Welcome to the Chess Game!</h2>
      <Pawn color="white" />
      <Queen color="white" />
      <King color="white" />
      <Knight color="white" />
      <Rook color="white" />
      <Bishop color="white" />
      <Bishop color="black" />
      <Pawn color="black" />
      <Queen color="black" />
      <King color="black" />
      <Knight color="black" />
      <Rook color="black" />
    </div>
  );
}
