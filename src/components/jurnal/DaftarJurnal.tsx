import type { Jurnal } from "../../types/jurnal";
import { urutkanTerbaru } from "../../utils/jurnal";
import Alert from "../ui/Alert";
import JurnalCard from "./JurnalCard";
import styles from "./DaftarJurnal.module.css";

interface DaftarJurnalProps {
  jurnal: Jurnal[];
  variasi?: "normal" | "padat";
  onHapus?: (id: number) => void;
}

export default function DaftarJurnal({ jurnal, variasi, onHapus }: DaftarJurnalProps) {
  // Keadaan kosong ditangani di awal (early return)
  if (jurnal.length === 0) {
    return <Alert tipe="info">Belum ada jurnal.</Alert>;
  }

  // Dari yang terbaru, tanpa mengubah array asli (props tidak boleh diubah)
  const terurut = urutkanTerbaru(jurnal);

  return (
    <ul className={styles.daftar}>
      {terurut.map((j) => (
        <li key={j.id}>
          <JurnalCard jurnal={j} variasi={variasi} onHapus={onHapus} />
        </li>
      ))}
    </ul>
  );
}
