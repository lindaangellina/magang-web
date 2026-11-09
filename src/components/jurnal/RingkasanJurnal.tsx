import type { Jurnal } from "../../types/jurnal";
import { hitungRingkasan } from "../../utils/jurnal";
import styles from "./RingkasanJurnal.module.css";

interface RingkasanJurnalProps {
  jurnal: Jurnal[];
}

export default function RingkasanJurnal({ jurnal }: RingkasanJurnalProps) {
  // Turunan data: dihitung saat render dari props, tidak disimpan di tempat lain
  const { total, sudah, belum } = hitungRingkasan(jurnal);

  return (
    <dl className={styles.ringkasan} aria-label="Ringkasan jurnal">
      <div className={styles.item}>
        <dt>Total</dt>
        <dd>{total}</dd>
      </div>
      <div className={styles.item}>
        <dt>Sudah direview</dt>
        <dd>{sudah}</dd>
      </div>
      <div className={styles.item}>
        <dt>Belum</dt>
        <dd>{belum}</dd>
      </div>
    </dl>
  );
}
