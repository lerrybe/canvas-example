import { createBrowserRouter } from "react-router-dom";

import WipPage from "../pages/wip";
import HomePage from "../pages/home";
import CanvasPage from "../pages/canvas";
import RootLayout from "../layouts/root";
import ExampleLayout from "../layouts/example";

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
      {
        path: "example",
        element: <ExampleLayout />,
        children: [
          {
            path: "intro-1",
            element: <WipPage name="1" color="#4b52b1" />,
          },
        ],
      },
    ],
  },
]);

export default router;
