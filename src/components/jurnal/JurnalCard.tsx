import type { Jurnal } from "../../types/jurnal";
import { formatTanggal } from "../../utils/format";
import InfoBaris from "../InfoBaris";
import Button from "../ui/Button";
import StatusBadge from "./StatusBadge";
import styles from "./JurnalCard.module.css";

interface JurnalCardProps {
  jurnal: Jurnal;
  onHapus?: (id: number) => void; // opsional: tombol hanya muncul jika fungsinya diberikan
}

export default function JurnalCard({ jurnal, onHapus }: JurnalCardProps) {
  return (
    <article className={styles.card}>
      <h3 className={styles.judul}>{jurnal.kegiatan}</h3>
      <InfoBaris label="Tanggal" nilai={formatTanggal(jurnal.tanggal)} />
      <div className={styles.baris}>
        <span className={styles.label}>Review:</span> <StatusBadge status={jurnal.statusReview} />
      </div>
      {/* Field opsional: null tidak tampil */}
      {jurnal.hambatan && <InfoBaris label="Hambatan" nilai={jurnal.hambatan} />}
      {jurnal.lampiran.length > 0 && <InfoBaris label="Lampiran" nilai={jurnal.lampiran.join(", ")} />}
      {onHapus && (
        <div className={styles.aksi}>
          {/* Dibungkus fungsi: dijalankan saat diklik, bukan saat render */}
          <Button variant="danger" ukuran="sm" onClick={() => onHapus(jurnal.id)}>
            Hapus
          </Button>
        </div>
      )}
    </article>
  );
}
