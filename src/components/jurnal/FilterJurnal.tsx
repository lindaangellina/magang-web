import type { FilterStatus } from "../../types/jurnal";
import { adalahFilterStatus } from "../../utils/guard";
import styles from "../ui/Form.module.css";

interface FilterJurnalProps {
  nilai: FilterStatus;
  onUbah: (nilai: FilterStatus) => void;
}

export default function FilterJurnal({ nilai, onUbah }: FilterJurnalProps) {
  return (
    <div className={styles.kolom}>
      <label className={styles.label} htmlFor="filter-status">
        Status review
      </label>
      <select
        id="filter-status"
        className={styles.kontrol}
        value={nilai}
        onChange={(e) => {
          const pilihan = e.target.value; // bertipe string, belum tentu salah satu opsi
          if (adalahFilterStatus(pilihan)) onUbah(pilihan); // setelah guard, tipenya FilterStatus (tanpa as)
        }}
      >
        <option value="semua">Semua</option>
        <option value="belum">Belum direview</option>
        <option value="sudah">Sudah direview</option>
      </select>
    </div>
  );
}
