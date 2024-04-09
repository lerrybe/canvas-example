import { createBrowserRouter } from "react-router-dom";

import Wip from "../pages/wip";
import Home from "../pages/home";
import RootLayout from "../layouts/root";

const router = createBrowserRouter([
  {
    path: "",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "canvas-to-fabric.js",
        element: <Wip name="canvasAPI로 간단히 구현해보기" color="#4b52b1" />,
      },
      {
        path: "example",
        element: <Wip name="예시" color="#4b52b1" />,
      },
    ],
  },
]);

export default router;
