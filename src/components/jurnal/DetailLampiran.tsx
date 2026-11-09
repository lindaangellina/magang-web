import type { Lampiran } from "../../types/jurnal";
import styles from "./DetailLampiran.module.css";

interface DetailLampiranProps {
  lampiran: Lampiran[];
}

export default function DetailLampiran({ lampiran }: DetailLampiranProps) {
  return (
    <ul className={styles.daftar}>
      {lampiran.map((l, urutan) => (
        // Lampiran tidak punya id; url unik dan stabil, jadi dipakai sebagai key (bukan indeks)
        <li key={l.url}>
          <a href={l.url} target="_blank" rel="noreferrer">
            {l.keterangan ?? `Lampiran ${urutan + 1}`} (tab baru)
          </a>
        </li>
      ))}
    </ul>
  );
}
