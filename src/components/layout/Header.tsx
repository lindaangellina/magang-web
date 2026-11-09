import styles from "./Header.module.css";

interface HeaderProps {
  judul: string;
  namaPeserta: string;
}

export default function Header({ judul, namaPeserta }: HeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.judul}>{judul}</h1>
      <p className={styles.nama}>{namaPeserta}</p>
    </header>
  );
}
