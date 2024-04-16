import styles from "./multiLayerCanvas.module.css";
import MultiLayerCanvas from "../../components/multiLayerCanvas";
import SingleLayerCanvas from "../../components/singleLayerCanvas";

export default function MultiLayerCanvasPage() {
  return (
    <main className={styles.container}>
      <div className={styles.gradient_red} />
      <div className={styles.gradient_purple} />
      <div className={styles.gradient_yellow} />

      <SingleLayerCanvas />
      <MultiLayerCanvas />
    </main>
  );
}
