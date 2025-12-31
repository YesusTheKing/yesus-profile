export type PieceType =
  | "p"
  | "r"
  | "n"
  | "b"
  | "q"
  | "k";
export type Color = "w" | "b";

export interface Piece {
  type: PieceType;
  color: Color;
  hasMoved: boolean;
}
