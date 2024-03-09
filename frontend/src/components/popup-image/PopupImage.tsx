import React from "react";

import styles from "./PopupImage.module.css";

export default function PopupImage({ image }: { image: string }) {
  return (
    <div>
      <img src={image} alt='Изображение' className={styles.image} />
    </div>
  );
}
