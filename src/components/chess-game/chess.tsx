import { Header } from "./header/header";

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
    </div>
  );
}
