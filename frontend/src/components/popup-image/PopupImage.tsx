import styles from "./PopupImage.module.css";

export default function PopupImage({ image }: { image: string }) {
  return <img src={image} alt='Изображение' className={styles.image} />;
}
