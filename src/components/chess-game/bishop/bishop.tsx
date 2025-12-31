import type { PieceProps } from "../piece-props";

export interface BishopProps extends PieceProps {
   name?: string;
}

export function Bishop(props: BishopProps) {
    if(props.color === 'white')
            return (
        <div>    
            <img src="/white_bishop.svg" alt="White Bishop" />
        </div>);
        else
            return (
        <div>    
            <img src="/black_bishop.svg" alt="Black Bishop" />
        </div>);
}
