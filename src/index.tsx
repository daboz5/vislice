import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
//import reportWebVitals from './reportWebVitals';

import ErrorPage from './ErrorPage'; 
import Root from './routes/Root';
import Game from './routes/Game';
import AccountPage from './routes/AccountPage';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Game />,
      },
      {
        path: "/account",
        element: <AccountPage />,
      },
    ],
  },
]);

const rootId = document.getElementById('root')!;
ReactDOM.createRoot(rootId).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

//reportWebVitals(console.log);