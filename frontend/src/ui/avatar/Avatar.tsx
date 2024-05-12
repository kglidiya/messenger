import styles from "./Avatar.module.css";

interface IAvatarProps {
  avatar: string;
  width: number;
  height: number;
}

export default function Avatar({ avatar, width, height }: IAvatarProps) {
  return (
    <img src={avatar} alt='аватар' className={styles.image} style={{ width: `${width}px`, height: `${height}px` }} />
  );
}
