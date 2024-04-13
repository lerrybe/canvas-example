import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main style={{ display: "flex", flexDirection: "column" }}>
      <Link to="/canvas">🔗 CANVAS</Link>
      <Link to="/multi-layer-canvas">🔗 MULTILAYER CANVAS</Link>
    </main>
  );
}
