import type { PieceProps } from "../piece-props";

export interface KnightProps extends PieceProps {
   name?: string;
}

export function Knight(props: KnightProps) {
    if(props.color === 'white')
            return (
        <div>    
            <img src="/white_knight.svg" alt="White Knight" />
        </div>);
        else
            return (
        <div>    
            <img src="/black_knight.svg" alt="Black Knight" />
        </div>);
}
