import type { Jurnal, StatusReview } from "../../types/jurnal";
import { urutkanTerbaru } from "../../utils/jurnal";
import Alert from "../ui/Alert";
import JurnalCard from "./JurnalCard";
import styles from "./DaftarJurnal.module.css";

interface DaftarJurnalProps {
  jurnal: readonly Jurnal[]; // readonly: komponen ini hanya membaca, jurnal.push(...) ditolak TypeScript
  variasi?: "normal" | "padat";
  onHapus?: (id: number) => void;
  onUbahStatus?: (id: number, status: StatusReview) => void;
  pesanKosong?: string; // teks saat tidak ada jurnal yang ditampilkan
}

export default function DaftarJurnal({
  jurnal,
  variasi,
  onHapus,
  onUbahStatus,
  pesanKosong = "Belum ada jurnal.",
}: DaftarJurnalProps) {
  // Keadaan kosong ditangani di awal (early return)
  if (jurnal.length === 0) {
    return <Alert tipe="info">{pesanKosong}</Alert>;
  }

  // Dari yang terbaru, tanpa mengubah array asli (props tidak boleh diubah)
  const terurut = urutkanTerbaru(jurnal);

  return (
    <ul className={styles.daftar}>
      {terurut.map((j) => (
        // key = id data (bukan indeks): state "terbuka" tiap kartu tidak tertukar saat ada yang dihapus
        <li key={j.id}>
          <JurnalCard jurnal={j} variasi={variasi} onHapus={onHapus} onUbahStatus={onUbahStatus} />
        </li>
      ))}
    </ul>
  );
}
