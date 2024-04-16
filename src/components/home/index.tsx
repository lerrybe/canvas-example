import { useNavigate } from "react-router-dom";
import styles from "./home.module.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className={styles.container}>
      <div className={styles.gradient_red} />
      <div className={styles.gradient_purple} />
      <div className={styles.gradient_yellow} />

      <button className={styles.button} onClick={() => navigate("/canvas")}>
        🔗 Simple canvas
      </button>
      <button
        className={styles.button}
        onClick={() => navigate("/multi-layer-canvas")}>
        🔗 MultiLayer canvas (Optimization)
      </button>
    </main>
  );
}
