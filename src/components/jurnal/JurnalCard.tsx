import type { Jurnal } from "../../types/jurnal";
import { cx } from "../../utils/cx";
import { formatTanggal } from "../../utils/format";
import Button from "../ui/Button";
import DetailLampiran from "./DetailLampiran";
import StatusBadge from "./StatusBadge";
import styles from "./JurnalCard.module.css";

interface JurnalCardProps {
  jurnal: Jurnal;
  variasi?: "normal" | "padat"; // padat: hanya tanggal, status, dan kegiatan
  onHapus?: (id: number) => void; // opsional: tombol hanya muncul jika fungsinya diberikan
}

export default function JurnalCard({ jurnal, variasi = "normal", onHapus }: JurnalCardProps) {
  const padat = variasi === "padat";
  // Field dari API bisa undefined atau null; jadikan array kosong supaya aman dipakai
  const lampiran = jurnal.lampiran ?? [];

  return (
    <article className={cx(styles.card, padat && styles.padat)}>
      <div className={styles.atas}>
        <time className={styles.tanggal} dateTime={jurnal.createdAt}>
          {formatTanggal(jurnal.createdAt)}
        </time>
        <StatusBadge status={jurnal.statusReview} />
      </div>
      <h3 className={styles.kegiatan}>{jurnal.kegiatan}</h3>

      {!padat && (
        <>
          {/* null, undefined, dan string kosong tidak menampilkan apa-apa */}
          {jurnal.hambatan && (
            <p className={styles.baris}>
              <span className={styles.label}>Hambatan:</span> {jurnal.hambatan}
            </p>
          )}
          {jurnal.catatanMentor && (
            <p className={styles.baris}>
              <span className={styles.label}>Catatan mentor:</span> {jurnal.catatanMentor}
            </p>
          )}
          {(lampiran.length > 0 || jurnal.linkCommit) && (
            <div className={styles.bawah}>
              {lampiran.length > 0 && (
                <details className={styles.lampiran}>
                  <summary>Lampiran ({lampiran.length})</summary>
                  <DetailLampiran lampiran={lampiran} />
                </details>
              )}
              {jurnal.linkCommit && (
                <a href={jurnal.linkCommit} target="_blank" rel="noreferrer">
                  Lihat commit (tab baru)
                </a>
              )}
            </div>
          )}
          {onHapus && (
            <div className={styles.aksi}>
              {/* Dibungkus fungsi: dijalankan saat diklik, bukan saat render */}
              <Button variant="danger" ukuran="sm" onClick={() => onHapus(jurnal.id)}>
                Hapus
              </Button>
            </div>
          )}
        </>
      )}
    </article>
  );
}
