import type { PieceProps } from "../piece-props";

export interface RookProps extends PieceProps {
   name?: string;
}

export function Rook(props: RookProps) {
    if(props.color === 'white')
            return (
        <div>    
            <img src="/white_rook.svg" alt="White Rook" />
        </div>);
        else
            return (
        <div>    
            <img src="/black_rook.svg" alt="Black Rook" />
        </div>);
}
