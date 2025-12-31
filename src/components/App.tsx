import "./../assets/css/App.css";
import CardsLandingPage from "../shared/cards-landing/cards.landing";

function App() {
  const title = "Welcome to My Portfolio";
  const cardData = [
    {
      name: "Personal Profile",
      description:
        "Learn about my background, skills, and professional journey.",
      link: "/profile",
      icon: "fas fa-user",
    },
    {
      name: "Projects",
      description: "Explore my portfolio of creative and technical projects.",
      link: "/projects",
      icon: "fas fa-laptop-code",
    },
    {
      name: "Blog",
      description: "Read my thoughts on technology, design, and development.",
      link: "/blog",
      icon: "fas fa-blog",
    },
    {
      name: "Gallery",
      description: "View my collection of visual designs and photography.",
      link: "/gallery",
      icon: "fas fa-images",
    },
    {
      name: "Contact",
      description: "Get in touch with me for collaborations or opportunities.",
      link: "/contact",
      icon: "fas fa-envelope",
    },
  ];
  return (
    <>
      <div className="container">
        <CardsLandingPage cards={cardData} title={title} />
      </div>
    </>
  );
}

export default App;
