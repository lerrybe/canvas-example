import { createBrowserRouter } from "react-router-dom";

import HomePage from "../pages/home";
import CanvasPage from "../pages/canvas";
import RootLayout from "../layouts/root";

const router = createBrowserRouter([
  {
    path: "",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "canvas-to-fabric.js",
        element: <CanvasPage />,
      },
    ],
  },
]);

export default router;
