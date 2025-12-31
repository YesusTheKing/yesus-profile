import type { ICard } from "../../shared/cards-landing/cards.landing";
import CardsLandingPage from "../../shared/cards-landing/cards.landing";

export function Projects(){
    const cardData: ICard[] = [{
        name: "Chess Game",
        description: "This Project has been developed with the help of React and Typescript and GenAI (design).",
        icon: 'fa-solid fa-chess',
        link: "/projects/chess-game"
    }];
    return (
    <>
    <CardsLandingPage cards={cardData} title="Projects" />
    </>
    );
}