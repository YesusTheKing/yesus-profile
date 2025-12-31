export interface PawnProps {
    color: 'white' | 'black';
    rotated?: boolean;
}

export function Pawn(props: PawnProps) {
        if(props.color === 'white')
            return (
        <div>    
            <img src="/white_pawn.svg" alt="White Pawn" />
        </div>);
        else
            return (
        <div>    
            <img src="/black_pawn.svg" alt="Black Pawn" />
        </div>);
}