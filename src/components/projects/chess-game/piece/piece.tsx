import type { PieceProps } from "./piece-props";
const pieceImages: Record<string, Record<string, string>> = {
    w: {
        p: "/white_pawn.svg",
        r: "/white_rook.svg",
        n: "/white_knight.svg",
        b: "/white_bishop.svg",
        q: "/white_queen.svg",
        k: "/white_king.svg",
    },
    b: {
        p: "/black_pawn.svg",
        r: "/black_rook.svg",
        n: "/black_knight.svg",
        b: "/black_bishop.svg",
        q: "/black_queen.svg",
        k: "/black_king.svg",
    },
};

export function PieceE(props: PieceProps) {
    const { color, name } = props;
    const src = pieceImages[color][name];
    return (
        <div>
            <img src={src} alt={`${color} ${name}`} />
        </div>
    );
}