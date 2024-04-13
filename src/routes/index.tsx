import { createBrowserRouter } from "react-router-dom";

import HomePage from "../pages/home";
import CanvasPage from "../pages/canvas";
import RootLayout from "../layouts/root";
import MultiLayerCanvasPage from "../pages/multiLayerCanvas";

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
        path: "canvas",
        element: <CanvasPage />,
      },
      {
        path: "multi-layer-canvas",
        element: <MultiLayerCanvasPage />,
      },
    ],
  },
]);

export default router;
