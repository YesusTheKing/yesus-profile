import { createBrowserRouter, type RouteObject } from "react-router";
import App from "./components/App";
import { PersonalProfile } from "./components/personal-profile/pp";
import { Projects } from "./components/projects/projects";

/*set up routes for the entire application here*/

const routes: RouteObject[] = [
  {
    path: "/",
    Component: App,
  },
  {
    path: "/projects",
    children: [
      {
        path: '',
        Component: Projects,
      },
      {
        path: "chess-game",
        lazy: async () => {
          const { ChessGame } = await import(
            "./components/projects/chess-game/chess.tsx"
          );
          return { Component: ChessGame };
        },
      },
    ],
  },
  {
    path: "profile",
    Component: PersonalProfile
  },
];
const router = createBrowserRouter(routes);

export default router;
