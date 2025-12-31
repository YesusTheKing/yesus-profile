import { PieceE } from "../piece/piece";

export interface SquareProps {
  color: "w" | "b";
  occupied: boolean;
  occupiedPiece?: "p" | "r" | "n" | "b" | "q" | "k";
  rowNum: number;
  colNum: number;
}

export function Square(props: SquareProps) {
  const { color, occupied, rowNum, colNum, occupiedPiece } = props;
  if (occupied && occupiedPiece) {
    return (
      <div className="square">
        <PieceE color={color} name={occupiedPiece} />
      </div>
    );
  } else {
    return <div className="square" data-row={rowNum} data-col={colNum}></div>;
  }
}
