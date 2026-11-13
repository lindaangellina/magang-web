import type { UrutanJurnal as TipeUrutan } from "../../types/jurnal";
import { adalahUrutan } from "../../utils/guard";
import styles from "../ui/Form.module.css";

interface UrutanJurnalProps {
  nilai: TipeUrutan;
  onUbah: (nilai: TipeUrutan) => void;
}

// Bonus: pengurutan terbaru atau terlama. Urutannya dihitung saat render di App, bukan disimpan.
export default function UrutanJurnal({ nilai, onUbah }: UrutanJurnalProps) {
  return (
    <div className={styles.kolom}>
      <label className={styles.label} htmlFor="urutan-jurnal">
        Urutkan
      </label>
      <select
        id="urutan-jurnal"
        className={styles.kontrol}
        value={nilai}
        onChange={(e) => {
          const pilihan = e.target.value;
          if (adalahUrutan(pilihan)) onUbah(pilihan);
        }}
      >
        <option value="terbaru">Terbaru dulu</option>
        <option value="terlama">Terlama dulu</option>
      </select>
    </div>
  );
}
