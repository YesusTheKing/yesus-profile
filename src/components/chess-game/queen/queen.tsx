import type { PieceProps } from "../piece-props";

export interface QueenProps extends PieceProps {
   name?: string;
}

export function Queen(props: QueenProps) {
    if(props.color === 'white')
            return (
        <div>    
            <img src="/white_queen.svg" alt="White Queen" />
        </div>);
        else
            return (
        <div>    
            <img src="/black_queen.svg" alt="Black Queen" />
        </div>);
}
