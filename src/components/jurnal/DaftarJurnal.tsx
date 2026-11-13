import type { Jurnal, ReviewJurnal } from "../../types/jurnal";
import Alert from "../ui/Alert";
import JurnalCard from "./JurnalCard";
import styles from "./DaftarJurnal.module.css";

interface DaftarJurnalProps {
  jurnal: readonly Jurnal[]; // readonly: komponen ini hanya membaca; urutannya ditentukan pemanggil
  variasi?: "normal" | "padat";
  onHapus?: (id: number) => void;
  onReview?: (id: number, review: ReviewJurnal) => void;
  pesanKosong?: string; // teks saat tidak ada jurnal yang ditampilkan
}

export default function DaftarJurnal({
  jurnal,
  variasi,
  onHapus,
  onReview,
  pesanKosong = "Belum ada jurnal.",
}: DaftarJurnalProps) {
  // Keadaan kosong ditangani di awal (early return)
  if (jurnal.length === 0) {
    return <Alert tipe="info">{pesanKosong}</Alert>;
  }

  return (
    <ul className={styles.daftar}>
      {jurnal.map((j) => (
        // key = id data (bukan indeks): state tiap kartu (detail, konfirmasi, panel) tidak tertukar saat daftar berubah
        <li key={j.id}>
          <JurnalCard jurnal={j} variasi={variasi} onHapus={onHapus} onReview={onReview} />
        </li>
      ))}
    </ul>
  );
}
