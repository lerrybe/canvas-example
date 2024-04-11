import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <button onClick={() => navigate("/canvas-to-fabric.js")}>
        CANVAS to FABRIC.JS
      </button>
    </>
  );
}
