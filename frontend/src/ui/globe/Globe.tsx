import { useEffect, useRef } from "react";

import styles from "./Globe.module.css";

export default function Globe() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const setGlobeWidth = () => {
      const doc = document.documentElement;
      doc.style.setProperty("--globe-width", `${ref.current?.clientWidth}px`);
    };
    setGlobeWidth();
    window.addEventListener("resize", setGlobeWidth);

    return () => {
      window.removeEventListener("resize", setGlobeWidth);
    };
  }, [ref.current?.clientWidth]);
  return (
    <div className={styles.wrapper}>
      <div className={styles.content} ref={ref}>
        <div className={styles.sphere}></div>
        <div className={styles.map}>
          <div className={styles.map_back}></div>
          <div className={styles.map_front}></div>
        </div>
      </div>
    </div>
  );
}
