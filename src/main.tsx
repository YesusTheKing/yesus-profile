import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './assets/css/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RouterProvider } from "react-router/dom";
import router  from './routes';

const root = document.getElementById("root")!;

createRoot(root).render(
  <StrictMode>
     <RouterProvider router={router} />
  </StrictMode>
)
