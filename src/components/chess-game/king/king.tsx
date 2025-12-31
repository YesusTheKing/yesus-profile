import type { PieceProps } from "../piece-props";

export interface KingProps extends PieceProps {
   name?: string;
}

export function King(props: KingProps) {
    if(props.color === 'white')
            return (
        <div>    
            <img src="/white_king.svg" alt="White King" />
        </div>);
        else
            return (
        <div>    
            <img src="/black_king.svg" alt="Black King" />
        </div>);
}
