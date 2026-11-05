import type { ReactNode } from "react";
import styles from "./Kartu.module.css";

interface KartuProps {
  judul: string;
  children: ReactNode; // apa pun yang bisa dirender: teks, elemen, array, null
}

export default function Kartu({ judul, children }: KartuProps) {
  return (
    <section className={styles.kartu}>
      <h2 className={styles.judul}>{judul}</h2>
      <div>{children}</div>
    </section>
  );
}
