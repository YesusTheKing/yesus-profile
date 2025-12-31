import { DndProvider } from "react-dnd";
import { ChessBoard } from "./chess-board";
import { Header } from "./header/header";
import { HTML5Backend } from "react-dnd-html5-backend";

export interface ChessGameProps{
  // Define any props if needed in the future
  singlePlayer: boolean;
  colorSelection: 'w' | 'b' | 'r';
  twoDimensionalView: boolean;
}

export function ChessGame() {
  return (
    <div>
      <Header />
      <DndProvider backend={HTML5Backend}>
      <ChessBoard />
    </DndProvider>
    </div>
  );
}
