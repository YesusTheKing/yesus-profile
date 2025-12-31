import { Link } from "react-router";
import "./CardsLandingPage.css";

export interface ICard {
  name: string;
  description: string;
  icon: string;
  link: string;
}
const CardsLandingPage = (
  props: { title?: string; cards?: ICard[] } = {
    title: "Welcome to My Portfolio",
    cards: [],
  }
) => {
  const { title, cards } = props;
  return (
    <div className="cards-landing-container">
      <h1>{title}</h1>
      <div className="cards-container">
        {cards?.map((card, index) => (
            <Link to={card.link} className="card" key={index}>
              <div className="icon-container">
                <i className={card.icon}></i>
              </div>
              <h2>{card.name}</h2>
              <p>{card.description}</p>
            </Link>
        ))}
      </div>
    </div>
  );
};

export default CardsLandingPage;
