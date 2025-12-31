import { createBrowserRouter,type RouteObject} from 'react-router';
import App from './components/App';
import { ChessGame } from './components/chess-game/chess';

/*set up routes for the entire application here*/

const routes: RouteObject[] = [
    {
        path: "/",
        Component: App
    },
    {
        path: "/chess-game/:mode?",
        Component: ChessGame
    }
];
const router = createBrowserRouter(routes);

export default router;